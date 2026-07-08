/**
 * SimulaPro — Taxonomy Seed Runner
 *
 * Contrato único: docs/seeds/taxonomy.json
 *
 * Import (seed):
 *   taxonomy.json → Banco
 *   npm run seed:taxonomy
 *
 * Export:
 *   Banco → taxonomy.json
 *   npm run export:taxonomy
 *
 * Import e export utilizam exatamente o mesmo schema (metadata + courses + boards + contests).
 * O arquivo exportado pode ser reimportado imediatamente sem edição manual.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, projectRoot } from "./core/env.ts";
import { createSeedClient } from "./core/client.ts";
import { readJsonFile, TAXONOMY_SEED_PATH } from "./core/io.ts";
import { createReport, printReport } from "./core/report.ts";
import { taxonomySeedSchema } from "./taxonomy/schema.ts";
import { seedTaxonomy } from "./taxonomy/seed.ts";

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const fileArg = process.argv[2];
  const seedPath = fileArg ? resolve(process.cwd(), fileArg) : TAXONOMY_SEED_PATH;

  console.log(`Lendo seed: ${seedPath}`);
  if (!existsSync(seedPath)) {
    throw new Error(`Arquivo não encontrado: ${seedPath}`);
  }

  const raw = readJsonFile<unknown>(seedPath);
  const parsed = taxonomySeedSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("JSON inválido:");
    console.error(parsed.error.flatten());
    process.exit(1);
  }

  const db = createSeedClient();
  const report = createReport();
  await seedTaxonomy(db, parsed.data, report);
  printReport(report);
  process.exit(report.errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
