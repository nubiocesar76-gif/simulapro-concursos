-- Sprint 5B Etapa 4: camada de Distribuição de Conteúdo.
-- Não altera migrations antigas.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'distribution_status') THEN
    CREATE TYPE public.distribution_status AS ENUM ('ACTIVE', 'INACTIVE', 'SCHEDULED', 'EXPIRED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.content_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_version_id UUID NOT NULL REFERENCES public.package_versions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status public.distribution_status NOT NULL DEFAULT 'ACTIVE',
  available_from TIMESTAMPTZ,
  available_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT content_distributions_dates_check CHECK (
    available_until IS NULL
    OR available_from IS NULL
    OR available_until > available_from
  )
);

CREATE OR REPLACE FUNCTION public.enforce_distribution_published_version()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.package_versions
    WHERE id = NEW.package_version_id
      AND status = 'PUBLISHED'
  ) THEN
    RAISE EXCEPTION 'Somente versões publicadas podem ser distribuídas.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_distribution_published_version ON public.content_distributions;
CREATE TRIGGER trg_distribution_published_version
  BEFORE INSERT OR UPDATE OF package_version_id ON public.content_distributions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_distribution_published_version();

ALTER TABLE public.content_distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_all_content_distributions"
  ON public.content_distributions FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_write_content_distributions"
  ON public.content_distributions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_distributions TO authenticated;
GRANT ALL ON public.content_distributions TO service_role;

DROP TRIGGER IF EXISTS trg_content_distributions_updated ON public.content_distributions;
CREATE TRIGGER trg_content_distributions_updated
  BEFORE UPDATE ON public.content_distributions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
