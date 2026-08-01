import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Resolução de taxonomia para Publicação Editorial (Sprint 7.1A, IA-007).
 *
 * Mesmo padrão de busca de `resolveByName` (`src/lib/import.ts:336-357`):
 * `ilike("name", name)` sobre a mesma tabela (`subjects`/`topics`). Divergência
 * deliberada e mínima em relação a `resolveByName`: **esta função nunca cria
 * registro novo e nunca usa `.maybeSingle()`** (que lança erro em caso de
 * múltiplas linhas). Em vez disso retorna a contagem real de correspondências
 * (0, 1 ou N), porque a Sprint 7.1A exige publicar automaticamente só quando
 * a resolução é inequívoca (regra 4) e bloquear — nunca criar taxonomia nova
 * — quando não há ou há mais de uma correspondência (regra 5). Reaproveitar
 * `resolveByName` como está era impossível sem violar essa regra: ele resolve
 * "sempre para 1", criando quando não acha; aqui precisamos do oposto,
 * "resolver só quando já é 1, sem nunca criar".
 */
export type EditorialTaxonomyMatch = {
  status: "RESOLVED" | "NO_MATCH" | "AMBIGUOUS";
  id: string | null;
  candidateIds: string[];
};

async function findByName(
  table: "subjects" | "topics",
  name: string,
  extra: Record<string, string> = {},
): Promise<EditorialTaxonomyMatch> {
  let query = supabaseAdmin.from(table).select("id").ilike("name", name);
  for (const [column, value] of Object.entries(extra)) {
    query = query.eq(column, value);
  }
  const { data, error } = await query;
  if (error) throw error;

  const ids = (data ?? []).map((row) => row.id);
  if (ids.length === 0) return { status: "NO_MATCH", id: null, candidateIds: [] };
  if (ids.length > 1) return { status: "AMBIGUOUS", id: null, candidateIds: ids };
  return { status: "RESOLVED", id: ids[0], candidateIds: ids };
}

export async function resolveSubjectByName(
  disciplineName: string,
): Promise<EditorialTaxonomyMatch> {
  return findByName("subjects", disciplineName);
}

export async function resolveTopicByName(
  topicName: string,
  subjectId: string,
): Promise<EditorialTaxonomyMatch> {
  return findByName("topics", topicName, { subject_id: subjectId });
}
