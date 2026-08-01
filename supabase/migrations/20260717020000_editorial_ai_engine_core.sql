-- Sprint IT-005: Engine Editorial IA — núcleo (enum, 9 tabelas, RLS, grants).
-- Aditiva: não altera tabelas existentes.

-- ==================================================
-- 1. ENUMS
-- ==================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editorial_ai_cycle_status') THEN
    CREATE TYPE public.editorial_ai_cycle_status AS ENUM (
      'RASCUNHO_IA',
      'EM_REVISAO',
      'APROVADO_EDITORIAL',
      'REPROVADO'
    );
  END IF;
END $$;

-- ==================================================
-- 2. TABLES AND TABLE CONSTRAINTS
-- ==================================================

CREATE TABLE public.editorial_ai_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID REFERENCES public.editorial_architectures(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_ai_batches_name_not_empty CHECK (char_length(trim(name)) > 0)
);

CREATE TABLE public.editorial_ai_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID REFERENCES public.editorial_architectures(id) ON DELETE SET NULL,
  batch_id UUID REFERENCES public.editorial_ai_batches(id) ON DELETE SET NULL,
  status public.editorial_ai_cycle_status NOT NULL DEFAULT 'RASCUNHO_IA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.editorial_ai_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL UNIQUE REFERENCES public.editorial_ai_cycles(id) ON DELETE RESTRICT,
  concept_subtopic_id UUID REFERENCES public.editorial_subtopics(id) ON DELETE SET NULL,
  concept_topic_id UUID REFERENCES public.editorial_topics(id) ON DELETE SET NULL,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  position_id UUID REFERENCES public.positions(id) ON DELETE SET NULL,
  remaining_inputs JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_ai_inputs_concept_xor CHECK (
    (concept_subtopic_id IS NOT NULL AND concept_topic_id IS NULL)
    OR (concept_subtopic_id IS NULL AND concept_topic_id IS NOT NULL)
  )
);

CREATE TABLE public.editorial_ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL UNIQUE REFERENCES public.editorial_ai_cycles(id) ON DELETE RESTRICT,
  composed_instruction TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_ai_requests_composed_instruction_not_empty CHECK (
    char_length(trim(composed_instruction)) > 0
  )
);

CREATE TABLE public.editorial_ai_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL UNIQUE REFERENCES public.editorial_ai_cycles(id) ON DELETE RESTRICT,
  raw_response TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_ai_responses_raw_response_not_empty CHECK (
    char_length(trim(raw_response)) > 0
  )
);

CREATE TABLE public.editorial_ai_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.editorial_ai_cycles(id) ON DELETE RESTRICT,
  version INTEGER NOT NULL,
  statement TEXT,
  alternatives JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT,
  explanation TEXT,
  context TEXT,
  concept_reference TEXT,
  cognitive_objective TEXT,
  bibliographic_reference TEXT,
  editorial_metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_ai_contents_cycle_version_unique UNIQUE (cycle_id, version),
  CONSTRAINT editorial_ai_contents_version_positive CHECK (version > 0)
);

CREATE TABLE public.editorial_ai_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.editorial_ai_cycles(id) ON DELETE RESTRICT,
  criterion TEXT NOT NULL,
  description TEXT NOT NULL,
  source_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_ai_annotations_criterion_valid CHECK (
    criterion IN (
      'FIDELIDADE_AO_CONCEITO',
      'CLAREZA_ENUNCIADO',
      'COERENCIA_CONTEXTO',
      'PLAUSIBILIDADE_DISTRATORES',
      'DEFENSIBILIDADE_GABARITO',
      'CONSISTENCIA_JUSTIFICATIVA',
      'VERIFICABILIDADE_REFERENCIA',
      'ADERENCIA_ESTILO_BANCA',
      'AUSENCIA_INDICIO_COPIA',
      'COERENCIA_METADADOS'
    )
  ),
  CONSTRAINT editorial_ai_annotations_description_not_empty CHECK (
    char_length(trim(description)) > 0
  )
);

CREATE TABLE public.editorial_ai_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.editorial_ai_cycles(id) ON DELETE RESTRICT,
  actor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  decision_type TEXT NOT NULL,
  previous_status public.editorial_ai_cycle_status NOT NULL,
  new_status public.editorial_ai_cycle_status NOT NULL,
  justification TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_ai_decisions_type_valid CHECK (
    decision_type IN (
      'AUDITORIA_INDEPENDENTE',
      'HOMOLOGACAO',
      'REPROVACAO',
      'DECISAO_PUBLICACAO'
    )
  ),
  CONSTRAINT editorial_ai_decisions_reprovacao_justification CHECK (
    decision_type <> 'REPROVACAO'
    OR (justification IS NOT NULL AND char_length(trim(justification)) > 0)
  )
);

CREATE TABLE public.editorial_ai_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.editorial_ai_cycles(id) ON DELETE RESTRICT,
  decision_id UUID REFERENCES public.editorial_ai_decisions(id) ON DELETE SET NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  outcome TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_ai_publications_outcome_valid CHECK (
    outcome IN ('CONVERGED', 'BLOCKED_INCOMPLETE_CONTRACT')
  )
);

-- ==================================================
-- 3. INDEXES
-- ==================================================

CREATE INDEX IF NOT EXISTS editorial_ai_cycles_architecture_id_idx
  ON public.editorial_ai_cycles (architecture_id);

CREATE INDEX IF NOT EXISTS editorial_ai_cycles_batch_id_idx
  ON public.editorial_ai_cycles (batch_id);

CREATE INDEX IF NOT EXISTS editorial_ai_cycles_status_idx
  ON public.editorial_ai_cycles (status);

CREATE INDEX IF NOT EXISTS editorial_ai_annotations_cycle_id_idx
  ON public.editorial_ai_annotations (cycle_id);

CREATE INDEX IF NOT EXISTS editorial_ai_decisions_cycle_id_idx
  ON public.editorial_ai_decisions (cycle_id);

CREATE INDEX IF NOT EXISTS editorial_ai_publications_cycle_id_idx
  ON public.editorial_ai_publications (cycle_id);

CREATE INDEX IF NOT EXISTS editorial_ai_publications_question_id_idx
  ON public.editorial_ai_publications (question_id);

-- ==================================================
-- 4. TRIGGERS
-- ==================================================

CREATE TRIGGER trg_editorial_ai_batches_updated
  BEFORE UPDATE ON public.editorial_ai_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_editorial_ai_cycles_updated
  BEFORE UPDATE ON public.editorial_ai_cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================================================
-- 5. ROW LEVEL SECURITY
-- ==================================================

ALTER TABLE public.editorial_ai_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_ai_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_ai_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_ai_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_ai_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_ai_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_ai_publications ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- 6. POLICIES
-- ==================================================

-- editorial_ai_batches
CREATE POLICY admin_select_editorial_ai_batches
  ON public.editorial_ai_batches FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY admin_insert_editorial_ai_batches
  ON public.editorial_ai_batches FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY admin_update_editorial_ai_batches
  ON public.editorial_ai_batches FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- editorial_ai_cycles
CREATE POLICY admin_select_editorial_ai_cycles
  ON public.editorial_ai_cycles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY admin_insert_editorial_ai_cycles
  ON public.editorial_ai_cycles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY admin_update_editorial_ai_cycles
  ON public.editorial_ai_cycles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- editorial_ai_inputs
CREATE POLICY admin_select_editorial_ai_inputs
  ON public.editorial_ai_inputs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY admin_insert_editorial_ai_inputs
  ON public.editorial_ai_inputs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- editorial_ai_requests
CREATE POLICY admin_select_editorial_ai_requests
  ON public.editorial_ai_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- editorial_ai_responses
CREATE POLICY admin_select_editorial_ai_responses
  ON public.editorial_ai_responses FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- editorial_ai_contents
CREATE POLICY admin_select_editorial_ai_contents
  ON public.editorial_ai_contents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY admin_insert_editorial_ai_contents
  ON public.editorial_ai_contents FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- editorial_ai_annotations
CREATE POLICY admin_select_editorial_ai_annotations
  ON public.editorial_ai_annotations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- editorial_ai_decisions
CREATE POLICY admin_select_editorial_ai_decisions
  ON public.editorial_ai_decisions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY admin_insert_editorial_ai_decisions
  ON public.editorial_ai_decisions FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    AND actor_user_id = auth.uid()
  );

-- editorial_ai_publications
CREATE POLICY admin_select_editorial_ai_publications
  ON public.editorial_ai_publications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ==================================================
-- 7. GRANTS
-- ==================================================

GRANT SELECT, INSERT, UPDATE ON public.editorial_ai_batches TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.editorial_ai_cycles TO authenticated;
GRANT SELECT, INSERT ON public.editorial_ai_inputs TO authenticated;
GRANT SELECT ON public.editorial_ai_requests TO authenticated;
GRANT SELECT ON public.editorial_ai_responses TO authenticated;
GRANT SELECT, INSERT ON public.editorial_ai_contents TO authenticated;
GRANT SELECT ON public.editorial_ai_annotations TO authenticated;
GRANT SELECT, INSERT ON public.editorial_ai_decisions TO authenticated;
GRANT SELECT ON public.editorial_ai_publications TO authenticated;

GRANT ALL ON public.editorial_ai_batches TO service_role;
GRANT ALL ON public.editorial_ai_cycles TO service_role;
GRANT ALL ON public.editorial_ai_inputs TO service_role;
GRANT ALL ON public.editorial_ai_requests TO service_role;
GRANT ALL ON public.editorial_ai_responses TO service_role;
GRANT ALL ON public.editorial_ai_contents TO service_role;
GRANT ALL ON public.editorial_ai_annotations TO service_role;
GRANT ALL ON public.editorial_ai_decisions TO service_role;
GRANT ALL ON public.editorial_ai_publications TO service_role;

-- ==================================================
-- 8. POSTGREST SCHEMA RELOAD
-- ==================================================

NOTIFY pgrst, 'reload schema';
