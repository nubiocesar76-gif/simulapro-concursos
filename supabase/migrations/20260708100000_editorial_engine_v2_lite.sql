-- Sprint 11.0: Editorial Engine V2 Lite (núcleo mínimo).
-- Escopo inicial: Enfermagem / Enfermeiro.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editorial_architecture_status') THEN
    CREATE TYPE public.editorial_architecture_status AS ENUM (
      'PROPOSTO',
      'EM_REVISAO',
      'APROVADO',
      'PUBLICADO',
      'DEPRECIADO'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editorial_record_status') THEN
    CREATE TYPE public.editorial_record_status AS ENUM (
      'PROPOSTO',
      'EM_REVISAO',
      'APROVADO',
      'PUBLICADO',
      'DEPRECIADO',
      'MESCLADO'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editorial_priority') THEN
    CREATE TYPE public.editorial_priority AS ENUM ('ALTA', 'MEDIA', 'BAIXA');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editorial_keyword_type') THEN
    CREATE TYPE public.editorial_keyword_type AS ENUM ('PRINCIPAL', 'SECUNDARIA', 'FRACA');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editorial_entity_type') THEN
    CREATE TYPE public.editorial_entity_type AS ENUM (
      'DISCIPLINE',
      'TOPIC',
      'KEYWORD',
      'RULE'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editorial_evidence_type') THEN
    CREATE TYPE public.editorial_evidence_type AS ENUM (
      'CONFIRMACAO',
      'CONTRADICAO',
      'REVISAO_HUMANA',
      'SUGESTAO_IA'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.editorial_architectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  position_id UUID NOT NULL REFERENCES public.positions(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  engine_version TEXT NOT NULL DEFAULT '2.0.0-lite',
  status public.editorial_architecture_status NOT NULL DEFAULT 'PROPOSTO',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_architectures_slug_not_empty CHECK (char_length(trim(slug)) > 0),
  CONSTRAINT editorial_architectures_name_not_empty CHECK (char_length(trim(name)) > 0)
);

CREATE TABLE IF NOT EXISTS public.editorial_disciplines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID NOT NULL REFERENCES public.editorial_architectures(id) ON DELETE CASCADE,
  code TEXT,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  frequency_percent INT,
  priority public.editorial_priority,
  status public.editorial_record_status NOT NULL DEFAULT 'PUBLICADO',
  confidence NUMERIC(5, 2) NOT NULL DEFAULT 0,
  evidence_count INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_disciplines_slug_not_empty CHECK (char_length(trim(slug)) > 0),
  CONSTRAINT editorial_disciplines_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT editorial_disciplines_frequency_range CHECK (
    frequency_percent IS NULL OR (frequency_percent >= 0 AND frequency_percent <= 100)
  ),
  CONSTRAINT editorial_disciplines_confidence_range CHECK (
    confidence >= 0 AND confidence <= 100
  ),
  CONSTRAINT editorial_disciplines_evidence_count_non_negative CHECK (evidence_count >= 0)
);

CREATE TABLE IF NOT EXISTS public.editorial_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID NOT NULL REFERENCES public.editorial_architectures(id) ON DELETE CASCADE,
  discipline_id UUID NOT NULL REFERENCES public.editorial_disciplines(id) ON DELETE CASCADE,
  code TEXT,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status public.editorial_record_status NOT NULL DEFAULT 'PUBLICADO',
  confidence NUMERIC(5, 2) NOT NULL DEFAULT 0,
  evidence_count INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_topics_slug_not_empty CHECK (char_length(trim(slug)) > 0),
  CONSTRAINT editorial_topics_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT editorial_topics_confidence_range CHECK (
    confidence >= 0 AND confidence <= 100
  ),
  CONSTRAINT editorial_topics_evidence_count_non_negative CHECK (evidence_count >= 0)
);

CREATE TABLE IF NOT EXISTS public.editorial_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID NOT NULL REFERENCES public.editorial_architectures(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.editorial_topics(id) ON DELETE CASCADE,
  code TEXT,
  term TEXT NOT NULL,
  weight INT NOT NULL DEFAULT 5,
  keyword_type public.editorial_keyword_type NOT NULL DEFAULT 'SECUNDARIA',
  status public.editorial_record_status NOT NULL DEFAULT 'PUBLICADO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_keywords_term_not_empty CHECK (char_length(trim(term)) > 0),
  CONSTRAINT editorial_keywords_weight_range CHECK (weight >= 0 AND weight <= 10)
);

CREATE TABLE IF NOT EXISTS public.editorial_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID NOT NULL REFERENCES public.editorial_architectures(id) ON DELETE CASCADE,
  code TEXT,
  discipline_id UUID REFERENCES public.editorial_disciplines(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES public.editorial_topics(id) ON DELETE SET NULL,
  trigger_terms TEXT[] NOT NULL DEFAULT '{}',
  confidence_percent INT NOT NULL DEFAULT 0,
  status public.editorial_record_status NOT NULL DEFAULT 'PUBLICADO',
  engine_version TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_rules_confidence_range CHECK (
    confidence_percent >= 0 AND confidence_percent <= 100
  )
);

CREATE TABLE IF NOT EXISTS public.editorial_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID NOT NULL REFERENCES public.editorial_architectures(id) ON DELETE CASCADE,
  entity_type public.editorial_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  evidence_type public.editorial_evidence_type NOT NULL,
  source_ref TEXT,
  description TEXT,
  weight INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_evidence_weight_positive CHECK (weight > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS editorial_architectures_scope_slug_unique_ci
  ON public.editorial_architectures (course_id, position_id, lower(trim(slug)));

CREATE UNIQUE INDEX IF NOT EXISTS editorial_architectures_one_active_per_scope
  ON public.editorial_architectures (course_id, position_id)
  WHERE is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS editorial_disciplines_arch_slug_unique_ci
  ON public.editorial_disciplines (architecture_id, lower(trim(slug)));

CREATE UNIQUE INDEX IF NOT EXISTS editorial_topics_arch_slug_unique_ci
  ON public.editorial_topics (architecture_id, lower(trim(slug)));

CREATE INDEX IF NOT EXISTS editorial_architectures_course_id_idx
  ON public.editorial_architectures (course_id);

CREATE INDEX IF NOT EXISTS editorial_architectures_position_id_idx
  ON public.editorial_architectures (position_id);

CREATE INDEX IF NOT EXISTS editorial_disciplines_architecture_id_idx
  ON public.editorial_disciplines (architecture_id);

CREATE INDEX IF NOT EXISTS editorial_topics_architecture_id_idx
  ON public.editorial_topics (architecture_id);

CREATE INDEX IF NOT EXISTS editorial_topics_discipline_id_idx
  ON public.editorial_topics (discipline_id);

CREATE INDEX IF NOT EXISTS editorial_keywords_architecture_id_idx
  ON public.editorial_keywords (architecture_id);

CREATE INDEX IF NOT EXISTS editorial_keywords_topic_id_idx
  ON public.editorial_keywords (topic_id);

CREATE INDEX IF NOT EXISTS editorial_rules_architecture_id_idx
  ON public.editorial_rules (architecture_id);

CREATE INDEX IF NOT EXISTS editorial_rules_discipline_id_idx
  ON public.editorial_rules (discipline_id);

CREATE INDEX IF NOT EXISTS editorial_rules_topic_id_idx
  ON public.editorial_rules (topic_id);

CREATE INDEX IF NOT EXISTS editorial_evidence_architecture_id_idx
  ON public.editorial_evidence (architecture_id);

CREATE INDEX IF NOT EXISTS editorial_evidence_entity_idx
  ON public.editorial_evidence (entity_type, entity_id);

ALTER TABLE public.editorial_architectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manage_editorial_architectures"
  ON public.editorial_architectures FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_manage_editorial_disciplines"
  ON public.editorial_disciplines FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_manage_editorial_topics"
  ON public.editorial_topics FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_manage_editorial_keywords"
  ON public.editorial_keywords FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_manage_editorial_rules"
  ON public.editorial_rules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_manage_editorial_evidence"
  ON public.editorial_evidence FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_architectures TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_disciplines TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_topics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_keywords TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_rules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_evidence TO authenticated;

GRANT ALL ON public.editorial_architectures TO service_role;
GRANT ALL ON public.editorial_disciplines TO service_role;
GRANT ALL ON public.editorial_topics TO service_role;
GRANT ALL ON public.editorial_keywords TO service_role;
GRANT ALL ON public.editorial_rules TO service_role;
GRANT ALL ON public.editorial_evidence TO service_role;

DROP TRIGGER IF EXISTS trg_editorial_architectures_updated ON public.editorial_architectures;
CREATE TRIGGER trg_editorial_architectures_updated
  BEFORE UPDATE ON public.editorial_architectures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_editorial_disciplines_updated ON public.editorial_disciplines;
CREATE TRIGGER trg_editorial_disciplines_updated
  BEFORE UPDATE ON public.editorial_disciplines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_editorial_topics_updated ON public.editorial_topics;
CREATE TRIGGER trg_editorial_topics_updated
  BEFORE UPDATE ON public.editorial_topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_editorial_keywords_updated ON public.editorial_keywords;
CREATE TRIGGER trg_editorial_keywords_updated
  BEFORE UPDATE ON public.editorial_keywords
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_editorial_rules_updated ON public.editorial_rules;
CREATE TRIGGER trg_editorial_rules_updated
  BEFORE UPDATE ON public.editorial_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

NOTIFY pgrst, 'reload schema';
