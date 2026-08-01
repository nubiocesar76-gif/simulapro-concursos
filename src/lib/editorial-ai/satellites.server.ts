import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  EditorialAiAnnotation,
  EditorialAiAnnotationInsert,
  EditorialAiContent,
  EditorialAiContentInsert,
  EditorialAiDecision,
  EditorialAiDecisionInsert,
  EditorialAiInput,
  EditorialAiInputInsert,
  EditorialAiPublication,
  EditorialAiPublicationInsert,
  EditorialAiRequest,
  EditorialAiRequestInsert,
  EditorialAiResponse,
  EditorialAiResponseInsert,
} from "./types";

/**
 * Todas as entidades deste arquivo são satélites de editorial_ai_cycles
 * (append-only): apenas create + leitura por cycle_id. Sem update, sem
 * delete — reflete exatamente o que a RLS homologada já autoriza.
 */
const INPUTS_TABLE = "editorial_ai_inputs";
const REQUESTS_TABLE = "editorial_ai_requests";
const RESPONSES_TABLE = "editorial_ai_responses";
const CONTENTS_TABLE = "editorial_ai_contents";
const ANNOTATIONS_TABLE = "editorial_ai_annotations";
const DECISIONS_TABLE = "editorial_ai_decisions";
const PUBLICATIONS_TABLE = "editorial_ai_publications";

// ==================================================
// editorial_ai_inputs
// ==================================================

export async function createEditorialAiInput(
  input: EditorialAiInputInsert,
): Promise<EditorialAiInput> {
  const { data, error } = await supabaseAdmin.from(INPUTS_TABLE).insert(input).select("*").single();

  if (error || !data) {
    throw new Error(
      `Falha ao criar insumos do ciclo editorial: ${error?.message ?? "registro não retornado"}`,
    );
  }

  return data as unknown as EditorialAiInput;
}

export async function getEditorialAiInputByCycleId(
  cycleId: string,
): Promise<EditorialAiInput | null> {
  const { data, error } = await supabaseAdmin
    .from(INPUTS_TABLE)
    .select("*")
    .eq("cycle_id", cycleId)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao buscar insumos do ciclo editorial: ${error.message}`);
  }

  return (data as unknown as EditorialAiInput | null) ?? null;
}

// ==================================================
// editorial_ai_requests
// ==================================================

export async function createEditorialAiRequest(
  input: EditorialAiRequestInsert,
): Promise<EditorialAiRequest> {
  const { data, error } = await supabaseAdmin
    .from(REQUESTS_TABLE)
    .insert(input)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Falha ao criar pacote de instrução do ciclo editorial: ${error?.message ?? "registro não retornado"}`,
    );
  }

  return data as unknown as EditorialAiRequest;
}

export async function getEditorialAiRequestByCycleId(
  cycleId: string,
): Promise<EditorialAiRequest | null> {
  const { data, error } = await supabaseAdmin
    .from(REQUESTS_TABLE)
    .select("*")
    .eq("cycle_id", cycleId)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao buscar pacote de instrução do ciclo editorial: ${error.message}`);
  }

  return (data as unknown as EditorialAiRequest | null) ?? null;
}

// ==================================================
// editorial_ai_responses
// ==================================================

export async function createEditorialAiResponse(
  input: EditorialAiResponseInsert,
): Promise<EditorialAiResponse> {
  const { data, error } = await supabaseAdmin
    .from(RESPONSES_TABLE)
    .insert(input)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Falha ao criar resposta bruta do ciclo editorial: ${error?.message ?? "registro não retornado"}`,
    );
  }

  return data as unknown as EditorialAiResponse;
}

export async function getEditorialAiResponseByCycleId(
  cycleId: string,
): Promise<EditorialAiResponse | null> {
  const { data, error } = await supabaseAdmin
    .from(RESPONSES_TABLE)
    .select("*")
    .eq("cycle_id", cycleId)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao buscar resposta bruta do ciclo editorial: ${error.message}`);
  }

  return (data as unknown as EditorialAiResponse | null) ?? null;
}

// ==================================================
// editorial_ai_contents
// ==================================================

export async function createEditorialAiContent(
  input: EditorialAiContentInsert,
): Promise<EditorialAiContent> {
  const { data, error } = await supabaseAdmin
    .from(CONTENTS_TABLE)
    .insert(input)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Falha ao criar versão de conteúdo do ciclo editorial: ${error?.message ?? "registro não retornado"}`,
    );
  }

  return data as unknown as EditorialAiContent;
}

export async function listEditorialAiContentsByCycleId(
  cycleId: string,
): Promise<EditorialAiContent[]> {
  const { data, error } = await supabaseAdmin
    .from(CONTENTS_TABLE)
    .select("*")
    .eq("cycle_id", cycleId)
    .order("version", { ascending: true });

  if (error) {
    throw new Error(`Falha ao listar versões de conteúdo do ciclo editorial: ${error.message}`);
  }

  return (data ?? []) as unknown as EditorialAiContent[];
}

export async function getLatestEditorialAiContentByCycleId(
  cycleId: string,
): Promise<EditorialAiContent | null> {
  const { data, error } = await supabaseAdmin
    .from(CONTENTS_TABLE)
    .select("*")
    .eq("cycle_id", cycleId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao buscar versão mais recente do ciclo editorial: ${error.message}`);
  }

  return (data as unknown as EditorialAiContent | null) ?? null;
}

// ==================================================
// editorial_ai_annotations
// ==================================================

export async function createEditorialAiAnnotation(
  input: EditorialAiAnnotationInsert,
): Promise<EditorialAiAnnotation> {
  const { data, error } = await supabaseAdmin
    .from(ANNOTATIONS_TABLE)
    .insert(input)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Falha ao criar apontamento assistivo do ciclo editorial: ${error?.message ?? "registro não retornado"}`,
    );
  }

  return data as unknown as EditorialAiAnnotation;
}

export async function listEditorialAiAnnotationsByCycleId(
  cycleId: string,
): Promise<EditorialAiAnnotation[]> {
  const { data, error } = await supabaseAdmin
    .from(ANNOTATIONS_TABLE)
    .select("*")
    .eq("cycle_id", cycleId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Falha ao listar apontamentos assistivos do ciclo editorial: ${error.message}`);
  }

  return (data ?? []) as unknown as EditorialAiAnnotation[];
}

// ==================================================
// editorial_ai_decisions
// ==================================================

export async function createEditorialAiDecision(
  input: EditorialAiDecisionInsert,
): Promise<EditorialAiDecision> {
  const { data, error } = await supabaseAdmin
    .from(DECISIONS_TABLE)
    .insert(input)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Falha ao criar decisão do ciclo editorial: ${error?.message ?? "registro não retornado"}`,
    );
  }

  return data as unknown as EditorialAiDecision;
}

export async function listEditorialAiDecisionsByCycleId(
  cycleId: string,
): Promise<EditorialAiDecision[]> {
  const { data, error } = await supabaseAdmin
    .from(DECISIONS_TABLE)
    .select("*")
    .eq("cycle_id", cycleId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Falha ao listar decisões do ciclo editorial: ${error.message}`);
  }

  return (data ?? []) as unknown as EditorialAiDecision[];
}

// ==================================================
// editorial_ai_publications
// ==================================================

export async function createEditorialAiPublication(
  input: EditorialAiPublicationInsert,
): Promise<EditorialAiPublication> {
  const { data, error } = await supabaseAdmin
    .from(PUBLICATIONS_TABLE)
    .insert(input)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Falha ao criar tentativa de publicação do ciclo editorial: ${error?.message ?? "registro não retornado"}`,
    );
  }

  return data as unknown as EditorialAiPublication;
}

export async function listEditorialAiPublicationsByCycleId(
  cycleId: string,
): Promise<EditorialAiPublication[]> {
  const { data, error } = await supabaseAdmin
    .from(PUBLICATIONS_TABLE)
    .select("*")
    .eq("cycle_id", cycleId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(
      `Falha ao listar tentativas de publicação do ciclo editorial: ${error.message}`,
    );
  }

  return (data ?? []) as unknown as EditorialAiPublication[];
}
