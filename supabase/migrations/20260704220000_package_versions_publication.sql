-- Sprint 5B Etapa 3: campos de publicação em package_versions.
-- Não altera migrations antigas. Não remove RLS existente.

ALTER TABLE public.package_versions
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Backfill para versões já publicadas (legado)
UPDATE public.package_versions
SET published_at = COALESCE(published_at, updated_at)
WHERE status = 'PUBLISHED'
  AND published IS TRUE
  AND published_at IS NULL;
