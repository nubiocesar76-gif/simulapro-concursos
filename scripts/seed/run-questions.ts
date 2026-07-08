/**
 * SimulaPro — Question Seed Runner
 *
 * Contrato único: docs/seeds/questions.json
 *
 * Import (seed):
 *   questions.json → Banco
 *   npm run seed:questions
 *
 * Export:
 *   Banco → questions.json
 *   npm run export:questions
 *
 * Import e export utilizam exatamente o mesmo schema (metadata + questions).
 * status e keywords existem apenas no contrato JSON — não são persistidos no banco.
 * O arquivo exportado pode ser reimportado imediatamente sem edição manual.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, projectRoot } from "./core/env.ts";
import { createSeedClient } from "./core/client.ts";
import { readJsonFile, QUESTIONS_SEED_PATH } from "./core/io.ts";
import { createQuestionReport, printQuestionReport } from "./core/question-report.ts";
import { questionsSeedSchema } from "./questions/schema.ts";
import { seedQuestions } from "./questions/seed.ts";

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const fileArg = process.argv[2];
  const seedPath = fileArg ? resolve(process.cwd(), fileArg) : QUESTIONS_SEED_PATH;

  console.log(`Lendo seed: ${seedPath}`);
  if (!existsSync(seedPath)) {
    throw new Error(`Arquivo não encontrado: ${seedPath}`);
  }

  const raw = readJsonFile<unknown>(seedPath);
  const parsed = questionsSeedSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("JSON inválido:");
    console.error(parsed.error.flatten());
    process.exit(1);
  }

  const db = createSeedClient();
  const report = createQuestionReport();
  await seedQuestions(db, parsed.data, report);
  printQuestionReport(report);
  process.exit(report.errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
