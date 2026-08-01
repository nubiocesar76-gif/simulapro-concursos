/**
 * Motor de Aprendizado — relatório de eficácia de regras promovidas
 * (Fase 6, Sprint 6.2, IT-009).
 *
 * Relê os relatórios de auditoria (mesmos de `editorial:audit:metrics` e
 * `editorial:learning:candidates`) e `docs/editorial-ai/learning/regras-promovidas.md`,
 * classifica cada (regra, tag) em MELHORA_OBSERVADA / PIORA_OBSERVADA /
 * SEM_OPORTUNIDADE_DE_TESTE (ajuste 2 do plano aprovado) e grava
 * `docs/editorial-ai/learning/eficacia.md`. Nunca decide o Status de uma
 * regra — isso continua exclusivamente humano.
 *
 * Uso: npm run editorial:learning:efficacy
 */
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, projectRoot } from "../seed/core/env.ts";

const AUDIT_CONSOLIDATED_FILENAME = "METRICAS_CONSOLIDADAS.md";

function renderOccurrenceList(
  occurrences: {
    reportFile: string;
    boardName: string;
    disciplineName: string;
    difficultyLevel: string;
    criterion: string;
  }[],
): string[] {
  if (!occurrences.length) return ["  (nenhuma)"];
  return occurrences.map(
    (o) =>
      `  - [${o.reportFile}] ${o.boardName} / ${o.difficultyLevel} / ${o.disciplineName} — critério ${o.criterion}`,
  );
}

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const { parseEditorialAuditReport } =
    await import("../../src/lib/editorial-ai/learning/pattern-extraction.server.ts");
  const { parseEditorialLearningRules } =
    await import("../../src/lib/editorial-ai/learning/rule-registry.server.ts");
  const { trackEditorialRuleEfficacy } =
    await import("../../src/lib/editorial-ai/learning/efficacy-tracking.server.ts");

  const reportsDir = resolve(root, "docs/editorial-ai/audit-reports");
  const reportFiles = readdirSync(reportsDir).filter(
    (f) => f.endsWith(".md") && f !== AUDIT_CONSOLIDATED_FILENAME,
  );
  if (!reportFiles.length) {
    console.log(`Nenhum relatório de auditoria encontrado em ${reportsDir}.`);
    return;
  }

  const learningDir = resolve(root, "docs/editorial-ai/learning");
  const rulesPath = resolve(learningDir, "regras-promovidas.md");
  const rules = parseEditorialLearningRules(readFileSync(rulesPath, "utf8"));

  const allTagOccurrences = [];
  const allAuditedQuestions = [];
  for (const file of reportFiles) {
    const content = readFileSync(resolve(reportsDir, file), "utf8");
    const parsed = parseEditorialAuditReport(content, file);
    allTagOccurrences.push(...parsed.tagOccurrences);
    allAuditedQuestions.push(...parsed.auditedQuestions);
  }

  const { results, skipped } = await trackEditorialRuleEfficacy({
    rules,
    tagOccurrences: allTagOccurrences,
    auditedQuestions: allAuditedQuestions,
  });

  const lines: string[] = [
    "# Relatório de Eficácia — Regras Promovidas",
    "",
    `Gerado em: ${new Date().toISOString()}`,
    `Relatórios de auditoria lidos: ${reportFiles.length}`,
    `Regras ativas avaliadas: ${rules.filter((r) => r.status === "ATIVA").length}`,
    "",
    'Três classificações possíveis, nunca uma quarta "eficaz"/"ineficaz" automática',
    "(ajuste 2 do plano aprovado): `MELHORA_OBSERVADA`, `PIORA_OBSERVADA`,",
    "`SEM_OPORTUNIDADE_DE_TESTE`. A terceira existe justamente para não deixar",
    "ausência de ocorrência ser lida como prova de eficácia sem denominador.",
    "Nenhum Status de regra é alterado por este relatório — decisão de",
    "reavaliar/revogar continua manual, registrada em `regras-promovidas.md`.",
    "",
    "---",
    "",
  ];

  for (const result of results) {
    lines.push(`## ${result.ruleId} — ${result.tag}`, "");
    lines.push(`Regra: ${result.ruleTitle}`);
    lines.push(`Data de promoção: ${result.promotedAt}`);
    lines.push(`**Status:** ${result.status}`);
    lines.push("");
    lines.push(result.nota);
    lines.push("");
    lines.push(`Ocorrências antes da promoção (${result.ocorrenciasAntes.length}):`);
    lines.push(...renderOccurrenceList(result.ocorrenciasAntes));
    lines.push(`Ocorrências depois da promoção (${result.ocorrenciasDepois.length}):`);
    lines.push(...renderOccurrenceList(result.ocorrenciasDepois));
    lines.push(
      `Ocorrências no mesmo dia da promoção / sem data resolvida, excluídas por ambiguidade (${result.ocorrenciasMesmoDiaAmbiguas.length}):`,
    );
    lines.push(...renderOccurrenceList(result.ocorrenciasMesmoDiaAmbiguas));
    lines.push(
      `Ciclos auditados no mesmo contexto após a promoção (denominador): ${result.ciclosAuditadosDepoisMesmoContexto.length}`,
    );
    lines.push("", "---", "");
  }

  if (skipped.length) {
    lines.push("## Regras sem avaliação de eficácia nesta rodada", "");
    for (const item of skipped) {
      lines.push(`- **${item.ruleId}** (${item.ruleTitle}): ${item.motivo}`);
    }
    lines.push("");
  }

  mkdirSync(learningDir, { recursive: true });
  const outPath = resolve(learningDir, "eficacia.md");
  writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`Relatório de eficácia escrito em: ${outPath}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
