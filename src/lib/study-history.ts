/**
 * Histórico de sessões de estudo do aluno.
 */

import { supabase } from "@/integrations/supabase/client";
import {
  SESSION_STATUS_ALL,
  STUDY_MODES_ALL,
  type StudyMode,
  type StudySessionStatus,
} from "@/lib/study-session";

export const HISTORY_PAGE_SIZE = 10;

export type RecentSession = {
  id: string;
  date: string;
  distributionName: string;
  mode: StudyMode;
  status: StudySessionStatus;
  correctCount: number;
  totalAnswered: number;
  durationSeconds: number;
};

export const SESSION_STATUS_LABELS: Record<StudySessionStatus, string> = {
  IN_PROGRESS: "Em andamento",
  FINISHED: "Concluída",
  PAUSED: "Pausada",
};

export type StudyHistoryRow = {
  id: string;
  date: string;
  distributionId: string;
  distributionName: string;
  courseName: string;
  packageName: string;
  mode: StudyMode;
  status: StudySessionStatus;
  totalQuestions: number;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  accuracyPercent: number;
  durationSeconds: number;
};

export type StudyHistoryFilters = {
  page: number;
  pageSize: number;
  distributionId?: string;
  courseName?: string;
  mode?: StudyMode | "all";
  status?: StudySessionStatus | "all";
  periodDays?: number | "all";
  search?: string;
};

export type StudyHistoryResult = {
  rows: StudyHistoryRow[];
  total: number;
};

export type HistoryFilterOptions = {
  distributions: Array<{ id: string; name: string }>;
  courses: string[];
};

type SessionRow = {
  id: string;
  mode: StudyMode;
  status: StudySessionStatus;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number | null;
  created_at: string;
  distribution_id: string;
  content_distributions: {
    name: string;
    package_versions: {
      version_number: string;
      packages: { name: string; courses: { name: string } | null } | null;
    } | null;
  };
};

type AnswerRow = {
  study_session_id: string;
  is_correct: boolean | null;
  response_time_seconds: number | null;
  answered_at: string | null;
};

function periodStartFromDays(periodDays: number | "all" | undefined): string | null {
  if (!periodDays || periodDays === "all") return null;
  const date = new Date();
  date.setDate(date.getDate() - periodDays);
  return date.toISOString();
}

function mapSessionRow(
  session: SessionRow,
  answers: AnswerRow[],
  totalQuestions: number,
): StudyHistoryRow {
  const answered = answers.filter((answer) => answer.answered_at);
  const correctCount = answered.filter((answer) => answer.is_correct === true).length;
  const wrongCount = answered.filter((answer) => answer.is_correct === false).length;
  const answeredTime = answered.reduce(
    (sum, answer) => sum + (answer.response_time_seconds ?? 0),
    0,
  );
  const distribution = session.content_distributions;
  const packageInfo = distribution.package_versions?.packages;

  return {
    id: session.id,
    date: session.finished_at ?? session.started_at ?? session.created_at,
    distributionId: session.distribution_id,
    distributionName: distribution.name,
    courseName: packageInfo?.courses?.name ?? "—",
    packageName: packageInfo?.name ?? "—",
    mode: session.mode,
    status: session.status,
    totalQuestions,
    totalAnswered: answered.length,
    correctCount,
    wrongCount,
    accuracyPercent: answered.length ? Math.round((correctCount / answered.length) * 100) : 0,
    durationSeconds: answeredTime > 0 ? answeredTime : (session.duration_seconds ?? 0),
  };
}

async function attachAnswerStats(sessions: SessionRow[]): Promise<StudyHistoryRow[]> {
  if (!sessions.length) return [];

  const sessionIds = sessions.map((session) => session.id);

  const { data: questionRows, error: questionsError } = await supabase
    .from("study_session_questions")
    .select("study_session_id, is_correct, response_time_seconds, answered_at")
    .in("study_session_id", sessionIds);

  if (questionsError) throw questionsError;

  const answersBySession = new Map<string, AnswerRow[]>();
  const totalQuestionsBySession = new Map<string, number>();

  for (const row of questionRows ?? []) {
    const current = answersBySession.get(row.study_session_id) ?? [];
    current.push(row);
    answersBySession.set(row.study_session_id, current);
    totalQuestionsBySession.set(
      row.study_session_id,
      (totalQuestionsBySession.get(row.study_session_id) ?? 0) + 1,
    );
  }

  return sessions.map((session) =>
    mapSessionRow(
      session,
      answersBySession.get(session.id) ?? [],
      totalQuestionsBySession.get(session.id) ?? 0,
    ),
  );
}

async function resolveDistributionIdsByCourse(
  userId: string,
  courseName: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("study_sessions")
    .select(`
      distribution_id,
      content_distributions!inner(
        package_versions(packages(courses(name)))
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;

  const ids = new Set<string>();
  for (const row of data ?? []) {
    const dist = row.content_distributions as {
      package_versions: { packages: { courses: { name: string } | null } | null } | null;
    };
    const name = dist.package_versions?.packages?.courses?.name;
    if (name === courseName) ids.add(row.distribution_id);
  }

  return [...ids];
}

export async function fetchHistoryFilterOptions(userId: string): Promise<HistoryFilterOptions> {
  const { data, error } = await supabase
    .from("study_sessions")
    .select(`
      distribution_id,
      content_distributions!inner(
        name,
        package_versions(packages(courses(name)))
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;

  const distributions = new Map<string, string>();
  const courses = new Set<string>();

  for (const row of data ?? []) {
    const dist = row.content_distributions as {
      name: string;
      package_versions: { packages: { courses: { name: string } | null } | null } | null;
    };
    distributions.set(row.distribution_id, dist.name);
    const courseName = dist.package_versions?.packages?.courses?.name;
    if (courseName) courses.add(courseName);
  }

  return {
    distributions: [...distributions.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    courses: [...courses].sort((a, b) => a.localeCompare(b, "pt-BR")),
  };
}

export async function fetchStudyHistory(
  userId: string,
  filters: StudyHistoryFilters,
): Promise<StudyHistoryResult> {
  let distributionIds: string[] | null = null;

  if (filters.courseName && filters.courseName !== "all") {
    distributionIds = await resolveDistributionIdsByCourse(userId, filters.courseName);
    if (!distributionIds.length) return { rows: [], total: 0 };
  }

  let query = supabase
    .from("study_sessions")
    .select(
      `
      id,
      mode,
      status,
      started_at,
      finished_at,
      duration_seconds,
      created_at,
      distribution_id,
      content_distributions!inner(
        name,
        package_versions!inner(
          version_number,
          packages!inner(name, courses(name))
        )
      )
    `,
      { count: "exact" },
    )
    .eq("user_id", userId);

  if (filters.distributionId && filters.distributionId !== "all") {
    query = query.eq("distribution_id", filters.distributionId);
  } else if (distributionIds) {
    query = query.in("distribution_id", distributionIds);
  }

  if (filters.mode && filters.mode !== "all") {
    query = query.eq("mode", filters.mode);
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const periodStart = periodStartFromDays(filters.periodDays);
  if (periodStart) {
    query = query.gte("created_at", periodStart);
  }

  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.or(
      `content_distributions.name.ilike.${term},content_distributions.package_versions.packages.name.ilike.${term},content_distributions.package_versions.packages.courses.name.ilike.${term}`,
    );
  }

  const from = filters.page * filters.pageSize;
  const to = from + filters.pageSize - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const rows = await attachAnswerStats((data ?? []) as SessionRow[]);
  return { rows, total: count ?? 0 };
}

function toRecentSession(row: StudyHistoryRow): RecentSession {
  return {
    id: row.id,
    date: row.date,
    distributionName: row.distributionName,
    mode: row.mode,
    status: row.status,
    correctCount: row.correctCount,
    totalAnswered: row.totalAnswered,
    durationSeconds: row.durationSeconds,
  };
}

export async function fetchRecentSessions(userId: string): Promise<RecentSession[]> {
  const { rows } = await fetchStudyHistory(userId, {
    page: 0,
    pageSize: 5,
  });
  return rows.map(toRecentSession);
}

export const HISTORY_MODE_OPTIONS = ["all", ...STUDY_MODES_ALL] as const;
export const HISTORY_STATUS_OPTIONS = ["all", ...SESSION_STATUS_ALL] as const;
export const HISTORY_PERIOD_OPTIONS = [
  { value: "all", label: "Todo o período" },
  { value: 7, label: "Últimos 7 dias" },
  { value: 30, label: "Últimos 30 dias" },
  { value: 90, label: "Últimos 90 dias" },
] as const;
