-- Sprint 5B Etapa 2: campos e constraints do CRUD de Versões.
-- Mantém colunas legadas (version, notes, published) para compatibilidade com Importação e Portal Aluno.
-- Não altera migrations antigas. Não remove RLS existente.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'package_version_status') THEN
    CREATE TYPE public.package_version_status AS ENUM ('DRAFT', 'READY', 'PUBLISHED', 'ARCHIVED');
  END IF;
END $$;

ALTER TABLE public.package_versions
  ADD COLUMN IF NOT EXISTS version_number TEXT,
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS status public.package_version_status NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN IF NOT EXISTS release_notes TEXT,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Backfill a partir das colunas existentes
UPDATE public.package_versions
SET
  version_number = COALESCE(NULLIF(trim(version_number), ''), trim(version)),
  release_notes = COALESCE(release_notes, notes),
  name = COALESCE(NULLIF(trim(name), ''), 'Versão ' || trim(version)),
  status = CASE
    WHEN published IS TRUE THEN 'PUBLISHED'::public.package_version_status
    ELSE COALESCE(status, 'DRAFT'::public.package_version_status)
  END
WHERE version_number IS NULL
   OR trim(version_number) = ''
   OR name IS NULL
   OR trim(name) = '';

ALTER TABLE public.package_versions ALTER COLUMN version_number SET NOT NULL;
ALTER TABLE public.package_versions ALTER COLUMN name SET NOT NULL;

-- Sincroniza colunas legadas para módulos que ainda usam version / notes / published
CREATE OR REPLACE FUNCTION public.sync_package_version_legacy_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.version_number IS NOT NULL THEN
    NEW.version := NEW.version_number;
  END IF;

  IF NEW.release_notes IS NOT NULL THEN
    NEW.notes := NEW.release_notes;
  ELSIF NEW.notes IS NOT NULL AND NEW.release_notes IS NULL THEN
    NEW.release_notes := NEW.notes;
  END IF;

  IF NEW.status = 'PUBLISHED' THEN
    NEW.published := true;
  ELSIF NEW.status IN ('DRAFT', 'READY', 'ARCHIVED') THEN
    NEW.published := false;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_package_version_legacy ON public.package_versions;
CREATE TRIGGER trg_sync_package_version_legacy
  BEFORE INSERT OR UPDATE ON public.package_versions
  FOR EACH ROW EXECUTE FUNCTION public.sync_package_version_legacy_columns();

-- Unicidade case-insensitive do número da versão por pacote
DO $$
BEGIN
  IF EXISTS (
    SELECT package_id, lower(trim(version_number))
    FROM public.package_versions
    GROUP BY package_id, lower(trim(version_number))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Duplicatas em package_versions.version_number por package_id (case-insensitive). Resolva manualmente.';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS package_versions_number_unique_ci
  ON public.package_versions (package_id, lower(trim(version_number)));
