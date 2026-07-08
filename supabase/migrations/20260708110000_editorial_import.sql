-- Sprint 11.1: Editorial Engine importer — subtopics, import logs, changelog.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'editorial_entity_type' AND e.enumlabel = 'SUBTOPIC'
  ) THEN
    ALTER TYPE public.editorial_entity_type ADD VALUE 'SUBTOPIC';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.editorial_subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID NOT NULL REFERENCES public.editorial_architectures(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.editorial_topics(id) ON DELETE CASCADE,
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
  CONSTRAINT editorial_subtopics_slug_not_empty CHECK (char_length(trim(slug)) > 0),
  CONSTRAINT editorial_subtopics_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT editorial_subtopics_confidence_range CHECK (
    confidence >= 0 AND confidence <= 100
  ),
  CONSTRAINT editorial_subtopics_evidence_count_non_negative CHECK (evidence_count >= 0)
);

ALTER TABLE public.editorial_keywords
  ADD COLUMN IF NOT EXISTS subtopic_id UUID REFERENCES public.editorial_subtopics(id) ON DELETE SET NULL;

ALTER TABLE public.editorial_rules
  ADD COLUMN IF NOT EXISTS subtopic_id UUID REFERENCES public.editorial_subtopics(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS editorial_disciplines_arch_code_unique
  ON public.editorial_disciplines (architecture_id, code)
  WHERE code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS editorial_topics_arch_code_unique
  ON public.editorial_topics (architecture_id, code)
  WHERE code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS editorial_subtopics_arch_code_unique
  ON public.editorial_subtopics (architecture_id, code)
  WHERE code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS editorial_subtopics_arch_slug_unique_ci
  ON public.editorial_subtopics (architecture_id, lower(trim(slug)));

CREATE UNIQUE INDEX IF NOT EXISTS editorial_keywords_arch_code_unique
  ON public.editorial_keywords (architecture_id, code)
  WHERE code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS editorial_rules_arch_code_unique
  ON public.editorial_rules (architecture_id, code)
  WHERE code IS NOT NULL;

CREATE INDEX IF NOT EXISTS editorial_subtopics_architecture_id_idx
  ON public.editorial_subtopics (architecture_id);

CREATE INDEX IF NOT EXISTS editorial_subtopics_topic_id_idx
  ON public.editorial_subtopics (topic_id);

CREATE INDEX IF NOT EXISTS editorial_keywords_subtopic_id_idx
  ON public.editorial_keywords (subtopic_id);

CREATE INDEX IF NOT EXISTS editorial_rules_subtopic_id_idx
  ON public.editorial_rules (subtopic_id);

CREATE TABLE IF NOT EXISTS public.editorial_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID REFERENCES public.editorial_architectures(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  package_path TEXT NOT NULL,
  engine_version TEXT NOT NULL,
  architecture_version TEXT NOT NULL,
  imported_files JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_ms INT NOT NULL DEFAULT 0,
  record_counts JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'SUCCESS',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_import_logs_status_check CHECK (status IN ('SUCCESS', 'FAILED'))
);

CREATE TABLE IF NOT EXISTS public.editorial_changelog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architecture_id UUID NOT NULL REFERENCES public.editorial_architectures(id) ON DELETE CASCADE,
  import_log_id UUID REFERENCES public.editorial_import_logs(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_code TEXT,
  entity_id UUID,
  change_type TEXT NOT NULL,
  previous_snapshot JSONB,
  new_snapshot JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editorial_changelog_change_type_check CHECK (
    change_type IN ('CREATED', 'UPDATED', 'DEPRECATED')
  )
);

CREATE INDEX IF NOT EXISTS editorial_import_logs_architecture_id_idx
  ON public.editorial_import_logs (architecture_id);

CREATE INDEX IF NOT EXISTS editorial_import_logs_user_id_idx
  ON public.editorial_import_logs (user_id);

CREATE INDEX IF NOT EXISTS editorial_changelog_architecture_id_idx
  ON public.editorial_changelog (architecture_id);

CREATE INDEX IF NOT EXISTS editorial_changelog_import_log_id_idx
  ON public.editorial_changelog (import_log_id);

ALTER TABLE public.editorial_subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_changelog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manage_editorial_subtopics"
  ON public.editorial_subtopics FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_manage_editorial_import_logs"
  ON public.editorial_import_logs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_manage_editorial_changelog"
  ON public.editorial_changelog FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_subtopics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_import_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_changelog TO authenticated;

GRANT ALL ON public.editorial_subtopics TO service_role;
GRANT ALL ON public.editorial_import_logs TO service_role;
GRANT ALL ON public.editorial_changelog TO service_role;

DROP TRIGGER IF EXISTS trg_editorial_subtopics_updated ON public.editorial_subtopics;
CREATE TRIGGER trg_editorial_subtopics_updated
  BEFORE UPDATE ON public.editorial_subtopics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

NOTIFY pgrst, 'reload schema';
