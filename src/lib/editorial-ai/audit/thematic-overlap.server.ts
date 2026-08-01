import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Checagem de sobreposição temática (Fase 5 — Auditor Editorial, IT-007).
 * Versão reutilizável do que foi feito manualmente na Sprint 4.2: busca no
 * acervo publicado (`questions`) por questões da mesma banca cujo enunciado
 * contenha o termo do assunto/subassunto do ciclo auditado.
 *
 * Mesma limitação já documentada no Validator (`AUSENCIA_INDICIO_COPIA`):
 * é uma busca textual literal/temática, não prova nem descarta paráfrase —
 * só levanta candidatos para o revisor humano comparar lado a lado.
 */
export type EditorialAuditOverlapCandidate = {
  questionId: string;
  excerpt: string;
};

export async function findEditorialAuditThematicOverlap(input: {
  boardId: string;
  searchTerm: string;
  limit?: number;
}): Promise<EditorialAuditOverlapCandidate[]> {
  const term = input.searchTerm.trim();
  if (!term) return [];

  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("id, statement")
    .eq("board_id", input.boardId)
    .ilike("statement", `%${term}%`)
    .limit(input.limit ?? 5);

  if (error) throw error;

  return (data ?? []).map((q) => ({
    questionId: q.id,
    excerpt: q.statement.length > 200 ? `${q.statement.slice(0, 200)}...` : q.statement,
  }));
}
