/**
 * Registro de regras promovidas (Fase 6 — Motor de Aprendizado, Sprint 6.2,
 * IT-009). Parser de `docs/editorial-ai/learning/regras-promovidas.md` —
 * único lugar onde as regras ativas do Motor Editorial são declaradas como
 * fato (`EDITORIAL_CALIBRATION_RESTRICTIONS`/`buildBoardCalibrationNote`
 * continuam sendo o código que realmente aplica a regra; este arquivo é só
 * o log humano, e este parser só lê esse log).
 *
 * Só leitura — nunca escreve no arquivo, nunca decide nada sobre o Status
 * de uma regra. Ajuste 1 do plano aprovado: cada regra tem um `id`
 * permanente (`RULE-NNN`), independente do texto ou das tags associadas.
 */

export const RULE_HEADER_RE = /^## (RULE-\d+) — (.+)$/;
export const RULE_STATUS_LINE_RE = /^\*\*Status:\*\*\s*(.+)$/;
export const RULE_TAGS_LINE_RE = /^\*\*Tags associadas:\*\*\s*(.*)$/;
export const RULE_PROMOTED_AT_LINE_RE = /^\*\*Data de promoção:\*\*\s*(.+)$/;
const TAG_RE = /#[\w-]+/g;

export type EditorialLearningRuleStatus = "ATIVA" | "EM_REAVALIACAO" | "REVOGADA";

export type EditorialLearningRule = {
  id: string;
  title: string;
  status: EditorialLearningRuleStatus;
  /** Tags do vocabulário de auditoria (Fase 5) associadas a esta regra — pode ser vazio (regra promovida antes do Auditor formal existir, sem tag rastreada). */
  tags: string[];
  /** Como registrado em regras-promovidas.md — hoje só data (YYYY-MM-DD), sem hora; ver limitação documentada em efficacy-tracking.server.ts. */
  promotedAt: string;
};

function isKnownStatus(value: string): value is EditorialLearningRuleStatus {
  return value === "ATIVA" || value === "EM_REAVALIACAO" || value === "REVOGADA";
}

export function parseEditorialLearningRules(content: string): EditorialLearningRule[] {
  const lines = content.split(/\r?\n/);
  const rules: EditorialLearningRule[] = [];

  let current: Partial<EditorialLearningRule> | null = null;

  const flush = () => {
    if (!current?.id) return;
    rules.push({
      id: current.id,
      title: current.title ?? "",
      status: current.status ?? "ATIVA",
      tags: current.tags ?? [],
      promotedAt: current.promotedAt ?? "",
    });
  };

  for (const line of lines) {
    const headerMatch = line.match(RULE_HEADER_RE);
    if (headerMatch) {
      flush();
      const [, id, title] = headerMatch;
      current = { id, title };
      continue;
    }
    if (!current) continue;

    const statusMatch = line.match(RULE_STATUS_LINE_RE);
    if (statusMatch) {
      const raw = statusMatch[1].trim();
      current.status = isKnownStatus(raw) ? raw : "ATIVA";
      continue;
    }

    const tagsMatch = line.match(RULE_TAGS_LINE_RE);
    if (tagsMatch) {
      current.tags = tagsMatch[1].match(TAG_RE) ?? [];
      continue;
    }

    const promotedAtMatch = line.match(RULE_PROMOTED_AT_LINE_RE);
    if (promotedAtMatch) {
      current.promotedAt = promotedAtMatch[1].trim();
      continue;
    }
  }
  flush();

  return rules;
}
