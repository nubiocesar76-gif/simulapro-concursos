import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { RawQuestion } from "./types.ts";
import { generateClassificationTemplate } from "./generate-template.ts";
import {
  parseJsonFile,
  validateRawQuestions,
} from "./validate-classification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const OUTPUT_DIR = resolve(ROOT, "output");

async function main() {
  const rawPath = resolve(OUTPUT_DIR, "questions.raw.json");
  if (!existsSync(rawPath)) {
    throw new Error(`Arquivo não encontrado: ${rawPath}. Rode "npm run pipeline:extract" primeiro.`);
  }

  const rawContent = await readFile(rawPath, "utf-8");
  const parsed = parseJsonFile<RawQuestion[]>(rawContent, "questions.raw.json");
  if (!parsed.data) {
    for (const issue of parsed.issues) console.error(`[${issue.check}] ${issue.detail}`);
    process.exit(1);
  }

  const rawIssues = validateRawQuestions(parsed.data);
  if (rawIssues.length > 0) {
    console.error("=== TEMPLATE — validação do raw.json falhou ===");
    for (const issue of rawIssues) console.error(`  [${issue.check}] ${issue.detail}`);
    process.exit(1);
  }

  const template = generateClassificationTemplate(parsed.data);
  const templatePath = resolve(OUTPUT_DIR, "classification.template.json");

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(templatePath, JSON.stringify(template, null, 2) + "\n", "utf-8");

  console.log("=== TEMPLATE ===");
  console.log(`Questões em questions.raw.json: ${parsed.data.length}`);
  console.log(`Entradas geradas em classification.template.json: ${template.length}`);
  console.log("\nCampos semânticos deixados vazios — preenchimento humano (ou IA futura) necessário.");
  console.log(`\nArquivo gerado: ${templatePath}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
