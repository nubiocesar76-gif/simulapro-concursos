/**
 * Auditor Editorial — agregação de métricas (Fase 5, IT-007).
 *
 * Relê os relatórios já gerados por `npm run editorial:audit` (e já
 * preenchidos por um revisor humano) em `docs/editorial-ai/audit-reports/`
 * e produz um painel de contagens por critério, banca, disciplina e
 * dificuldade, além da frequência de tags de padrão de problema
 * (#referencia-forcada etc.). Nenhuma decisão automática, nenhum limiar de
 * aprovação/reprovação de lote — só o retrato numérico (IA-009 §3).
 *
 * Parsing movido para src/lib/editorial-ai/learning/pattern-extraction.server.ts
 * na Sprint 6.1 (Fase 6), compartilhado com scripts/editorial/learning-candidates.ts
 * — mesmo comportamento de antes, sem lógica duplicada entre os dois scripts.
 *
 * Uso: npm run editorial:audit:metrics
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, projectRoot } from "../seed/core/env.ts";

const CONSOLIDATED_FILENAME = "METRICAS_CONSOLIDADAS.md";

function renderGroupedCounts(title: string, counts: Map<string, number>): string {
  const byGroup = new Map<string, Map<string, number>>();
  for (const [key, count] of counts) {
    const [group, verdict] = key.split("::");
    const bucket = byGroup.get(group) ?? new Map<string, number>();
    bucket.set(verdict, count);
    byGroup.set(group, bucket);
  }
  const lines = [`## ${title}`, ""];
  for (const [group, verdicts] of [...byGroup.entries()].sort()) {
    const parts = [...verdicts.entries()].map(([v, c]) => `${v}=${c}`).join(", ");
    lines.push(`- **${group}**: ${parts}`);
  }
  if (byGroup.size === 0) lines.push("(nenhum dado)");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const { parseEditorialAuditReport, mergeCountsInto } =
    await import("../../src/lib/editorial-ai/learning/pattern-extraction.server.ts");

  const reportsDir = resolve(root, "docs/editorial-ai/audit-reports");
  const files = readdirSync(reportsDir).filter(
    (f) => f.endsWith(".md") && f !== CONSOLIDATED_FILENAME,
  );

  if (!files.length) {
    console.log(
      `Nenhum relatório encontrado em ${reportsDir}. Rode "npm run editorial:audit" antes.`,
    );
    return;
  }

  const criterionCounts = new Map<string, number>();
  const byBoard = new Map<string, number>();
  const byDiscipline = new Map<string, number>();
  const byDifficulty = new Map<string, number>();
  const tagCounts = new Map<string, number>();

  for (const file of files) {
    const content = readFileSync(resolve(reportsDir, file), "utf8");
    const parsed = parseEditorialAuditReport(content, file);
    mergeCountsInto(criterionCounts, parsed.criterionCounts);
    mergeCountsInto(byBoard, parsed.byBoard);
    mergeCountsInto(byDiscipline, parsed.byDiscipline);
    mergeCountsInto(byDifficulty, parsed.byDifficulty);
    mergeCountsInto(tagCounts, parsed.tagCounts);
  }

  const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);

  const out = [
    "# Métricas Consolidadas — Auditoria Editorial",
    "",
    `Gerado em: ${new Date().toISOString()}`,
    `Relatórios lidos: ${files.length} (${files.join(", ")})`,
    "",
    "Painel de contagens — sem limiar de aprovação/reprovação de lote nesta",
    "fase (IA-009 §3: insumo para leitura humana, nunca conclusão automática).",
    "",
    "---",
    "",
    renderGroupedCounts("Por banca", byBoard),
    renderGroupedCounts("Por disciplina", byDiscipline),
    renderGroupedCounts("Por dificuldade", byDifficulty),
    renderGroupedCounts("Por critério", criterionCounts),
    "## Padrões recorrentes (tags nas notas dos revisores)",
    "",
    ...(sortedTags.length
      ? sortedTags.map(([tag, count]) => `- ${tag}: ${count}`)
      : [
          "(nenhuma tag registrada ainda — preencha as notas dos relatórios antes de rodar de novo)",
        ]),
    "",
  ].join("\n");

  const outPath = resolve(reportsDir, CONSOLIDATED_FILENAME);
  writeFileSync(outPath, out, "utf8");
  console.log(`Métricas consolidadas escritas em: ${outPath}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
