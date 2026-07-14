import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { RawQuestion } from "./types.ts";
import { exportQuestionsToCsv } from "./export-csv.ts";
import { REQUIRED_COLUMNS, REQUIRED_ALTERNATIVE_LETTERS } from "../../../scripts/seed/questions/convert/columns.ts";
import { convertQuestions } from "../../../scripts/seed/questions/convert/convert.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const OUTPUT_DIR = resolve(ROOT, "output");

interface ValidationIssue {
  check: string;
  detail: string;
}

async function main() {
  const rawPath = resolve(OUTPUT_DIR, "questions.raw.json");
  if (!existsSync(rawPath)) {
    throw new Error(`Arquivo não encontrado: ${rawPath}. Rode "npm run pipeline:extract" primeiro.`);
  }

  const raw = await readFile(rawPath, "utf-8");
  const questions = JSON.parse(raw) as RawQuestion[];

  const { csv, summary } = exportQuestionsToCsv(questions);

  await mkdir(OUTPUT_DIR, { recursive: true });
  const csvPath = resolve(OUTPUT_DIR, "questions.csv");
  await writeFile(csvPath, csv, "utf-8");

  const localIssues: ValidationIssue[] = [];

  // 1. Número de questões: nada perdido além das anuladas descartadas de propósito.
  const expectedExported = summary.totalInput - summary.skippedAnuladas;
  if (summary.exported !== expectedExported) {
    localIssues.push({
      check: "numero_de_questoes",
      detail: `Esperado ${expectedExported} linhas exportadas (total ${summary.totalInput} - ${summary.skippedAnuladas} anuladas), mas foram escritas ${summary.exported}.`,
    });
  }

  // 2. Colunas obrigatórias: header do CSV precisa conter todas as REQUIRED_COLUMNS reais do projeto.
  const headerLine = csv.split("\r\n")[0];
  const headerColumns = new Set(headerLine.split(","));
  const missingRequiredColumns = REQUIRED_COLUMNS.filter((c) => !headerColumns.has(c));
  if (missingRequiredColumns.length > 0) {
    localIssues.push({
      check: "colunas_obrigatorias",
      detail: `Faltando no header do CSV: ${missingRequiredColumns.join(", ")}.`,
    });
  }

  // 3. Alternativas e gabaritos: toda linha exportada (exceto REVIEW_REQUIRED com dados incompletos
  //    de propósito) deve ter A-D preenchidas e correct_answer batendo com uma alternativa presente.
  for (const q of questions) {
    if (q.status === "ANULADA") continue;
    const missingRequiredAlts = REQUIRED_ALTERNATIVE_LETTERS.filter(
      (letter) => !q.alternatives[letter as "A" | "B" | "C" | "D"],
    );
    if (q.status === "VALID" && missingRequiredAlts.length > 0) {
      localIssues.push({
        check: "alternativas",
        detail: `Questão ${q.number}: status VALID mas faltando alternativa(s) ${missingRequiredAlts.join(", ")}.`,
      });
    }
    if (q.status === "VALID" && !q.correctAnswer) {
      localIssues.push({
        check: "gabaritos",
        detail: `Questão ${q.number}: status VALID mas sem correctAnswer.`,
      });
    }
    if (q.status === "VALID" && q.correctAnswer && !q.alternatives[q.correctAnswer as "A" | "B" | "C" | "D" | "E"]) {
      localIssues.push({
        check: "gabaritos",
        detail: `Questão ${q.number}: correctAnswer "${q.correctAnswer}" não corresponde a nenhuma alternativa extraída.`,
      });
    }
  }

  // 4. UTF-8: reler o arquivo escrito e confirmar que não há caracteres de substituição (U+FFFD),
  //    sinal de que algo foi salvo com encoding incorreto.
  const rewritten = await readFile(csvPath, "utf-8");
  if (rewritten.includes("�")) {
    localIssues.push({
      check: "utf8",
      detail: "O arquivo questions.csv contém caracteres de substituição (\\uFFFD) — possível problema de encoding.",
    });
  }

  // 5. Compatibilidade com convert:questions: roda a validação REAL do projeto (mesmo código
  //    usado por "npm run convert:questions"), apontando a saída para um arquivo descartável —
  //    nunca escreve em docs/imports/questions.csv nem em docs/seeds/questions.json.
  const convertOutputPath = resolve(OUTPUT_DIR, "questions.converted.json");
  const convertResult = convertQuestions(csvPath, convertOutputPath);

  await mkdir(OUTPUT_DIR, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    localValidation: { issues: localIssues, ok: localIssues.length === 0 },
    convertQuestionsCompatibility: convertResult.ok
      ? { ok: true, convertedCount: convertResult.count }
      : {
          ok: false,
          issueCount: convertResult.issues.length,
          issues: convertResult.issues,
          note:
            "Campos que exigem classificação humana (position, board, contest, subject, " +
            "topic, year, explanation) ficam em branco no CSV gerado por esta ferramenta, " +
            "pois não são deriváveis do PDF sem fabricar conteúdo. É esperado que " +
            "convert:questions rejeite o CSV até que um humano preencha esses campos — " +
            "isso não é uma falha da exportação, é o limite intencional desta v1.",
        },
  };
  await writeFile(resolve(OUTPUT_DIR, "export-report.json"), JSON.stringify(report, null, 2), "utf-8");

  console.log("=== EXPORT ===");
  console.log(`Questões no raw.json: ${summary.totalInput}`);
  console.log(`Anuladas descartadas (nunca entram no CSV): ${summary.skippedAnuladas}`);
  console.log(`Exportadas para questions.csv: ${summary.exported}`);
  console.log(`  ...das quais REVIEW_REQUIRED (mantidas, marcadas, status=INACTIVE): ${summary.reviewRequiredExported}`);
  console.log(`\nValidação local: ${localIssues.length === 0 ? "OK" : `${localIssues.length} problema(s)`}`);
  for (const issue of localIssues) console.log(`  - [${issue.check}] ${issue.detail}`);

  console.log(`\nCompatibilidade com convert:questions: ${convertResult.ok ? "OK (sem edição manual)" : "requer classificação humana"}`);
  if (!convertResult.ok) {
    const byField = new Map<string, number>();
    for (const issue of convertResult.issues) {
      byField.set(issue.field, (byField.get(issue.field) ?? 0) + 1);
    }
    for (const [field, count] of byField) {
      console.log(`  - ${field}: ${count} ocorrência(s)`);
    }
  }

  console.log(`\nArquivos gerados em: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
