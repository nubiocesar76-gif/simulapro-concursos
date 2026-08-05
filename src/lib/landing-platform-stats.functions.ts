import { createServerFn } from "@tanstack/react-start";

const RC1_PACKAGE_VERSION_ID = "940ad0d6-1147-4ba1-be1a-0b07c34cb76b";

export type LandingPlatformStats = {
  questionCount: number;
  boardCount: number;
  disciplineCount: number;
  contestCount: number;
};

/** Arredonda para baixo em centenas/milhares — ex.: 4351 → "4.300+" */
export function formatLandingQuestionCount(count: number): string {
  if (count >= 1000) {
    const rounded = Math.floor(count / 100) * 100;
    return `${rounded.toLocaleString("pt-BR")}+`;
  }
  if (count >= 100) {
    const rounded = Math.floor(count / 10) * 10;
    return `${rounded}+`;
  }
  return `${count}+`;
}

export const FALLBACK_LANDING_PLATFORM_STATS: LandingPlatformStats = {
  questionCount: 4300,
  boardCount: 13,
  disciplineCount: 30,
  contestCount: 2,
};

export const getLandingPlatformStats = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { count: questionCount, error: countError } = await supabaseAdmin
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("package_version_id", RC1_PACKAGE_VERSION_ID);

  if (countError) throw countError;

  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("board_id, subject_id, position_id")
    .eq("package_version_id", RC1_PACKAGE_VERSION_ID)
    .limit(10000);

  if (error) throw error;

  const rows = data ?? [];
  const boardIds = new Set(rows.map((row) => row.board_id).filter(Boolean));
  const subjectIds = new Set(rows.map((row) => row.subject_id).filter(Boolean));
  const positionIds = new Set(rows.map((row) => row.position_id).filter(Boolean));

  return {
    questionCount: questionCount ?? rows.length,
    boardCount: boardIds.size,
    disciplineCount: subjectIds.size,
    contestCount: positionIds.size,
  } satisfies LandingPlatformStats;
});

export function buildLandingStatsDisplay(stats: LandingPlatformStats) {
  return [
    { value: formatLandingQuestionCount(stats.questionCount), label: "Questões" },
    { value: String(stats.boardCount), label: "Bancas" },
    { value: String(stats.disciplineCount), label: "Disciplinas" },
    { value: "Completos", label: "Simulados" },
    { value: String(stats.contestCount), label: "Concursos" },
  ];
}

export const PROVA_SOCIAL_STAT_LABELS: Record<string, string> = {
  Questões: "Questões organizadas",
  Bancas: "Bancas cobertas",
  Disciplinas: "Disciplinas mapeadas",
  Simulados: "Simulados completos",
  Concursos: "Concursos na plataforma",
};
