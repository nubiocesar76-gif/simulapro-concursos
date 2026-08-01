/**
 * Motor de Aprendizado — levantamento de candidatos a regra permanente
 * (Fase 6, Sprints 6.1/6.2, IT-008/IT-009).
 *
 * Relê os mesmos relatórios de auditoria já usados por
 * `npm run editorial:audit:metrics` (Fase 5) e agrupa as tags de padrão de
 * problema por ocorrência, com rastreabilidade completa de origem. Não
 * aplica nenhum limiar de recorrência (ajuste explícito do usuário ao
 * aprovar o plano) e não promove nada a regra ativa — só apresenta a
 * evidência para avaliação humana.
 *
 * Sprint 6.2: exclui tags que já têm regra `ATIVA` em
 * `regras-promovidas.md` (via `rule-registry.server.ts`) — essas passam a
 * aparecer em `eficacia.md` (`npm run editorial:learning:efficacy`), não
 * aqui, para não repetir o mesmo achado como "candidato novo" indefinidamente.
 *
 * Uso: npm run editorial:learning:candidates
 */
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, projectRoot } from "../seed/core/env.ts";

const AUDIT_CONSOLIDATED_FILENAME = "METRICAS_CONSOLIDADAS.md";

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const { parseEditorialAuditReport } =
    await import("../../src/lib/editorial-ai/learning/pattern-extraction.server.ts");
  const { identifyEditorialLearningCandidates } =
    await import("../../src/lib/editorial-ai/learning/candidate-rules.server.ts");
  const { parseEditorialLearningRules } =
    await import("../../src/lib/editorial-ai/learning/rule-registry.server.ts");

  const reportsDir = resolve(root, "docs/editorial-ai/audit-reports");
  const files = readdirSync(reportsDir).filter(
    (f) => f.endsWith(".md") && f !== AUDIT_CONSOLIDATED_FILENAME,
  );

  if (!files.length) {
    console.log(
      `Nenhum relatório encontrado em ${reportsDir}. Rode "npm run editorial:audit" antes.`,
    );
    return;
  }

  const allOccurrences = files.flatMap((file) => {
    const content = readFileSync(resolve(reportsDir, file), "utf8");
    return parseEditorialAuditReport(content, file).tagOccurrences;
  });

  const rulesPath = resolve(root, "docs/editorial-ai/learning/regras-promovidas.md");
  const rules = parseEditorialLearningRules(readFileSync(rulesPath, "utf8"));
  const alreadyPromotedTags = rules
    .filter((rule) => rule.status === "ATIVA")
    .flatMap((rule) => rule.tags);

  const candidates = identifyEditorialLearningCandidates(allOccurrences, alreadyPromotedTags);

  const lines: string[] = [
    "# Candidatos a Regra Permanente — Motor de Aprendizado",
    "",
    `Gerado em: ${new Date().toISOString()}`,
    `Relatórios lidos: ${files.length} (${files.join(", ")})`,
    "",
    "**Nenhum limiar de recorrência é aplicado nesta fase (Sprint 6.1)** — os",
    "limiares serão definidos após a operação piloto (ajuste aprovado pelo",
    "usuário). Cada candidato abaixo mostra só a evidência bruta (quantas",
    "vezes, em quais relatórios, em quais contextos) para avaliação humana.",
    "Nenhum candidato aqui foi promovido a regra ativa — promoção continua",
    "100% manual, registrada em `docs/editorial-ai/learning/regras-promovidas.md`",
    "quando e se um humano decidir.",
    "",
    `Tags já com regra ATIVA, excluídas desta lista (ver \`eficacia.md\`): ${alreadyPromotedTags.length ? alreadyPromotedTags.join(", ") : "(nenhuma)"}`,
    "",
    "---",
    "",
  ];

  if (!candidates.length) {
    lines.push(
      "(nenhuma tag registrada ainda nos relatórios lidos — preencha as notas dos revisores antes de rodar de novo)",
      "",
    );
  }

  for (const candidate of candidates) {
    lines.push(`## ${candidate.tag} (${candidate.totalOcorrencias} ocorrência(s))`, "");
    lines.push(`Relatórios de origem: ${candidate.relatoriosOrigem.join(", ")}`);
    lines.push(`Critérios associados: ${candidate.criteriosAssociados.join(", ")}`);
    lines.push(`Bancas associadas: ${candidate.bancasAssociadas.join(", ")}`);
    lines.push(`Disciplinas associadas: ${candidate.disciplinasAssociadas.join(", ")}`);
    lines.push("", "Ocorrências:");
    for (const occurrence of candidate.ocorrencias) {
      lines.push(
        `- [${occurrence.reportFile}] ${occurrence.boardName} / ${occurrence.difficultyLevel} / ${occurrence.disciplineName} — critério ${occurrence.criterion}`,
      );
    }
    lines.push(
      "",
      "**Avaliação humana:** ainda não avaliado. Se a recorrência for considerada",
      "suficiente, promover manualmente (prompt-composer.server.ts/context-resolver.server.ts)",
      "e registrar em `regras-promovidas.md` com vínculo a estas ocorrências.",
      "",
      "---",
      "",
    );
  }

  const outDir = resolve(root, "docs/editorial-ai/learning");
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, "candidatos.md");
  writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`Candidatos escritos em: ${outPath}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
