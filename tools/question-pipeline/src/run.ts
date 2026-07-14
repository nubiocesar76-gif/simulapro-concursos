import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractPdfText } from "./extract-text.ts";
import { parseProva } from "./parse-prova.ts";
import { parseGabarito } from "./parse-gabarito.ts";
import { buildQuestions } from "./build-questions.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const INPUT_DIR = resolve(ROOT, "input");
const OUTPUT_DIR = resolve(ROOT, "output");

async function main() {
  const provaPath = resolve(INPUT_DIR, "prova.pdf");
  const gabaritoPath = resolve(INPUT_DIR, "gabarito.pdf");

  if (!existsSync(provaPath)) throw new Error(`Arquivo não encontrado: ${provaPath}`);
  if (!existsSync(gabaritoPath)) throw new Error(`Arquivo não encontrado: ${gabaritoPath}`);

  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log("Extraindo texto de prova.pdf...");
  const { text: provaText, pageCount: provaPages } = await extractPdfText(provaPath);
  await writeFile(resolve(OUTPUT_DIR, "prova.txt"), provaText, "utf-8");

  console.log("Extraindo texto de gabarito.pdf...");
  const { text: gabaritoText, pageCount: gabaritoPages } = await extractPdfText(gabaritoPath);
  await writeFile(resolve(OUTPUT_DIR, "gabarito.txt"), gabaritoText, "utf-8");

  console.log("Detectando questões...");
  const questions = parseProva(provaText);

  console.log("Detectando gabarito...");
  const gabarito = parseGabarito(gabaritoText);

  console.log("Montando questions.raw.json...");
  const { questions: finalQuestions, report } = buildQuestions(questions, gabarito);

  await writeFile(
    resolve(OUTPUT_DIR, "questions.raw.json"),
    JSON.stringify(finalQuestions, null, 2),
    "utf-8",
  );
  await writeFile(
    resolve(OUTPUT_DIR, "extraction-report.json"),
    JSON.stringify(
      { ...report, provaPages, gabaritoPages, gabaritoEntriesFound: gabarito.length },
      null,
      2,
    ),
    "utf-8",
  );

  console.log("\n=== RELATÓRIO ===");
  console.log(`Páginas (prova/gabarito): ${provaPages} / ${gabaritoPages}`);
  console.log(`Questões detectadas: ${report.totalFound}`);
  console.log(`  Válidas: ${report.valid}`);
  console.log(`  Anuladas: ${report.anuladas}`);
  console.log(`  Revisão necessária: ${report.reviewRequired}`);
  console.log(`Sem gabarito associado: ${report.withoutGabarito}`);
  console.log(`Sem alternativas completas: ${report.withoutCompleteAlternatives}`);
  console.log(`Números duplicados: ${report.duplicateNumbers.join(", ") || "nenhum"}`);
  console.log(`Entradas de gabarito detectadas: ${gabarito.length}`);
  console.log(`\nSaída em: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
