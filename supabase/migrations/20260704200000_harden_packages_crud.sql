-- Sprint 5B Etapa 1: campos e constraints do CRUD de Pacotes.
-- Não altera migrations antigas. Não remove RLS existente.

-- Status do pacote (padrão ACTIVE)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'package_status') THEN
    CREATE TYPE public.package_status AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');
  END IF;
END $$;

ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS status public.package_status NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Slug retroativo para registros existentes
UPDATE public.packages
SET slug = lower(
  regexp_replace(
    regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-+|-+$)', '', 'g'
  )
)
WHERE slug IS NULL OR trim(slug) = '';

-- course_id obrigatório
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.packages WHERE course_id IS NULL) THEN
    RAISE EXCEPTION
      'Existem pacotes sem course_id. Atribua um curso a cada pacote antes de aplicar esta migration.';
  END IF;
END $$;

ALTER TABLE public.packages ALTER COLUMN course_id SET NOT NULL;

-- slug obrigatório após backfill
ALTER TABLE public.packages ALTER COLUMN slug SET NOT NULL;

-- Unicidade case-insensitive: nome e slug por curso
DO $$
BEGIN
  IF EXISTS (
    SELECT course_id, lower(trim(name))
    FROM public.packages
    GROUP BY course_id, lower(trim(name))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Duplicatas em packages.name por course_id (case-insensitive). Resolva manualmente.';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT course_id, lower(trim(slug))
    FROM public.packages
    GROUP BY course_id, lower(trim(slug))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Duplicatas em packages.slug por course_id (case-insensitive). Resolva manualmente.';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS packages_name_unique_ci
  ON public.packages (course_id, lower(trim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS packages_slug_unique_ci
  ON public.packages (course_id, lower(trim(slug)));
