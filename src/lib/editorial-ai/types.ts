/**
 * A migration já está aplicada no banco e os tipos oficiais
 * (`Tables<"editorial_ai_...">`) já existem em
 * `src/integrations/supabase/types.ts` — confirmado em 2026-07-24
 * (Motor Editorial V1, Etapa 0). Estes tipos continuam mantidos aqui,
 * de propósito, como o contrato interno estável do módulo
 * `editorial-ai` (mesma convenção de `EditorialAiBatchInsert` etc. usada
 * em toda a camada de repositório/serviço) — trocar por `Tables<"...">`
 * diretamente exigiria revisar todos os consumidores, fora do escopo
 * desta sprint.
 *
 * Espelha exatamente: supabase/migrations/20260717020000_editorial_ai_engine_core.sql
 */

import type { Json } from "@/integrations/supabase/types";

export type EditorialAiCycleStatus =
  "RASCUNHO_IA" | "EM_REVISAO" | "APROVADO_EDITORIAL" | "REPROVADO";

export type EditorialAiAnnotationCriterion =
  | "FIDELIDADE_AO_CONCEITO"
  | "CLAREZA_ENUNCIADO"
  | "COERENCIA_CONTEXTO"
  | "PLAUSIBILIDADE_DISTRATORES"
  | "DEFENSIBILIDADE_GABARITO"
  | "CONSISTENCIA_JUSTIFICATIVA"
  | "VERIFICABILIDADE_REFERENCIA"
  | "ADERENCIA_ESTILO_BANCA"
  | "AUSENCIA_INDICIO_COPIA"
  | "COERENCIA_METADADOS";

export type EditorialAiDecisionType =
  "AUDITORIA_INDEPENDENTE" | "HOMOLOGACAO" | "REPROVACAO" | "DECISAO_PUBLICACAO";

export type EditorialAiPublicationOutcome = "CONVERGED" | "BLOCKED_INCOMPLETE_CONTRACT";

// ==================================================
// editorial_ai_batches
// ==================================================

export type EditorialAiBatch = {
  id: string;
  architecture_id: string | null;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type EditorialAiBatchInsert = {
  id?: string;
  architecture_id?: string | null;
  name: string;
  description?: string | null;
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

export type EditorialAiBatchUpdate = {
  name?: string;
  description?: string | null;
};

// ==================================================
// editorial_ai_cycles
// ==================================================

export type EditorialAiCycle = {
  id: string;
  architecture_id: string | null;
  batch_id: string | null;
  status: EditorialAiCycleStatus;
  created_at: string;
  updated_at: string;
};

export type EditorialAiCycleInsert = {
  id?: string;
  architecture_id?: string | null;
  batch_id?: string | null;
  status?: EditorialAiCycleStatus;
  created_at?: string;
  updated_at?: string;
};

// ==================================================
// editorial_ai_inputs
// ==================================================

export type EditorialAiInput = {
  id: string;
  cycle_id: string;
  concept_subtopic_id: string | null;
  concept_topic_id: string | null;
  board_id: string | null;
  course_id: string | null;
  position_id: string | null;
  remaining_inputs: Json;
  created_at: string;
};

export type EditorialAiInputInsert = {
  id?: string;
  cycle_id: string;
  concept_subtopic_id?: string | null;
  concept_topic_id?: string | null;
  board_id?: string | null;
  course_id?: string | null;
  position_id?: string | null;
  remaining_inputs: Json;
  created_at?: string;
};

// ==================================================
// editorial_ai_requests
// ==================================================

export type EditorialAiRequest = {
  id: string;
  cycle_id: string;
  composed_instruction: string;
  created_at: string;
};

export type EditorialAiRequestInsert = {
  id?: string;
  cycle_id: string;
  composed_instruction: string;
  created_at?: string;
};

// ==================================================
// editorial_ai_responses
// ==================================================

export type EditorialAiResponse = {
  id: string;
  cycle_id: string;
  raw_response: string;
  created_at: string;
};

export type EditorialAiResponseInsert = {
  id?: string;
  cycle_id: string;
  raw_response: string;
  created_at?: string;
};

// ==================================================
// editorial_ai_contents
// ==================================================

export type EditorialAiContent = {
  id: string;
  cycle_id: string;
  version: number;
  statement: string | null;
  alternatives: Json;
  correct_answer: string | null;
  explanation: string | null;
  context: string | null;
  concept_reference: string | null;
  cognitive_objective: string | null;
  bibliographic_reference: string | null;
  editorial_metadata: Json | null;
  created_at: string;
};

export type EditorialAiContentInsert = {
  id?: string;
  cycle_id: string;
  version: number;
  statement?: string | null;
  alternatives?: Json;
  correct_answer?: string | null;
  explanation?: string | null;
  context?: string | null;
  concept_reference?: string | null;
  cognitive_objective?: string | null;
  bibliographic_reference?: string | null;
  editorial_metadata?: Json | null;
  created_at?: string;
};

// ==================================================
// editorial_ai_annotations
// ==================================================

export type EditorialAiAnnotation = {
  id: string;
  cycle_id: string;
  criterion: EditorialAiAnnotationCriterion;
  description: string;
  source_ref: string | null;
  created_at: string;
};

export type EditorialAiAnnotationInsert = {
  id?: string;
  cycle_id: string;
  criterion: EditorialAiAnnotationCriterion;
  description: string;
  source_ref?: string | null;
  created_at?: string;
};

// ==================================================
// editorial_ai_decisions
// ==================================================

export type EditorialAiDecision = {
  id: string;
  cycle_id: string;
  actor_user_id: string;
  decision_type: EditorialAiDecisionType;
  previous_status: EditorialAiCycleStatus;
  new_status: EditorialAiCycleStatus;
  justification: string | null;
  created_at: string;
};

export type EditorialAiDecisionInsert = {
  id?: string;
  cycle_id: string;
  actor_user_id: string;
  decision_type: EditorialAiDecisionType;
  previous_status: EditorialAiCycleStatus;
  new_status: EditorialAiCycleStatus;
  justification?: string | null;
  created_at?: string;
};

// ==================================================
// editorial_ai_publications
// ==================================================

export type EditorialAiPublication = {
  id: string;
  cycle_id: string;
  decision_id: string | null;
  question_id: string | null;
  outcome: EditorialAiPublicationOutcome;
  created_at: string;
};

export type EditorialAiPublicationInsert = {
  id?: string;
  cycle_id: string;
  decision_id?: string | null;
  question_id?: string | null;
  outcome: EditorialAiPublicationOutcome;
  created_at?: string;
};
