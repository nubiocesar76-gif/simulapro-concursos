/**
 * SimulaPro — PDF Pipeline Init Runner
 *
 * Entrada:
 *   docs/imports/pdfs/<prova>.pdf
 *
 * Saída:
 *   docs/work/<workId>/
 *     metadata.json
 *     questions.raw.json
 *     review.json
 *     status.json
 *     source.pdf
 *
 * Fluxo futuro:
 *   PDF → IA → questions.raw.json → Revisão → questions.json → seed:questions
 */
import { assertPdfExists, initPdfWork } from "./questions/pdf/init.ts";
import { resolvePdfInput } from "./questions/pdf/paths.ts";

function parseYear(value: string | undefined) {
  if (!value) return undefined;
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error("Ano inválido. Use um número entre 1900 e 2100.");
  }
  return year;
}

async function main() {
  const pdfArg = process.argv[2];
  if (!pdfArg) {
    console.error("Uso: npm run pipeline:init -- <arquivo.pdf> [workId]");
    console.error("Exemplo: npm run pipeline:init -- docs/imports/pdfs/ebserh-2025.pdf");
    process.exit(1);
  }

  const workIdArg = process.argv[3];
  const pdfPath = resolvePdfInput(pdfArg);
  if (!pdfPath) {
    console.error(`PDF não encontrado: ${pdfArg}`);
    process.exit(1);
  }

  assertPdfExists(pdfPath);

  const organization = process.env.PIPELINE_ORGANIZATION;
  const contest = process.env.PIPELINE_CONTEST;
  const board = process.env.PIPELINE_BOARD;
  const position = process.env.PIPELINE_POSITION;
  const year = parseYear(process.env.PIPELINE_YEAR);

  const result = initPdfWork({
    pdfPath,
    workId: workIdArg,
    organization,
    contest,
    board,
    position,
    year,
  });

  console.log("Pipeline iniciado.");
  console.log(`Work ID: ${result.workId}`);
  console.log(`Pasta: ${result.workDir}`);
  console.log("Arquivos criados:");
  for (const [key, path] of Object.entries(result.files)) {
    console.log(`  - ${key}: ${path}`);
  }
  console.log("\nPróximos passos (futuro):");
  console.log("  1. Extração IA → questions.raw.json");
  console.log("  2. Revisão humana → review.json");
  console.log("  3. Aprovação → questions.json");
  console.log("  4. npm run seed:questions");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
