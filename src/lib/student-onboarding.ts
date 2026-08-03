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
