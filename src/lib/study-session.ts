/**
 * Motor de Sessões de Estudo (Sprint 7A).
 */

import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/log";

export const STUDY_MODES_EDITABLE = ["STUDY", "EXAM"] as const;
export const STUDY_MODES_SELECTABLE = ["STUDY", "EXAM", "REVIEW", "FAVORITES", "WRONG_ONLY"] as const;
export const STUDY_MODES_ALL = ["STUDY", "EXAM", "REVIEW", "FAVORITES", "WRONG_ONLY"] as const;
export const FILTER_STUDY_MODES = ["REVIEW", "FAVORITES", "WRONG_ONLY"] as const;
export const SESSION_STATUS_ALL = ["IN_PROGRESS", "PAUSED", "FINISHED"] as const;

export type StudyModeEditable = (typeof STUDY_MODES_EDITABLE)[number];
export type StudyModeSelectable = (typeof STUDY_MODES_SELECTABLE)[number];
export type FilterStudyMode = (typeof FILTER_STUDY_MODES)[number];
export type StudyMode = (typeof STUDY_MODES_ALL)[number];
export type StudySessionStatus = (typeof SESSION_STATUS_ALL)[number];

export const FILTER_MODE_EMPTY_MESSAGES: Record<FilterStudyMode, string> = {
  FAVORITES: "Você ainda não favoritou questões nesta distribuição.",
  REVIEW: "Não há questões marcadas para revisão nesta distribuição.",
  WRONG_ONLY: "Não há questões respondidas incorretamente nesta distribuição.",
};

export function isFilterStudyMode(mode: StudyMode): mode is FilterStudyMode {
  return (FILTER_STUDY_MODES as readonly string[]).includes(mode);
}

export const STUDY_MODE_LABELS: Record<StudyMode, string> = {
  STUDY: "Estudo",
  EXAM: "Prova",
  REVIEW: "Revisão",
  FAVORITES: "Favoritos",
  WRONG_ONLY: "Apenas erradas",
};

export const SESSION_QUANTITY_OPTIONS = [10, 20, 30, 50, "all"] as const;
export type SessionQuantity = (typeof SESSION_QUANTITY_OPTIONS)[number];

export type QuestionOrder = "random" | "sequential";
export type ShowAnswersTiming = "during" | "final";

export type StudySessionSettings = {
  question_count: number | "all";
  question_order: QuestionOrder;
  show_answers: ShowAnswersTiming;
};

export type AvailableDistribution = {
  distribution_id: string;
  distribution_name: string;
  subscription_id: string;
  package_name: string;
  course_name: string;
  version_number: string;
  version_name: string;
};

export class StudySessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudySessionError";
  }
}

export function formatStudySessionError(error: unknown): string {
  if (error instanceof StudySessionError) return error.message;
  if (error instanceof Error) {
    if (error.message.includes("row-level security")) {
      return "Sem permissão para esta operação.";
    }
    return error.message;
  }
  return "Erro ao criar sessão de estudo.";
}

function isSubscriptionActive(startsAt: string, expiresAt: string | null): boolean {
  const now = Date.now();
  if (new Date(startsAt).getTime() > now) return false;
  if (expiresAt && new Date(expiresAt).getTime() < now) return false;
  return true;
}

function isDistributionAvailable(availableFrom: string | null, availableUntil: string | null): boolean {
  const now = Date.now();
  if (availableFrom && new Date(availableFrom).getTime() > now) return false;
  if (availableUntil && new Date(availableUntil).getTime() < now) return false;
  return true;
}

export async function fetchAvailableDistributions(userId: string): Promise<AvailableDistribution[]> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      id,
      starts_at,
      expires_at,
      status,
      distribution_id,
      content_distributions!inner(
        id,
        name,
        status,
        available_from,
        available_until,
        package_versions(
          version_number,
          name,
          packages(name, courses(name))
        )
      )
    `)
    .eq("user_id", userId)
    .eq("status", "ACTIVE")
    .not("distribution_id", "is", null);

  if (error) throw error;

  return (data ?? [])
    .filter((row) => {
      const dist = row.content_distributions as {
        status: string;
        available_from: string | null;
        available_until: string | null;
      } | null;
      if (!dist || dist.status !== "ACTIVE") return false;
      if (!isSubscriptionActive(row.starts_at, row.expires_at)) return false;
      return isDistributionAvailable(dist.available_from, dist.available_until);
    })
    .map((row) => {
      const dist = row.content_distributions as {
        id: string;
        name: string;
        package_versions: {
          version_number: string;
          name: string;
          packages: { name: string; courses: { name: string } | null } | null;
        } | null;
      };
      return {
        distribution_id: dist.id,
        distribution_name: dist.name,
        subscription_id: row.id,
        package_name: dist.package_versions?.packages?.name ?? "—",
        course_name: dist.package_versions?.packages?.courses?.name ?? "—",
        version_number: dist.package_versions?.version_number ?? "—",
        version_name: dist.package_versions?.name ?? "—",
      };
    });
}

async function getDistributionPackageVersionId(distributionId: string): Promise<string> {
  const { data, error } = await supabase
    .from("content_distributions")
    .select("package_version_id")
    .eq("id", distributionId)
    .maybeSingle();

  if (error) throw error;
  if (!data?.package_version_id) {
    throw new StudySessionError("Distribuição sem versão vinculada.");
  }
  return data.package_version_id;
}

export async function getFilteredQuestionIdsForDistribution(
  userId: string,
  packageVersionId: string,
  mode: StudyMode,
): Promise<string[]> {
  if (!isFilterStudyMode(mode)) return [];

  const { data: sessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("id")
    .eq("user_id", userId);

  if (sessionsError) throw sessionsError;

  const sessionIds = (sessions ?? []).map((session) => session.id);
  if (!sessionIds.length) return [];

  let query = supabase
    .from("study_session_questions")
    .select("question_id, questions!inner(package_version_id)")
    .in("study_session_id", sessionIds)
    .eq("questions.package_version_id", packageVersionId);

  if (mode === "FAVORITES") {
    query = query.eq("favorite", true);
  } else if (mode === "REVIEW") {
    query = query.eq("review_later", true);
  } else {
    query = query.eq("is_correct", false).not("answered_at", "is", null);
  }

  const { data, error } = await query;
  if (error) throw error;

  return [...new Set((data ?? []).map((row) => row.question_id))];
}

async function validateSessionAccess(userId: string, distributionId: string) {
  const { data: sub, error: subError } = await supabase
    .from("subscriptions")
    .select("id, status, starts_at, expires_at")
    .eq("user_id", userId)
    .eq("distribution_id", distributionId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (subError) throw subError;
  if (!sub) throw new StudySessionError("Assinatura ativa não encontrada para esta distribuição.");
  if (!isSubscriptionActive(sub.starts_at, sub.expires_at)) {
    throw new StudySessionError("Sua assinatura não está vigente neste período.");
  }

  const { data: dist, error: distError } = await supabase
    .from("content_distributions")
    .select("id, status, available_from, available_until")
    .eq("id", distributionId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (distError) throw distError;
  if (!dist) throw new StudySessionError("Distribuição não encontrada ou inativa.");
  if (!isDistributionAvailable(dist.available_from, dist.available_until)) {
    throw new StudySessionError("Distribuição fora do período de disponibilidade.");
  }
}

export async function createStudySession(input: {
  distributionId: string;
  mode: StudyModeSelectable;
  settings: StudySessionSettings;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new StudySessionError("Usuário não autenticado.");

  await validateSessionAccess(user.id, input.distributionId);

  if (isFilterStudyMode(input.mode)) {
    const packageVersionId = await getDistributionPackageVersionId(input.distributionId);
    const questionIds = await getFilteredQuestionIdsForDistribution(
      user.id,
      packageVersionId,
      input.mode,
    );
    if (!questionIds.length) {
      throw new StudySessionError(FILTER_MODE_EMPTY_MESSAGES[input.mode]);
    }
  }

  const settings: StudySessionSettings = {
    ...input.settings,
    show_answers: input.mode === "EXAM" ? "final" : input.settings.show_answers,
  };

  const { data: created, error } = await supabase
    .from("study_sessions")
    .insert({
      user_id: user.id,
      distribution_id: input.distributionId,
      mode: input.mode,
      status: "IN_PROGRESS",
      settings,
      started_at: new Date().toISOString(),
    })
    .select("id, mode, status, started_at")
    .single();

  if (error) throw error;

  await logEvent("study.session.create", "study_sessions", created.id, {
    distribution_id: input.distributionId,
    mode: input.mode,
    settings,
  });

  if (isFilterStudyMode(input.mode)) {
    await logEvent("study.session.review.create", "study_sessions", created.id, {
      distribution_id: input.distributionId,
      mode: input.mode,
    });
  }

  return created;
}
