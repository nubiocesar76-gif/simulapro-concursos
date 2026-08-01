import type { EditorialAuditTagOccurrence } from "./pattern-extraction.server";

/**
 * Levantamento de candidatos a regra permanente (Fase 6 — Motor de
 * Aprendizado, Sprint 6.1, IT-008).
 *
 * Ajuste explícito do usuário ao aprovar o plano: **nenhum limiar
 * quantitativo de recorrência é fixado nesta sprint** (nada de "≥3
 * relatórios" ou "≥2 lotes"). Esta função só agrupa e apresenta a evidência
 * já existente (quantas vezes, em quais relatórios, em quais contextos) —
 * a avaliação de "isso já é recorrência suficiente" continua inteiramente
 * humana, e os limiares serão definidos depois da operação piloto.
 *
 * Nunca promove nada a regra ativa — não escreve em
 * `context-resolver.server.ts` nem `prompt-composer.server.ts`. Só produz
 * a lista de candidatos com rastreabilidade de origem, para um humano
 * decidir (IA-009 §3/§5) e, se decidir promover, registrar manualmente em
 * `docs/editorial-ai/learning/regras-promovidas.md`.
 *
 * Sprint 6.2: recebe `alreadyPromotedTags` (lido de `regras-promovidas.md`
 * via `rule-registry.server.ts`) para excluir da lista de candidatos as
 * tags que já têm regra `ATIVA` — essas passam a alimentar
 * `efficacy-tracking.server.ts` (relatório de eficácia), não `candidatos.md`.
 * Evita o mesmo achado aparecer como "novo" indefinidamente depois de já
 * ter sido promovido.
 */
export type EditorialLearningCandidate = {
  tag: string;
  totalOcorrencias: number;
  relatoriosOrigem: string[];
  criteriosAssociados: string[];
  bancasAssociadas: string[];
  disciplinasAssociadas: string[];
  /** Lista bruta, uma linha por ocorrência — rastreabilidade completa (Seção 3 do plano aprovado). */
  ocorrencias: EditorialAuditTagOccurrence[];
};

function dedupeSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

export function identifyEditorialLearningCandidates(
  occurrences: EditorialAuditTagOccurrence[],
  alreadyPromotedTags: Iterable<string> = [],
): EditorialLearningCandidate[] {
  const promotedTags = new Set(alreadyPromotedTags);

  const byTag = new Map<string, EditorialAuditTagOccurrence[]>();
  for (const occurrence of occurrences) {
    if (promotedTags.has(occurrence.tag)) continue; // já tem regra ativa — ver efficacy-tracking.server.ts
    const bucket = byTag.get(occurrence.tag) ?? [];
    bucket.push(occurrence);
    byTag.set(occurrence.tag, bucket);
  }

  const candidates: EditorialLearningCandidate[] = [];
  for (const [tag, tagOccurrences] of byTag) {
    candidates.push({
      tag,
      totalOcorrencias: tagOccurrences.length,
      relatoriosOrigem: dedupeSorted(tagOccurrences.map((o) => o.reportFile)),
      criteriosAssociados: dedupeSorted(tagOccurrences.map((o) => o.criterion)),
      bancasAssociadas: dedupeSorted(tagOccurrences.map((o) => o.boardName)),
      disciplinasAssociadas: dedupeSorted(tagOccurrences.map((o) => o.disciplineName)),
      ocorrencias: tagOccurrences,
    });
  }

  return candidates.sort((a, b) => b.totalOcorrencias - a.totalOcorrencias);
}
