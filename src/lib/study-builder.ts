/**
 * Catálogo e filtros do construtor de sessão (Portal do Aluno).
 * Uma consulta ao acervo por distribuição; agregações em memória.
 */

import { supabase } from "@/integrations/supabase/client";
import type { SessionQuestion } from "@/lib/study-engine";
import { buildQuestionSequence } from "@/lib/study-engine";
import {
  getDistributionPackageVersionId,
  getFilteredQuestionIdsForDistribution,
  isFilterStudyMode,
  type StudyModeSelectable,
  type StudySessionFilters,
  type StudySessionSettings,
} from "@/lib/study-session";

export const ALL_FILTER = "all" as const;

export type StudyBuilderFilters = {
  boardId: string;
  subjectId: string;
  topicId: string;
  year: string;
};

export type StudyBuilderOption = {
  id: string;
  label: string;
  count: number;
};

export type StudyBuilderQuestion = {
  id: string;
  year: number | null;
  boardId: string | null;
  subjectId: string | null;
  topicId: string | null;
  boardLabel: string;
  subjectLabel: string;
  topicLabel: string;
};

export type StudyBuilderCatalog = {
  packageVersionId: string;
  questions: StudyBuilderQuestion[];
};

export const DEFAULT_STUDY_BUILDER_FILTERS: StudyBuilderFilters = {
  boardId: ALL_FILTER,
  subjectId: ALL_FILTER,
  topicId: ALL_FILTER,
  year: ALL_FILTER,
};

function boardLabel(board: { name: string; acronym: string | null } | null): string {
  return board?.acronym?.trim() || board?.name?.trim() || "Sem banca";
}

export function hasActiveSessionFilters(filters?: StudySessionFilters | null): boolean {
  if (!filters) return false;
  return (
    !!filters.board_id ||
    !!filters.subject_id ||
    !!filters.topic_id ||
    filters.year != null
  );
}

export function toSessionFilters(filters: StudyBuilderFilters): StudySessionFilters | undefined {
  const sessionFilters: StudySessionFilters = {
    board_id: filters.boardId !== ALL_FILTER ? filters.boardId : null,
    subject_id: filters.subjectId !== ALL_FILTER ? filters.subjectId : null,
    topic_id: filters.topicId !== ALL_FILTER ? filters.topicId : null,
    year: filters.year !== ALL_FILTER ? Number(filters.year) : null,
  };
  return hasActiveSessionFilters(sessionFilters) ? sessionFilters : undefined;
}

export function filterQuestions(
  questions: StudyBuilderQuestion[],
  filters: Partial<StudyBuilderFilters>,
): StudyBuilderQuestion[] {
  return questions.filter((question) => {
    if (filters.boardId && filters.boardId !== ALL_FILTER && question.boardId !== filters.boardId) {
      return false;
    }
    if (
      filters.subjectId &&
      filters.subjectId !== ALL_FILTER &&
      question.subjectId !== filters.subjectId
    ) {
      return false;
    }
    if (filters.topicId && filters.topicId !== ALL_FILTER && question.topicId !== filters.topicId) {
      return false;
    }
    if (filters.year && filters.year !== ALL_FILTER && question.year !== Number(filters.year)) {
      return false;
    }
    return true;
  });
}

function aggregateOptions(
  questions: StudyBuilderQuestion[],
  pick: (question: StudyBuilderQuestion) => { id: string | null; label: string } | null,
): StudyBuilderOption[] {
  const counts = new Map<string, { label: string; count: number }>();

  for (const question of questions) {
    const item = pick(question);
    if (!item?.id) continue;
    const current = counts.get(item.id) ?? { label: item.label, count: 0 };
    current.count += 1;
    counts.set(item.id, current);
  }

  return [...counts.entries()]
    .map(([id, value]) => ({ id, label: value.label, count: value.count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "pt-BR"));
}

export function buildBoardOptions(
  questions: StudyBuilderQuestion[],
  filters: StudyBuilderFilters,
): StudyBuilderOption[] {
  const pool = filterQuestions(questions, { ...filters, boardId: ALL_FILTER });
  return aggregateOptions(pool, (question) =>
    question.boardId
      ? { id: question.boardId, label: question.boardLabel }
      : null,
  );
}

export function buildSubjectOptions(
  questions: StudyBuilderQuestion[],
  filters: StudyBuilderFilters,
): StudyBuilderOption[] {
  const pool = filterQuestions(questions, { ...filters, subjectId: ALL_FILTER, topicId: ALL_FILTER });
  return aggregateOptions(pool, (question) =>
    question.subjectId
      ? { id: question.subjectId, label: question.subjectLabel }
      : null,
  );
}

export function buildTopicOptions(
  questions: StudyBuilderQuestion[],
  filters: StudyBuilderFilters,
): StudyBuilderOption[] {
  if (filters.subjectId === ALL_FILTER) return [];

  const pool = filterQuestions(questions, { ...filters, topicId: ALL_FILTER });
  return aggregateOptions(pool, (question) =>
    question.topicId && question.subjectId === filters.subjectId
      ? { id: question.topicId, label: question.topicLabel }
      : null,
  );
}

export function buildYearOptions(
  questions: StudyBuilderQuestion[],
  filters: StudyBuilderFilters,
): StudyBuilderOption[] {
  const pool = filterQuestions(questions, { ...filters, year: ALL_FILTER });
  const counts = new Map<number, number>();

  for (const question of pool) {
    if (question.year == null) continue;
    counts.set(question.year, (counts.get(question.year) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, count]) => ({
      id: String(year),
      label: String(year),
      count,
    }));
}

export function countMatchingQuestions(
  questions: StudyBuilderQuestion[],
  filters: StudyBuilderFilters,
): number {
  return filterQuestions(questions, filters).length;
}

export function resolveSelectedQuantityLabel(
  matchingCount: number,
  quantity: StudySessionSettings["question_count"],
): string {
  if (quantity === "all") return String(matchingCount);
  return String(Math.min(matchingCount, quantity));
}

export function getFilterLabel(
  value: string,
  options: StudyBuilderOption[],
  allLabel: string,
): string {
  if (value === ALL_FILTER) return allLabel;
  return options.find((option) => option.id === value)?.label ?? allLabel;
}

export async function fetchStudyBuilderCatalog(
  distributionId: string,
  userId: string,
  mode: StudyModeSelectable,
): Promise<StudyBuilderCatalog> {
  const packageVersionId = await getDistributionPackageVersionId(distributionId);

  let allowedIds: Set<string> | null = null;
  if (isFilterStudyMode(mode)) {
    const ids = await getFilteredQuestionIdsForDistribution(userId, packageVersionId, mode);
    allowedIds = new Set(ids);
  }

  const { data, error } = await supabase
    .from("questions")
    .select(`
      id,
      year,
      board_id,
      subject_id,
      topic_id,
      boards(id, name, acronym),
      subjects(id, name),
      topics(id, name, subject_id)
    `)
    .eq("package_version_id", packageVersionId);

  if (error) throw error;

  const questions: StudyBuilderQuestion[] = (data ?? [])
    .filter((row) => !allowedIds || allowedIds.has(row.id))
    .map((row) => {
      const board = row.boards as { name: string; acronym: string | null } | null;
      const subject = row.subjects as { name: string } | null;
      const topic = row.topics as { name: string; subject_id: string } | null;

      return {
        id: row.id,
        year: row.year,
        boardId: row.board_id,
        subjectId: row.subject_id,
        topicId: row.topic_id,
        boardLabel: boardLabel(board),
        subjectLabel: subject?.name?.trim() || "Sem disciplina",
        topicLabel: topic?.name?.trim() || "Sem assunto",
      };
    });

  return { packageVersionId, questions };
}

export async function materializeFilteredSessionQuestions(input: {
  sessionId: string;
  distributionId: string;
  userId: string;
  mode: StudyModeSelectable;
  settings: StudySessionSettings;
}): Promise<void> {
  if (!hasActiveSessionFilters(input.settings.filters)) return;

  const catalog = await fetchStudyBuilderCatalog(
    input.distributionId,
    input.userId,
    input.mode,
  );

  const builderFilters: StudyBuilderFilters = {
    boardId: input.settings.filters?.board_id ?? ALL_FILTER,
    subjectId: input.settings.filters?.subject_id ?? ALL_FILTER,
    topicId: input.settings.filters?.topic_id ?? ALL_FILTER,
    year:
      input.settings.filters?.year != null
        ? String(input.settings.filters.year)
        : ALL_FILTER,
  };

  const matching = filterQuestions(catalog.questions, builderFilters);
  const pool: SessionQuestion[] = matching.map((question) => ({
    id: question.id,
    statement: "",
    created_at: "",
  }));

  const sequence = buildQuestionSequence(pool, input.settings);
  if (!sequence.length) return;

  const { error } = await supabase.from("study_session_questions").insert(
    sequence.map((question, index) => ({
      study_session_id: input.sessionId,
      question_id: question.id,
      question_order: index + 1,
    })),
  );

  if (error) throw error;
}
