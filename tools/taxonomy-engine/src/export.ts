import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildIndexFromSeed, DEFAULT_TAXONOMY_PATH, loadTaxonomyIndex, parseTaxonomySeed } from "./loader.ts";
import type { TaxonomyIndex, TaxonomyIndexFile } from "./types.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_INDEX_PATH = resolve(HERE, "../taxonomy.index.json");

export function indexToFile(index: TaxonomyIndex): TaxonomyIndexFile {
  return {
    metadata: index.metadata,
    sourcePath: index.sourcePath,
    generatedAt: index.generatedAt,
    counts: index.counts,
    records: index.records,
  };
}

export function hydrateIndexFromFile(file: TaxonomyIndexFile, sourcePath: string = file.sourcePath): TaxonomyIndex {
  const byId = new Map(file.records.map((r) => [r.id, r]));
  const bySlug = new Map<string, typeof file.records>();
  const byKind = new Map<typeof file.records[number]["kind"], typeof file.records>();

  for (const record of file.records) {
    const slugBucket = bySlug.get(record.slug) ?? [];
    slugBucket.push(record);
    bySlug.set(record.slug, slugBucket);

    const kindBucket = byKind.get(record.kind) ?? [];
    kindBucket.push(record);
    byKind.set(record.kind, kindBucket);
  }

  return {
    metadata: file.metadata,
    sourcePath,
    generatedAt: file.generatedAt,
    counts: file.counts,
    records: file.records,
    byId,
    bySlug,
    byKind,
  };
}

export async function exportTaxonomyIndex(
  outputPath: string = DEFAULT_INDEX_PATH,
  sourcePath: string = DEFAULT_TAXONOMY_PATH,
): Promise<TaxonomyIndexFile> {
  const index = await loadTaxonomyIndex(sourcePath);
  const file = indexToFile(index);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(file, null, 2) + "\n", "utf-8");
  return file;
}

export async function loadTaxonomyIndexFromExport(
  indexPath: string = DEFAULT_INDEX_PATH,
): Promise<TaxonomyIndex> {
  const content = await readFile(indexPath, "utf-8");
  const file = JSON.parse(content) as TaxonomyIndexFile;
  return hydrateIndexFromFile(file, indexPath);
}

async function main() {
  const file = await exportTaxonomyIndex();
  console.log("=== TAXONOMY INDEX EXPORT ===");
  console.log(`Fonte: ${DEFAULT_TAXONOMY_PATH}`);
  console.log(`Saída: ${DEFAULT_INDEX_PATH}`);
  console.log(`Registros: ${file.counts.total}`);
  console.log(`  Cursos: ${file.counts.courses}`);
  console.log(`  Cargos: ${file.counts.positions}`);
  console.log(`  Disciplinas: ${file.counts.subjects}`);
  console.log(`  Assuntos: ${file.counts.topics}`);
  console.log(`  Bancas: ${file.counts.boards}`);
  console.log(`  Concursos: ${file.counts.contests}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});

export { parseTaxonomySeed, buildIndexFromSeed };
