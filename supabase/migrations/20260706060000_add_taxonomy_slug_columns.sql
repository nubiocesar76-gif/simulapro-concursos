-- RC1.1: colunas slug nas tabelas de taxonomia usadas pelo Admin CRUD.
-- Espelha o padrão de packages (harden_packages_crud).
-- Não altera migrations antigas.

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS slug TEXT;

ALTER TABLE public.subjects
  ADD COLUMN IF NOT EXISTS slug TEXT;

ALTER TABLE public.positions
  ADD COLUMN IF NOT EXISTS slug TEXT;

ALTER TABLE public.topics
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Backfill retroativo a partir do nome
UPDATE public.courses
SET slug = lower(
  regexp_replace(
    regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-+|-+$)', '', 'g'
  )
)
WHERE slug IS NULL OR trim(slug) = '';

UPDATE public.subjects
SET slug = lower(
  regexp_replace(
    regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-+|-+$)', '', 'g'
  )
)
WHERE slug IS NULL OR trim(slug) = '';

UPDATE public.positions
SET slug = lower(
  regexp_replace(
    regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-+|-+$)', '', 'g'
  )
)
WHERE slug IS NULL OR trim(slug) = '';

UPDATE public.topics
SET slug = lower(
  regexp_replace(
    regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-+|-+$)', '', 'g'
  )
)
WHERE slug IS NULL OR trim(slug) = '';

-- slug obrigatório após backfill
ALTER TABLE public.courses ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.subjects ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.positions ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.topics ALTER COLUMN slug SET NOT NULL;

-- Unicidade case-insensitive (espelha índices de nome)
DO $$
BEGIN
  IF EXISTS (
    SELECT lower(trim(slug)) FROM public.courses
    GROUP BY lower(trim(slug)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicatas em courses.slug (case-insensitive). Resolva manualmente.';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT lower(trim(slug)) FROM public.subjects
    GROUP BY lower(trim(slug)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicatas em subjects.slug (case-insensitive). Resolva manualmente.';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT course_id, lower(trim(slug)) FROM public.positions
    GROUP BY course_id, lower(trim(slug)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicatas em positions.slug por course_id (case-insensitive). Resolva manualmente.';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT subject_id, lower(trim(slug)) FROM public.topics
    GROUP BY subject_id, lower(trim(slug)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicatas em topics.slug por subject_id (case-insensitive). Resolva manualmente.';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS courses_slug_unique_ci
  ON public.courses (lower(trim(slug)));

CREATE UNIQUE INDEX IF NOT EXISTS subjects_slug_unique_ci
  ON public.subjects (lower(trim(slug)));

CREATE UNIQUE INDEX IF NOT EXISTS positions_slug_unique_ci
  ON public.positions (course_id, lower(trim(slug)));

CREATE UNIQUE INDEX IF NOT EXISTS topics_slug_unique_ci
  ON public.topics (subject_id, lower(trim(slug)));

NOTIFY pgrst, 'reload schema';
