/**
 * Consultas e agregações do Dashboard do Aluno (Sprint 7D).
 */

import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/log";
import {
  fetchAvailableDistributions,
  type StudyMode,
  type StudySessionStatus,
} from "@/lib/study-session";
import { fetchRecentSessions, type RecentSession } from "@/lib/study-history";

export type { RecentSession };
export { fetchRecentSessions };

export type DashboardStats = {
  questionsAnswered: number;
  accuracyPercent: number;
  completedSessions: number;
  totalStudySeconds: number;
};

export type ContinueStudy = {
  sessionId: string;
  distributionName: string;
  mode: StudyMode;
  answeredCount: number;
  totalCount: number;
};

export type DashboardDistribution = {
  distribution_id: string;
  distribution_name: string;
  package_name: string;
  course_name: string;
  version_number: string;
  questionCount: number;
  lastActivityAt: string | null;
};

export type SubjectPerformance = {
  subjectId: string;
  subjectName: string;
  answered: number;
  correct: number;
  percent: number;
};

export type StudyFilterIndicators = {
  favoritesCount: number;
  reviewLaterCount: number;
  pendingReviewCount: number;
};

export type StudentDashboardData = {
  stats: DashboardStats;
  filterIndicators: StudyFilterIndicators;
  continueStudy: ContinueStudy | null;
  distributions: DashboardDistribution[];
  recentSessions: RecentSession[];
  subjectPerformance: SubjectPerformance[];
};

export function formatStudyDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 min";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes} min`;
}

export function formatDashboardDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function fetchSessionQuestionStats(userId: string) {
  const { data: sessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("id, status, duration_seconds")
    .eq("user_id", userId);

  if (sessionsError) throw sessionsError;

  const sessionIds = (sessions ?? []).map((session) => session.id);
  if (!sessionIds.length) {
    return {
      sessions: sessions ?? [],
      answers: [] as Array<{
        is_correct: boolean | null;
        response_time_seconds: number | null;
        answered_at: string | null;
        study_session_id: string;
      }>,
    };
  }

  const { data: answers, error: answersError } = await supabase
    .from("study_session_questions")
    .select("is_correct, response_time_seconds, answered_at, study_session_id")
    .in("study_session_id", sessionIds)
    .not("answered_at", "is", null);

  if (answersError) throw answersError;

  return { sessions: sessions ?? [], answers: answers ?? [] };
}

function buildStats(
  sessions: Array<{ status: StudySessionStatus; duration_seconds: number | null }>,
  answers: Array<{ is_correct: boolean | null; response_time_seconds: number | null }>,
): DashboardStats {
  const questionsAnswered = answers.length;
  const correctCount = answers.filter((answer) => answer.is_correct === true).length;
  const accuracyPercent = questionsAnswered
    ? Math.round((correctCount / questionsAnswered) * 100)
    : 0;
  const completedSessions = sessions.filter((session) => session.status === "FINISHED").length;
  const answeredTime = answers.reduce(
    (sum, answer) => sum + (answer.response_time_seconds ?? 0),
    0,
  );
  const finishedTime = sessions
    .filter((session) => session.status === "FINISHED")
    .reduce((sum, session) => sum + (session.duration_seconds ?? 0), 0);
  const totalStudySeconds = answeredTime > 0 ? answeredTime : finishedTime;

  return {
    questionsAnswered,
    accuracyPercent,
    completedSessions,
    totalStudySeconds,
  };
}

async function fetchContinueStudy(userId: string): Promise<ContinueStudy | null> {
  const { data: activeSession, error } = await supabase
    .from("study_sessions")
    .select(`
      id,
      mode,
      content_distributions!inner(name)
    `)
    .eq("user_id", userId)
    .eq("status", "IN_PROGRESS")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!activeSession) return null;

  const { data: sessionQuestions, error: questionsError } = await supabase
    .from("study_session_questions")
    .select("answered_at")
    .eq("study_session_id", activeSession.id);

  if (questionsError) throw questionsError;

  const rows = sessionQuestions ?? [];
  const distribution = activeSession.content_distributions as { name: string };

  return {
    sessionId: activeSession.id,
    distributionName: distribution.name,
    mode: activeSession.mode,
    answeredCount: rows.filter((row) => row.answered_at).length,
    totalCount: rows.length,
  };
}

async function fetchDashboardDistributions(userId: string): Promise<DashboardDistribution[]> {
  const available = await fetchAvailableDistributions(userId);
  if (!available.length) return [];

  const distributionIds = available.map((item) => item.distribution_id);

  const { data: distributionRows, error: distributionError } = await supabase
    .from("content_distributions")
    .select("id, package_version_id")
    .in("id", distributionIds);

  if (distributionError) throw distributionError;

  const versionIds = [...new Set((distributionRows ?? []).map((row) => row.package_version_id))];
  const versionByDistribution = new Map(
    (distributionRows ?? []).map((row) => [row.id, row.package_version_id]),
  );

  const { data: questionRows, error: questionError } = versionIds.length
    ? await supabase
        .from("questions")
        .select("package_version_id")
        .in("package_version_id", versionIds)
    : { data: [], error: null };

  if (questionError) throw questionError;

  const questionCountByVersion = new Map<string, number>();
  for (const row of questionRows ?? []) {
    if (!row.package_version_id) continue;
    questionCountByVersion.set(
      row.package_version_id,
      (questionCountByVersion.get(row.package_version_id) ?? 0) + 1,
    );
  }

  const { data: activityRows, error: activityError } = await supabase
    .from("study_sessions")
    .select("distribution_id, updated_at, started_at")
    .eq("user_id", userId)
    .in("distribution_id", distributionIds)
    .order("updated_at", { ascending: false });

  if (activityError) throw activityError;

  const lastActivityByDistribution = new Map<string, string>();
  for (const row of activityRows ?? []) {
    if (!lastActivityByDistribution.has(row.distribution_id)) {
      lastActivityByDistribution.set(row.distribution_id, row.updated_at ?? row.started_at);
    }
  }

  return available.map((item) => {
    const versionId = versionByDistribution.get(item.distribution_id);
    return {
      distribution_id: item.distribution_id,
      distribution_name: item.distribution_name,
      package_name: item.package_name,
      course_name: item.course_name,
      version_number: item.version_number,
      questionCount: versionId ? (questionCountByVersion.get(versionId) ?? 0) : 0,
      lastActivityAt: lastActivityByDistribution.get(item.distribution_id) ?? null,
    };
  });
}

async function fetchSubjectPerformance(userId: string): Promise<SubjectPerformance[]> {
  const { data: sessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("id")
    .eq("user_id", userId);

  if (sessionsError) throw sessionsError;

  const sessionIds = (sessions ?? []).map((session) => session.id);
  if (!sessionIds.length) return [];

  const { data: answers, error: answersError } = await supabase
    .from("study_session_questions")
    .select(`
      is_correct,
      questions(subject_id, subjects(name))
    `)
    .in("study_session_id", sessionIds)
    .not("answered_at", "is", null);

  if (answersError) throw answersError;

  const grouped = new Map<string, SubjectPerformance>();

  for (const answer of answers ?? []) {
    const question = answer.questions as {
      subject_id: string | null;
      subjects: { name: string } | null;
    } | null;

    const subjectId = question?.subject_id;
    if (!subjectId) continue;

    const subjectName = question?.subjects?.name ?? "Sem disciplina";
    const current = grouped.get(subjectId) ?? {
      subjectId,
      subjectName,
      answered: 0,
      correct: 0,
      percent: 0,
    };

    current.answered += 1;
    if (answer.is_correct === true) current.correct += 1;
    grouped.set(subjectId, current);
  }

  return [...grouped.values()]
    .map((item) => ({
      ...item,
      percent: item.answered ? Math.round((item.correct / item.answered) * 100) : 0,
    }))
    .sort((a, b) => a.percent - b.percent);
}

async function fetchStudyFilterIndicators(userId: string): Promise<StudyFilterIndicators> {
  const { data: sessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("id")
    .eq("user_id", userId);

  if (sessionsError) throw sessionsError;

  const sessionIds = (sessions ?? []).map((session) => session.id);
  if (!sessionIds.length) {
    return { favoritesCount: 0, reviewLaterCount: 0, pendingReviewCount: 0 };
  }

  const { data: rows, error } = await supabase
    .from("study_session_questions")
    .select("question_id, favorite, review_later, is_correct, answered_at")
    .in("study_session_id", sessionIds);

  if (error) throw error;

  const favoriteQuestions = new Set<string>();
  const reviewQuestions = new Set<string>();
  const wrongQuestions = new Set<string>();

  for (const row of rows ?? []) {
    if (row.favorite) favoriteQuestions.add(row.question_id);
    if (row.review_later) reviewQuestions.add(row.question_id);
    if (row.answered_at && row.is_correct === false) wrongQuestions.add(row.question_id);
  }

  return {
    favoritesCount: favoriteQuestions.size,
    reviewLaterCount: reviewQuestions.size,
    pendingReviewCount: wrongQuestions.size,
  };
}

export async function fetchStudentDashboard(userId: string): Promise<StudentDashboardData> {
  const [
    { sessions, answers },
    continueStudy,
    distributions,
    recentSessions,
    subjectPerformance,
    filterIndicators,
  ] = await Promise.all([
    fetchSessionQuestionStats(userId),
    fetchContinueStudy(userId),
    fetchDashboardDistributions(userId),
    fetchRecentSessions(userId),
    fetchSubjectPerformance(userId),
    fetchStudyFilterIndicators(userId),
  ]);

  const data: StudentDashboardData = {
    stats: buildStats(sessions, answers),
    filterIndicators,
    continueStudy,
    distributions,
    recentSessions,
    subjectPerformance,
  };

  await logEvent("student.dashboard.view", "student_dashboard", userId, {
    questions_answered: data.stats.questionsAnswered,
    completed_sessions: data.stats.completedSessions,
  });

  return data;
}
