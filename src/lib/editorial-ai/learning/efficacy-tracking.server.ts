import { editorialAiCycleService } from "../service.server";
import type { EditorialLearningRule } from "./rule-registry.server";
import type {
  EditorialAuditTagOccurrence,
  EditorialAuditedQuestion,
} from "./pattern-extraction.server";

/**
 * Rastreamento de eficácia de regra promovida (Fase 6 — Motor de
 * Aprendizado, Sprint 6.2, IT-009).
 *
 * Ajuste 2 do plano aprovado: o resultado distingue explicitamente 3
 * situações — nunca interpreta ausência de ocorrência como prova de
 * eficácia sem denominador. Só leitura (`editorialAiCycleService.getCycle`,
 * já existente) — nunca escreve em `editorial_ai_*`, nunca decide o
 * `Status` de uma regra (isso continua exclusivamente humano, registrado
 * manualmente em `regras-promovidas.md`).
 */
export type EditorialRuleEfficacyStatus =
  "MELHORA_OBSERVADA" | "PIORA_OBSERVADA" | "SEM_OPORTUNIDADE_DE_TESTE";

export type EditorialRuleEfficacyResult = {
  ruleId: string;
  ruleTitle: string;
  tag: string;
  promotedAt: string;
  status: EditorialRuleEfficacyStatus;
  ocorrenciasAntes: EditorialAuditTagOccurrence[];
  ocorrenciasMesmoDiaAmbiguas: EditorialAuditTagOccurrence[];
  ocorrenciasDepois: EditorialAuditTagOccurrence[];
  ciclosAuditadosDepoisMesmoContexto: EditorialAuditedQuestion[];
  nota: string;
};

/** Regras sem nenhuma tag associada — nada a rastrear, mas ainda reportadas para não desaparecerem silenciosamente do painel. */
export type EditorialRuleEfficacySkipped = {
  ruleId: string;
  ruleTitle: string;
  motivo: string;
};

export type EditorialRuleEfficacyReport = {
  results: EditorialRuleEfficacyResult[];
  skipped: EditorialRuleEfficacySkipped[];
};

function parsePromotedAtStartOfDay(promotedAt: string): Date | null {
  const date = new Date(`${promotedAt}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function nextDay(date: Date): Date {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + 1);
  return copy;
}

function contextKey(boardName: string, disciplineName: string): string {
  return `${boardName}::${disciplineName}`;
}

export async function trackEditorialRuleEfficacy(input: {
  rules: EditorialLearningRule[];
  tagOccurrences: EditorialAuditTagOccurrence[];
  auditedQuestions: EditorialAuditedQuestion[];
}): Promise<EditorialRuleEfficacyReport> {
  const results: EditorialRuleEfficacyResult[] = [];
  const skipped: EditorialRuleEfficacySkipped[] = [];

  const activeRules = input.rules.filter((rule) => rule.status === "ATIVA");

  // Resolve created_at de todos os ciclos distintos referenciados (ocorrências + questões auditadas), uma vez só.
  const cycleIds = new Set<string>();
  for (const occurrence of input.tagOccurrences) {
    if (occurrence.cycleId) cycleIds.add(occurrence.cycleId);
  }
  for (const question of input.auditedQuestions) {
    cycleIds.add(question.cycleId);
  }
  const cycleCreatedAtById = new Map<string, string>();
  await Promise.all(
    [...cycleIds].map(async (cycleId) => {
      const cycle = await editorialAiCycleService.getCycle(cycleId);
      if (cycle) cycleCreatedAtById.set(cycleId, cycle.created_at);
    }),
  );

  for (const rule of activeRules) {
    if (!rule.tags.length) {
      skipped.push({
        ruleId: rule.id,
        ruleTitle: rule.title,
        motivo:
          "Nenhuma tag associada registrada em regras-promovidas.md — sem tag, não há ocorrência para rastrear. Ver campo 'Tags associadas' da regra.",
      });
      continue;
    }

    const promotedAtStart = parsePromotedAtStartOfDay(rule.promotedAt);
    if (!promotedAtStart) {
      skipped.push({
        ruleId: rule.id,
        ruleTitle: rule.title,
        motivo: `Data de promoção "${rule.promotedAt}" não pôde ser interpretada.`,
      });
      continue;
    }
    const promotedAtEnd = nextDay(promotedAtStart);

    for (const tag of rule.tags) {
      const occurrencesForTag = input.tagOccurrences.filter((o) => o.tag === tag);

      const ocorrenciasAntes: EditorialAuditTagOccurrence[] = [];
      const ocorrenciasMesmoDiaAmbiguas: EditorialAuditTagOccurrence[] = [];
      const ocorrenciasDepois: EditorialAuditTagOccurrence[] = [];

      for (const occurrence of occurrencesForTag) {
        const createdAt = occurrence.cycleId
          ? cycleCreatedAtById.get(occurrence.cycleId)
          : undefined;
        if (!createdAt) {
          ocorrenciasMesmoDiaAmbiguas.push(occurrence); // sem data resolvida — tratado como não classificável, mesma cautela do caso "mesmo dia"
          continue;
        }
        const createdAtDate = new Date(createdAt);
        if (createdAtDate < promotedAtStart) {
          ocorrenciasAntes.push(occurrence);
        } else if (createdAtDate >= promotedAtEnd) {
          ocorrenciasDepois.push(occurrence);
        } else {
          ocorrenciasMesmoDiaAmbiguas.push(occurrence);
        }
      }

      // Contextos relevantes = banca+disciplina onde a tag já foi vista (antes OU depois) — escopo em que a regra é testável.
      const contextosRelevantes = new Set(
        occurrencesForTag.map((o) => contextKey(o.boardName, o.disciplineName)),
      );

      const ciclosAuditadosDepoisMesmoContexto = input.auditedQuestions.filter((q) => {
        if (!contextosRelevantes.has(contextKey(q.boardName, q.disciplineName))) return false;
        const createdAt = cycleCreatedAtById.get(q.cycleId);
        if (!createdAt) return false;
        return new Date(createdAt) >= promotedAtEnd;
      });

      let status: EditorialRuleEfficacyStatus;
      let nota: string;
      if (ciclosAuditadosDepoisMesmoContexto.length === 0) {
        status = "SEM_OPORTUNIDADE_DE_TESTE";
        nota =
          "Nenhum ciclo auditado, gerado após o dia da promoção, no mesmo contexto (banca+disciplina) em que esta tag já foi vista. Ausência de ocorrência aqui NÃO é evidência de eficácia — simplesmente não houve chance de testar.";
      } else if (ocorrenciasDepois.length > 0) {
        status = "PIORA_OBSERVADA";
        nota = `${ocorrenciasDepois.length} ocorrência(s) da tag em ciclo(s) gerados após a promoção, de ${ciclosAuditadosDepoisMesmoContexto.length} ciclo(s) auditado(s) no mesmo contexto — o padrão continuou aparecendo.`;
      } else {
        status = "MELHORA_OBSERVADA";
        nota = `Nenhuma ocorrência da tag em ${ciclosAuditadosDepoisMesmoContexto.length} ciclo(s) auditado(s) após a promoção, no mesmo contexto em que a tag já havia sido vista — sinal de melhora, sujeito a leitura humana.`;
      }
      if (ocorrenciasMesmoDiaAmbiguas.length) {
        nota += ` ${ocorrenciasMesmoDiaAmbiguas.length} ocorrência(s) no mesmo dia da promoção (ou sem data resolvida) foram excluídas da classificação por ambiguidade temporal.`;
      }

      results.push({
        ruleId: rule.id,
        ruleTitle: rule.title,
        tag,
        promotedAt: rule.promotedAt,
        status,
        ocorrenciasAntes,
        ocorrenciasMesmoDiaAmbiguas,
        ocorrenciasDepois,
        ciclosAuditadosDepoisMesmoContexto,
        nota,
      });
    }
  }

  return { results, skipped };
}
