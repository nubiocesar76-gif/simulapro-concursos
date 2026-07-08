/**
 * SimulaPro — Question Export Runner
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
import { readJsonFile, QUESTIONS_SEED_PATH, writeJsonFile } from "./core/io.ts";
import { exportQuestions } from "./questions/export.ts";
import { resolveSeedEnvironment } from "./questions/metadata.ts";
import { questionsSeedSchema } from "./questions/schema.ts";

function readPreservedMetadata(path: string) {
  if (!existsSync(path)) return {};
  const parsed = questionsSeedSchema.safeParse(readJsonFile<unknown>(path));
  if (!parsed.success) return {};
  return {
    version: parsed.data.metadata.version,
    description: parsed.data.metadata.description,
  };
}

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const outArg = process.argv[2];
  const outPath = outArg ? resolve(process.cwd(), outArg) : QUESTIONS_SEED_PATH;

  console.log(`Exportando questões para: ${outPath}`);

  const preserved = readPreservedMetadata(outPath);
  const db = createSeedClient();
  const data = await exportQuestions(db, {
    version: preserved.version,
    description: preserved.description,
    environment: resolveSeedEnvironment(),
  });
  writeJsonFile(outPath, data);

  console.log("Exportação concluída.");
  console.log(`Versão: ${data.metadata.version}`);
  console.log(`Ambiente: ${data.metadata.environment}`);
  console.log(`Questões: ${data.questions.length}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
