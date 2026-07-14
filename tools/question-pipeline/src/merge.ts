import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ClassificationEntry, RawQuestion } from "./types.ts";
import { mergeQuestionsToCsv } from "./merge-questions.ts";
import {
  assertClassificationArray,
  parseJsonFile,
} from "./validate-classification.ts";
import { REQUIRED_COLUMNS, REQUIRED_ALTERNATIVE_LETTERS } from "../../../scripts/seed/questions/convert/columns.ts";
import { convertQuestions } from "../../../scripts/seed/questions/convert/convert.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const OUTPUT_DIR = resolve(ROOT, "output");

async function main() {
  const rawPath = resolve(OUTPUT_DIR, "questions.raw.json");
  const classPath = resolve(OUTPUT_DIR, "classification.json");
  const classFallbackPath = resolve(OUTPUT_DIR, "classification.template.json");
  const resolvedClassPath = existsSync(classPath) ? classPath : classFallbackPath;

  if (!existsSync(rawPath)) {
    throw new Error(`Arquivo não encontrado: ${rawPath}. Rode "npm run pipeline:extract" primeiro.`);
  }
  if (!existsSync(resolvedClassPath)) {
    throw new Error(
      `Arquivo não encontrado: ${classPath} (ou ${classFallbackPath}). Rode "npm run pipeline:template" e preencha classification.json.`,
    );
  }

  const rawContent = await readFile(rawPath, "utf-8");
  const classContent = await readFile(resolvedClassPath, "utf-8");

  const rawParsed = parseJsonFile<RawQuestion[]>(rawContent, "questions.raw.json");
  const classLabel = resolvedClassPath.endsWith("classification.json")
    ? "classification.json"
    : "classification.template.json";
  const classParsed = parseJsonFile<unknown>(classContent, classLabel);

  const issues = [...rawParsed.issues, ...classParsed.issues];
  if (!rawParsed.data || !classParsed.data) {
    console.error("=== MERGE — JSON inválido ===");
    for (const issue of issues) console.error(`  [${issue.check}] ${issue.detail}`);
    process.exit(1);
  }

  const classAssert = assertClassificationArray(classParsed.data, classLabel);
  issues.push(...classAssert.issues);
  if (!classAssert.entries) {
    console.error("=== MERGE — classificação inválida ===");
    for (const issue of issues) console.error(`  [${issue.check}] ${issue.detail}`);
    process.exit(1);
  }

  const { csv, summary, issues: mergeIssues } = mergeQuestionsToCsv(
    rawParsed.data,
    classAssert.entries,
    { requireFilledFields: true },
  );
  issues.push(...mergeIssues);

  if (!csv) {
    console.error("=== MERGE — validação falhou ===");
    for (const issue of issues) console.error(`  [${issue.check}] ${issue.detail}`);
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  const csvPath = resolve(OUTPUT_DIR, "questions.csv");
  await writeFile(csvPath, csv, "utf-8");

  const localIssues = [...issues];

  const expectedExported = summary.totalRaw - summary.skippedAnuladas;
  if (summary.exported !== expectedExported) {
    localIssues.push({
      check: "numero_de_questoes",
      detail: `Esperado ${expectedExported} linhas exportadas, mas foram escritas ${summary.exported}.`,
    });
  }

  const headerLine = csv.split("\r\n")[0];
  const headerColumns = new Set(headerLine.split(","));
  const missingRequiredColumns = REQUIRED_COLUMNS.filter((c) => !headerColumns.has(c));
  if (missingRequiredColumns.length > 0) {
    localIssues.push({
      check: "colunas_obrigatorias",
      detail: `Faltando no header do CSV: ${missingRequiredColumns.join(", ")}.`,
    });
  }

  for (const q of rawParsed.data) {
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
  }

  const rewritten = await readFile(csvPath, "utf-8");
  if (rewritten.includes("�")) {
    localIssues.push({
      check: "utf8",
      detail: "O arquivo questions.csv contém caracteres de substituição (\\uFFFD).",
    });
  }

  const convertOutputPath = resolve(OUTPUT_DIR, "questions.converted.json");
  const convertResult = convertQuestions(csvPath, convertOutputPath);

  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    validation: { issues: localIssues, ok: localIssues.length === 0 },
    convertQuestionsCompatibility: convertResult.ok
      ? { ok: true, convertedCount: convertResult.count }
      : {
          ok: false,
          issueCount: convertResult.issues.length,
          issues: convertResult.issues,
        },
  };
  await writeFile(resolve(OUTPUT_DIR, "merge-report.json"), JSON.stringify(report, null, 2), "utf-8");

  console.log("=== MERGE ===");
  console.log(`Questões no raw.json: ${summary.totalRaw}`);
  console.log(`Entradas na classificação: ${summary.totalClassification}`);
  console.log(`Anuladas descartadas: ${summary.skippedAnuladas}`);
  console.log(`Exportadas para questions.csv: ${summary.exported}`);
  console.log(`  ...REVIEW_REQUIRED: ${summary.reviewRequiredExported}`);

  const validationErrors = localIssues.filter((i) => i.check !== "utf8");
  console.log(`\nValidação: ${validationErrors.length === 0 ? "OK" : `${validationErrors.length} problema(s)`}`);
  for (const issue of validationErrors) console.log(`  - [${issue.check}] ${issue.detail}`);

  console.log(`\nCompatibilidade com convert:questions: ${convertResult.ok ? "OK" : "com pendências"}`);
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

  if (validationErrors.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
