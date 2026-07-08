-- Sprint 10.2: catálogo oficial do Acervo (exam_catalog + exam_files).
-- Não altera migrations antigas.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_catalog_status') THEN
    CREATE TYPE public.exam_catalog_status AS ENUM (
      'PLANNED',
      'DOWNLOADED',
      'PROCESSING',
      'REVIEW',
      'APPROVED',
      'IMPORTED',
      'PUBLISHED'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_file_type') THEN
    CREATE TYPE public.exam_file_type AS ENUM (
      'PROVA',
      'GABARITO',
      'EDITAL',
      'RAW',
      'QUESTIONS_RAW',
      'QUESTIONS',
      'METADATA',
      'STATUS',
      'REVIEW'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.exam_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  organization TEXT NOT NULL,
  contest TEXT NOT NULL,
  year INT,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE RESTRICT,
  position_id UUID NOT NULL REFERENCES public.positions(id) ON DELETE RESTRICT,
  status public.exam_catalog_status NOT NULL DEFAULT 'PLANNED',
  verified BOOLEAN NOT NULL DEFAULT false,
  pdf_available BOOLEAN NOT NULL DEFAULT false,
  answer_key_available BOOLEAN NOT NULL DEFAULT false,
  imported_questions INT NOT NULL DEFAULT 0,
  approved_questions INT NOT NULL DEFAULT 0,
  published_questions INT NOT NULL DEFAULT 0,
  storage_folder TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT exam_catalog_slug_not_empty CHECK (char_length(trim(slug)) > 0),
  CONSTRAINT exam_catalog_storage_folder_not_empty CHECK (char_length(trim(storage_folder)) > 0),
  CONSTRAINT exam_catalog_questions_non_negative CHECK (
    imported_questions >= 0
    AND approved_questions >= 0
    AND published_questions >= 0
  )
);

CREATE TABLE IF NOT EXISTS public.exam_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_catalog_id UUID NOT NULL REFERENCES public.exam_catalog(id) ON DELETE CASCADE,
  type public.exam_file_type NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  size BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT exam_files_filename_not_empty CHECK (char_length(trim(filename)) > 0),
  CONSTRAINT exam_files_storage_path_not_empty CHECK (char_length(trim(storage_path)) > 0),
  CONSTRAINT exam_files_size_non_negative CHECK (size IS NULL OR size >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS exam_catalog_slug_unique_ci
  ON public.exam_catalog (lower(trim(slug)));

CREATE INDEX IF NOT EXISTS exam_catalog_status_idx
  ON public.exam_catalog (status);

CREATE INDEX IF NOT EXISTS exam_catalog_board_id_idx
  ON public.exam_catalog (board_id);

CREATE INDEX IF NOT EXISTS exam_catalog_position_id_idx
  ON public.exam_catalog (position_id);

CREATE INDEX IF NOT EXISTS exam_catalog_year_idx
  ON public.exam_catalog (year);

CREATE INDEX IF NOT EXISTS exam_files_exam_catalog_id_idx
  ON public.exam_files (exam_catalog_id);

CREATE UNIQUE INDEX IF NOT EXISTS exam_files_catalog_type_unique
  ON public.exam_files (exam_catalog_id, type);

ALTER TABLE public.exam_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manage_exam_catalog"
  ON public.exam_catalog FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_manage_exam_files"
  ON public.exam_files FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_catalog TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_files TO authenticated;
GRANT ALL ON public.exam_catalog TO service_role;
GRANT ALL ON public.exam_files TO service_role;

DROP TRIGGER IF EXISTS trg_exam_catalog_updated ON public.exam_catalog;
CREATE TRIGGER trg_exam_catalog_updated
  BEFORE UPDATE ON public.exam_catalog
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

NOTIFY pgrst, 'reload schema';
