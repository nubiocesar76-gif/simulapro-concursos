/**
 * SimulaPro — Taxonomy Export Runner
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
import { readJsonFile, TAXONOMY_SEED_PATH, writeJsonFile } from "./core/io.ts";
import { exportTaxonomy } from "./taxonomy/export.ts";
import { resolveSeedEnvironment } from "./taxonomy/metadata.ts";
import { taxonomySeedSchema } from "./taxonomy/schema.ts";

function readPreservedMetadata(path: string) {
  if (!existsSync(path)) return {};
  const parsed = taxonomySeedSchema.safeParse(readJsonFile<unknown>(path));
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
  const outPath = outArg ? resolve(process.cwd(), outArg) : TAXONOMY_SEED_PATH;

  console.log(`Exportando taxonomia para: ${outPath}`);

  const preserved = readPreservedMetadata(outPath);
  const db = createSeedClient();
  const data = await exportTaxonomy(db, {
    version: preserved.version,
    description: preserved.description,
    environment: resolveSeedEnvironment(),
  });
  writeJsonFile(outPath, data);

  console.log("Exportação concluída.");
  console.log(`Versão: ${data.metadata.version}`);
  console.log(`Ambiente: ${data.metadata.environment}`);
  console.log(`Cursos: ${data.courses.length}`);
  console.log(`Bancas: ${data.boards.length}`);
  console.log(`Concursos: ${data.contests.length}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
