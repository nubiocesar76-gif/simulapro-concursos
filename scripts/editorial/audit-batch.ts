/**
 * Auditor Editorial — CLI de auditoria por lote (Fase 5, IT-007).
 *
 * Fluxo: sampling (amostragem estratificada) → validator-signals (leitura,
 * não recálculo, dos apontamentos já gravados pelo Validator) →
 * thematic-overlap (candidatos de sobreposição no acervo) → report
 * (Markdown). Nunca escreve em editorial_ai_cycles/editorial_ai_decisions —
 * só lê e compõe um relatório para revisão humana.
 *
 * Uso:
 *   npm run editorial:audit -- --batch-id <uuid> [--batch-id <uuid> ...] [--sample-size 5]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, projectRoot } from "../seed/core/env.ts";

function parseArgs(argv: string[]): { batchIds: string[]; sampleSize?: number } {
  const batchIds: string[] = [];
  let sampleSize: number | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--batch-id") {
      const value = argv[i + 1];
      if (!value) throw new Error("--batch-id exige um valor.");
      batchIds.push(value);
      i++;
    } else if (arg === "--sample-size") {
      const value = argv[i + 1];
      if (!value) throw new Error("--sample-size exige um valor.");
      sampleSize = Number.parseInt(value, 10);
      if (!Number.isInteger(sampleSize) || sampleSize < 1) {
        throw new Error("--sample-size deve ser um inteiro >= 1.");
      }
      i++;
    }
  }
  if (!batchIds.length) {
    throw new Error("Informe ao menos um --batch-id.");
  }
  return { batchIds, sampleSize };
}

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const { generateEditorialAuditReport } =
    await import("../../src/lib/editorial-ai/audit/report.server.ts");

  const { batchIds, sampleSize } = parseArgs(process.argv.slice(2));

  console.log(`Auditando ${batchIds.length} lote(s): ${batchIds.join(", ")}`);
  if (sampleSize) console.log(`Amostra máxima por estrato (banca x dificuldade): ${sampleSize}`);

  const report = await generateEditorialAuditReport({
    batchIds,
    sampleSizePerStratum: sampleSize,
  });

  const outDir = resolve(root, "docs/editorial-ai/audit-reports");
  mkdirSync(outDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = resolve(outDir, `${batchIds[0]}__${timestamp}.md`);
  writeFileSync(outPath, report, "utf8");

  console.log(`\nRelatório escrito em: ${outPath}`);
  console.log(
    "Próximo passo: um revisor humano preenche os vereditos [PENDENTE] " +
      "(-> [OK]/[AJUSTE]/[REPROVADO]) diretamente no arquivo. Nenhum estado " +
      "editorial de nenhum ciclo foi alterado por este script.",
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
