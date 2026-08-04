// Dados de apoio à jornada de primeiro acesso (Área → Cargo → Concursos → Plano).
// "Concursos disponíveis para um cargo" não tem FK direta no schema (exams só se liga a
// boards) — derivado via questions.exam_id, dado real já existente, sem tabela nova.

import { supabase } from "@/integrations/supabase/client";

export type AvailableExam = {
  id: string;
  name: string;
  year: number | null;
  boardName: string | null;
};

export async function fetchAvailableExamsForPosition(positionId: string): Promise<AvailableExam[]> {
  const { data: examIdRows, error: examIdError } = await supabase
    .from("questions")
    .select("exam_id")
    .eq("position_id", positionId)
    .not("exam_id", "is", null);

  if (examIdError) throw examIdError;

  const examIds = [...new Set((examIdRows ?? []).map((row) => row.exam_id as string))];
  if (!examIds.length) return [];

  const { data: exams, error: examsError } = await supabase
    .from("exams")
    .select("id, name, year, boards(name)")
    .in("id", examIds)
    .order("year", { ascending: false });

  if (examsError) throw examsError;

  return (exams ?? []).map((exam) => ({
    id: exam.id,
    name: exam.name,
    year: exam.year,
    boardName: (exam.boards as { name: string } | null)?.name ?? null,
  }));
}

// Distribuição RC1 (package_version), compartilhada por Enfermeiro e Técnico — mesma
// fonte já usada em commercial-plans.ts. Filtro aqui existe só para não contar, na
// apresentação resumida da etapa "Concursos cobertos", as questões duplicadas do
// pacote "Primeiro Simulado Grátis" (ver src/config/free-plan.ts) como se fossem
// conteúdo adicional distinto — mantém o número exibido igual ao tamanho real do acervo.
const RC1_PACKAGE_VERSION_ID = "940ad0d6-1147-4ba1-be1a-0b07c34cb76b";

export type AcervoStats = {
  totalQuestions: number;
  disciplineCount: number;
  boardNames: string[];
};

/**
 * Estatísticas reais do acervo de um cargo (contagem de questões, disciplinas e bancas
 * de referência), usadas na apresentação resumida da etapa "Concursos cobertos" quando
 * o cargo não tem `exam_id` vinculado (conteúdo inédito, sem edital publicado — ver
 * `fetchAvailableExamsForPosition` acima). Nunca inventa números: só agrega dados já
 * gravados em `questions`.
 */
export async function fetchAcervoStatsForPosition(positionId: string): Promise<AcervoStats> {
  const { data, error } = await supabase
    .from("questions")
    .select("subject_id, board_id")
    .eq("position_id", positionId)
    .eq("package_version_id", RC1_PACKAGE_VERSION_ID)
    .limit(2000);

  if (error) throw error;

  const rows = data ?? [];
  const boardIds = [...new Set(rows.map((row) => row.board_id).filter((id): id is string => !!id))];

  let boardNames: string[] = [];
  if (boardIds.length) {
    const { data: boards, error: boardsError } = await supabase
      .from("boards")
      .select("name")
      .in("id", boardIds)
      .order("name");
    if (boardsError) throw boardsError;
    boardNames = (boards ?? []).map((b) => b.name);
  }

  return {
    totalQuestions: rows.length,
    disciplineCount: new Set(rows.map((row) => row.subject_id)).size,
    boardNames,
  };
}
