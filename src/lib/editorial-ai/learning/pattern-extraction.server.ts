/**
 * Extração de padrões a partir dos relatórios de Auditoria Editorial
 * (Fase 6 — Motor de Aprendizado, Sprints 6.1/6.2, IT-008/IT-009).
 *
 * Parser único, compartilhado entre `scripts/editorial/audit-metrics.ts`
 * (Fase 5 — painel de contagens), `candidate-rules.server.ts` (Sprint 6.1 —
 * candidatos a regra) e `efficacy-tracking.server.ts` (Sprint 6.2 —
 * eficácia de regra já promovida). Move para cá a lógica que antes vivia só
 * em `audit-metrics.ts`, sem alterar seu comportamento — mesmas regexes,
 * mesmo formato de linha (`### Questão N — banca / dificuldade /
 * disciplina/assunto`, `cycle_id: <uuid>`, `Critério: X | Veredito: [Y]`,
 * `Notas: ...`) já produzido por `src/lib/editorial-ai/audit/report.server.ts`.
 *
 * Só leitura — nunca escreve em `editorial_ai_*`, nunca decide nada. Insumo
 * bruto para leitura humana (IA-009 §3), igual à Fase 5.
 */

export const AUDIT_QUESTION_HEADER_RE = /^### Questão \d+ — (.+?) \/ (.+?) \/ (.+)$/;
export const AUDIT_CYCLE_ID_LINE_RE = /^cycle_id:\s*(.+)$/;
export const AUDIT_CRITERION_LINE_RE = /^Critério:\s*([A-Z_]+)\s*\|\s*Veredito:\s*\[([^\]]+)\]/;
export const AUDIT_NOTES_LINE_RE = /^Notas:\s*(.*)$/;
export const AUDIT_TAG_RE = /#[\w-]+/g;

export type EditorialAuditQuestionContext = {
  cycleId: string | null;
  boardName: string;
  difficultyLevel: string;
  disciplineName: string;
};

/**
 * Uma questão auditada, com ou sem tag — o denominador necessário para o
 * relatório de eficácia (Sprint 6.2) distinguir "problema não apareceu mais"
 * de "não houve chance de aparecer" (ajuste 2 do plano aprovado).
 */
export type EditorialAuditedQuestion = {
  cycleId: string;
  reportFile: string;
  boardName: string;
  disciplineName: string;
  difficultyLevel: string;
};

/**
 * Uma ocorrência individual de tag numa nota de revisor — a unidade de
 * evidência que a Fase 6 usa para rastreabilidade (Seção 3 do plano
 * aprovado: toda regra promovida mantém vínculo com sua origem).
 */
export type EditorialAuditTagOccurrence = {
  tag: string;
  reportFile: string;
  criterion: string;
  cycleId: string | null;
  boardName: string;
  disciplineName: string;
  difficultyLevel: string;
};

export type EditorialAuditParsedReport = {
  criterionCounts: Map<string, number>; // "<criterion>::<verdict>"
  byBoard: Map<string, number>; // "<board>::<verdict>"
  byDiscipline: Map<string, number>; // "<discipline>::<verdict>"
  byDifficulty: Map<string, number>; // "<difficulty>::<verdict>"
  tagCounts: Map<string, number>;
  tagOccurrences: EditorialAuditTagOccurrence[];
  auditedQuestions: EditorialAuditedQuestion[];
};

export function incrementCount(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

export function mergeCountsInto(target: Map<string, number>, source: Map<string, number>): void {
  for (const [key, value] of source) {
    target.set(key, (target.get(key) ?? 0) + value);
  }
}

/**
 * `reportFile` é o nome do arquivo de origem (não descoberto pelo parser —
 * quem lê o arquivo do disco já sabe o nome), usado só para popular
 * `tagOccurrences` com rastreabilidade de origem.
 */
export function parseEditorialAuditReport(
  content: string,
  reportFile: string,
): EditorialAuditParsedReport {
  const lines = content.split(/\r?\n/);
  const criterionCounts = new Map<string, number>();
  const byBoard = new Map<string, number>();
  const byDiscipline = new Map<string, number>();
  const byDifficulty = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  const tagOccurrences: EditorialAuditTagOccurrence[] = [];
  const auditedQuestions: EditorialAuditedQuestion[] = [];

  let current: EditorialAuditQuestionContext | null = null;
  let pendingCriterion: string | null = null;
  let awaitingCycleId = false;

  for (const line of lines) {
    const headerMatch = line.match(AUDIT_QUESTION_HEADER_RE);
    if (headerMatch) {
      const [, boardName, difficultyLevel, rest] = headerMatch;
      const disciplineName = rest.split("/")[0] ?? rest;
      current = { cycleId: null, boardName, difficultyLevel, disciplineName };
      pendingCriterion = null;
      awaitingCycleId = true;
      continue;
    }

    if (awaitingCycleId && current) {
      const cycleIdMatch = line.match(AUDIT_CYCLE_ID_LINE_RE);
      awaitingCycleId = false;
      if (cycleIdMatch) {
        current.cycleId = cycleIdMatch[1].trim();
        auditedQuestions.push({
          cycleId: current.cycleId,
          reportFile,
          boardName: current.boardName,
          disciplineName: current.disciplineName,
          difficultyLevel: current.difficultyLevel,
        });
      }
      continue;
    }

    const criterionMatch = line.match(AUDIT_CRITERION_LINE_RE);
    if (criterionMatch && current) {
      const [, criterion, verdict] = criterionMatch;
      incrementCount(criterionCounts, `${criterion}::${verdict}`);
      incrementCount(byBoard, `${current.boardName}::${verdict}`);
      incrementCount(byDiscipline, `${current.disciplineName}::${verdict}`);
      incrementCount(byDifficulty, `${current.difficultyLevel}::${verdict}`);
      pendingCriterion = criterion;
      continue;
    }

    const notesMatch = line.match(AUDIT_NOTES_LINE_RE);
    if (notesMatch && pendingCriterion && current) {
      const tags = notesMatch[1].match(AUDIT_TAG_RE) ?? [];
      for (const tag of tags) {
        incrementCount(tagCounts, tag);
        tagOccurrences.push({
          tag,
          reportFile,
          criterion: pendingCriterion,
          cycleId: current.cycleId,
          boardName: current.boardName,
          disciplineName: current.disciplineName,
          difficultyLevel: current.difficultyLevel,
        });
      }
      pendingCriterion = null;
    }
  }

  return {
    criterionCounts,
    byBoard,
    byDiscipline,
    byDifficulty,
    tagCounts,
    tagOccurrences,
    auditedQuestions,
  };
}
