/**
 * Central de Revisão — agrega dados existentes do aluno sem novas regras de estudo.
 */

import { supabase } from "@/integrations/supabase/client";
import { fetchAvailableDistributions } from "@/lib/study-session";
import {
  ALL_FILTER,
  buildBoardOptions,
  buildSubjectOptions,
  buildTopicOptions,
  buildYearOptions,
  filterQuestions,
  type StudyBuilderFilters,
  type StudyBuilderOption,
  type StudyBuilderQuestion,
} from "@/lib/study-builder";

export const REVIEW_PAGE_SIZE = 10;

export type ReviewTab = "favorites" | "review" | "wrong" | "unanswered";

export type ReviewCenterFilters = StudyBuilderFilters & {
  tab: ReviewTab;
  page: number;
};

export type ReviewCenterItem = {
  questionId: string;
  statement: string;
  statementSummary: string;
  boardName: string | null;
  year: number | null;
  subjectName: string | null;
  topicName: string | null;
  boardId: string | null;
  subjectId: string | null;
  topicId: string | null;
  lastAnswer: string | null;
  errorCount: number;
  correctCount: number;
  lastReviewedAt: string | null;
  isFavorite: boolean;
  isReviewLater: boolean;
  distributionId: string;
  distributionName: string;
  sessionId: string | null;
  sessionQuestionId: string | null;
};

export type ReviewCenterStats = {
  favorites: number;
  review: number;
  wrong: number;
  unanswered: number;
};

export type ReviewCenterSnapshot = {
  items: ReviewCenterItem[];
  unansweredItems: ReviewCenterItem[];
  stats: ReviewCenterStats;
  catalogQuestions: StudyBuilderQuestion[];
};

export type ReviewCenterPage = {
  items: ReviewCenterItem[];
  total: number;
  stats: ReviewCenterStats;
  boardOptions: StudyBuilderOption[];
  subjectOptions: StudyBuilderOption[];
  topicOptions: StudyBuilderOption[];
  yearOptions: StudyBuilderOption[];
};

function summarizeStatement(text: string, maxLength = 120): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength)}…`;
}

function boardLabel(board: { name: string; acronym: string | null } | null): string {
  return board?.acronym?.trim() || board?.name?.trim() || "";
}

function toBuilderQuestion(row: {
  id: string;
  year: number | null;
  board_id: string | null;
  subject_id: string | null;
  topic_id: string | null;
  boards: { name: string; acronym: string | null } | null;
  subjects: { name: string } | null;
  topics: { name: string } | null;
}): StudyBuilderQuestion {
  return {
    id: row.id,
    year: row.year,
    boardId: row.board_id,
    subjectId: row.subject_id,
    topicId: row.topic_id,
    boardLabel:
      boardLabel(row.boards as { name: string; acronym: string | null } | null) ?? "Sem banca",
    subjectLabel: (row.subjects as { name: string } | null)?.name?.trim() || "Sem disciplina",
    topicLabel: (row.topics as { name: string } | null)?.name?.trim() || "Sem assunto",
  };
}

function applyTabFilter(items: ReviewCenterItem[], tab: ReviewTab): ReviewCenterItem[] {
  switch (tab) {
    case "favorites":
      return items.filter((item) => item.isFavorite);
    case "review":
      return items.filter((item) => item.isReviewLater);
    case "wrong":
      return items.filter((item) => item.errorCount > 0);
    case "unanswered":
      return items;
    default:
      return items;
  }
}

function applyTaxonomyFilters(
  items: ReviewCenterItem[],
  filters: StudyBuilderFilters,
): ReviewCenterItem[] {
  return items.filter((item) => {
    if (filters.boardId !== ALL_FILTER && item.boardId !== filters.boardId) return false;
    if (filters.subjectId !== ALL_FILTER && item.subjectId !== filters.subjectId) return false;
    if (filters.topicId !== ALL_FILTER && item.topicId !== filters.topicId) return false;
    if (filters.year !== ALL_FILTER && item.year !== Number(filters.year)) return false;
    return true;
  });
}

function catalogFromItems(items: ReviewCenterItem[]): StudyBuilderQuestion[] {
  return items.map((item) => ({
    id: item.questionId,
    year: item.year,
    boardId: item.boardId,
    subjectId: item.subjectId,
    topicId: item.topicId,
    boardLabel: item.boardName ?? "Sem banca",
    subjectLabel: item.subjectName ?? "Sem disciplina",
    topicLabel: item.topicName ?? "Sem assunto",
  }));
}

export async function fetchReviewCenterSnapshot(userId: string): Promise<ReviewCenterSnapshot> {
  const distributions = await fetchAvailableDistributions(userId);
  const distributionIds = distributions.map((dist) => dist.distribution_id);

  const { data: distributionRows, error: distributionError } = distributionIds.length
    ? await supabase
        .from("content_distributions")
        .select("id, name, package_version_id")
        .in("id", distributionIds)
    : { data: [], error: null };

  if (distributionError) throw distributionError;

  const distributionByVersion = new Map<string, { id: string; name: string }>();
  for (const row of distributionRows ?? []) {
    if (!row.package_version_id) continue;
    distributionByVersion.set(row.package_version_id, { id: row.id, name: row.name });
  }

  const versionIds = [...distributionByVersion.keys()];

  const { data: sessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("id, distribution_id, content_distributions(name)")
    .eq("user_id", userId);

  if (sessionsError) throw sessionsError;

  const sessionIds = (sessions ?? []).map((session) => session.id);
  const distributionNameById = new Map(
    (sessions ?? []).map((session) => [
      session.distribution_id,
      (session.content_distributions as { name: string } | null)?.name ?? "—",
    ]),
  );

  type AttemptRow = {
    id: string;
    study_session_id: string;
    question_id: string;
    selected_answer: string | null;
    is_correct: boolean | null;
    answered_at: string | null;
    favorite: boolean;
    review_later: boolean;
    questions: {
      id: string;
      statement: string;
      year: number | null;
      board_id: string | null;
      subject_id: string | null;
      topic_id: string | null;
      package_version_id: string;
      boards: { name: string; acronym: string | null } | null;
      subjects: { name: string } | null;
      topics: { name: string } | null;
    } | null;
    study_sessions: {
      distribution_id: string;
    } | null;
  };

  let attemptRows: AttemptRow[] = [];
  if (sessionIds.length) {
    const { data, error } = await supabase
      .from("study_session_questions")
      .select(
        `
        id,
        study_session_id,
        question_id,
        selected_answer,
        is_correct,
        answered_at,
        favorite,
        review_later,
        questions(
          id,
          statement,
          year,
          board_id,
          subject_id,
          topic_id,
          package_version_id,
          boards(name, acronym),
          subjects(name),
          topics(name)
        ),
        study_sessions(distribution_id)
      `,
      )
      .in("study_session_id", sessionIds);

    if (error) throw error;
    attemptRows = (data ?? []) as AttemptRow[];
  }

  const aggregates = new Map<string, ReviewCenterItem>();
  const answeredQuestionIds = new Set<string>();

  for (const row of attemptRows) {
    const question = row.questions;
    if (!question) continue;

    const distributionId =
      row.study_sessions?.distribution_id ??
      distributionByVersion.get(question.package_version_id)?.id ??
      distributions[0]?.distribution_id ??
      "";

    const distributionName =
      distributionNameById.get(distributionId) ??
      distributionByVersion.get(question.package_version_id)?.name ??
      "—";

    const board = question.boards as { name: string; acronym: string | null } | null;
    const subject = question.subjects as { name: string } | null;
    const topic = question.topics as { name: string } | null;

    const current = aggregates.get(question.id) ?? {
      questionId: question.id,
      statement: question.statement,
      statementSummary: summarizeStatement(question.statement),
      boardName: boardLabel(board),
      year: question.year,
      subjectName: subject?.name?.trim() || null,
      topicName: topic?.name?.trim() || null,
      boardId: question.board_id,
      subjectId: question.subject_id,
      topicId: question.topic_id,
      lastAnswer: null,
      errorCount: 0,
      correctCount: 0,
      lastReviewedAt: null,
      isFavorite: false,
      isReviewLater: false,
      distributionId,
      distributionName,
      sessionId: row.study_session_id,
      sessionQuestionId: row.id,
    };

    if (row.favorite) {
      current.isFavorite = true;
      current.sessionId = row.study_session_id;
      current.sessionQuestionId = row.id;
    }
    if (row.review_later) {
      current.isReviewLater = true;
      current.sessionId = row.study_session_id;
      current.sessionQuestionId = row.id;
    }

    if (row.answered_at) {
      answeredQuestionIds.add(question.id);
      if (row.is_correct === true) current.correctCount += 1;
      if (row.is_correct === false) current.errorCount += 1;

      const previous = current.lastReviewedAt ? new Date(current.lastReviewedAt).getTime() : 0;
      const currentTime = new Date(row.answered_at).getTime();
      if (currentTime >= previous) {
        current.lastReviewedAt = row.answered_at;
        current.lastAnswer = row.selected_answer;
        current.sessionId = row.study_session_id;
        current.sessionQuestionId = row.id;
      }
    }

    aggregates.set(question.id, current);
  }

  const items = [...aggregates.values()];

  let unansweredItems: ReviewCenterItem[] = [];
  let catalogQuestions: StudyBuilderQuestion[] = [];

  if (versionIds.length) {
    const PAGE_SIZE = 1000;
    const acervoRows: Array<{
      id: string;
      statement: string;
      year: number | null;
      board_id: string | null;
      subject_id: string | null;
      topic_id: string | null;
      package_version_id: string;
      boards: { name: string; acronym: string | null } | null;
      subjects: { name: string } | null;
      topics: { name: string } | null;
    }> = [];

    let from = 0;
    for (;;) {
      const { data, error: acervoError } = await supabase
        .from("questions")
        .select(
          `
        id,
        statement,
        year,
        board_id,
        subject_id,
        topic_id,
        package_version_id,
        boards(name, acronym),
        subjects(name),
        topics(name)
      `,
        )
        .in("package_version_id", versionIds)
        .range(from, from + PAGE_SIZE - 1);

      if (acervoError) throw acervoError;

      const page = data ?? [];
      acervoRows.push(...(page as typeof acervoRows));
      if (page.length < PAGE_SIZE) break;
      from += PAGE_SIZE;
    }

    catalogQuestions = acervoRows.map((row) => toBuilderQuestion(row));

    unansweredItems = acervoRows
      .filter((row) => !answeredQuestionIds.has(row.id))
      .map((row) => {
        const distribution = distributionByVersion.get(row.package_version_id);
        const board = row.boards as { name: string; acronym: string | null } | null;
        const subject = row.subjects as { name: string } | null;
        const topic = row.topics as { name: string } | null;

        return {
          questionId: row.id,
          statement: row.statement,
          statementSummary: summarizeStatement(row.statement),
          boardName: boardLabel(board),
          year: row.year,
          subjectName: subject?.name?.trim() || null,
          topicName: topic?.name?.trim() || null,
          boardId: row.board_id,
          subjectId: row.subject_id,
          topicId: row.topic_id,
          lastAnswer: null,
          errorCount: 0,
          correctCount: 0,
          lastReviewedAt: null,
          isFavorite: false,
          isReviewLater: false,
          distributionId: distribution?.id ?? distributions[0]?.distribution_id ?? "",
          distributionName: distribution?.name ?? "—",
          sessionId: null,
          sessionQuestionId: null,
        };
      });
  }

  const stats: ReviewCenterStats = {
    favorites: items.filter((item) => item.isFavorite).length,
    review: items.filter((item) => item.isReviewLater).length,
    wrong: items.filter((item) => item.errorCount > 0).length,
    unanswered: unansweredItems.length,
  };

  return { items, unansweredItems, stats, catalogQuestions };
}

export function paginateReviewCenter(
  snapshot: ReviewCenterSnapshot,
  filters: ReviewCenterFilters,
): ReviewCenterPage {
  const pool =
    filters.tab === "unanswered"
      ? snapshot.unansweredItems
      : applyTabFilter(snapshot.items, filters.tab);

  const catalog = filters.tab === "unanswered" ? snapshot.catalogQuestions : catalogFromItems(pool);

  const builderFilters: StudyBuilderFilters = {
    boardId: filters.boardId,
    subjectId: filters.subjectId,
    topicId: filters.topicId,
    year: filters.year,
  };

  const filtered =
    filters.tab === "unanswered"
      ? applyTaxonomyFilters(pool, builderFilters)
      : applyTaxonomyFilters(pool, builderFilters);

  const sorted = [...filtered].sort((a, b) => {
    const aTime = a.lastReviewedAt ? new Date(a.lastReviewedAt).getTime() : 0;
    const bTime = b.lastReviewedAt ? new Date(b.lastReviewedAt).getTime() : 0;
    return bTime - aTime;
  });

  const total = sorted.length;
  const from = filters.page * REVIEW_PAGE_SIZE;
  const pageItems = sorted.slice(from, from + REVIEW_PAGE_SIZE);

  const facetPool = filterQuestions(catalog, builderFilters);

  return {
    items: pageItems,
    total,
    stats: snapshot.stats,
    boardOptions: buildBoardOptions(facetPool, builderFilters),
    subjectOptions: buildSubjectOptions(facetPool, builderFilters),
    topicOptions: buildTopicOptions(facetPool, builderFilters),
    yearOptions: buildYearOptions(facetPool, builderFilters),
  };
}

export async function clearQuestionFavorite(userId: string, questionId: string) {
  const { data: sessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("id")
    .eq("user_id", userId);

  if (sessionsError) throw sessionsError;

  const sessionIds = (sessions ?? []).map((session) => session.id);
  if (!sessionIds.length) return;

  const { error } = await supabase
    .from("study_session_questions")
    .update({ favorite: false })
    .in("study_session_id", sessionIds)
    .eq("question_id", questionId);

  if (error) throw error;
}

export async function clearQuestionReviewLater(userId: string, questionId: string) {
  const { data: sessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("id")
    .eq("user_id", userId);

  if (sessionsError) throw sessionsError;

  const sessionIds = (sessions ?? []).map((session) => session.id);
  if (!sessionIds.length) return;

  const { error } = await supabase
    .from("study_session_questions")
    .update({ review_later: false })
    .in("study_session_id", sessionIds)
    .eq("question_id", questionId);

  if (error) throw error;
}

export function formatReviewCenterError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Erro ao carregar a central de revisão.";
}
