-- Sprint 6A: evolução da tabela subscriptions para vínculo com distribuições.
-- Mantém colunas legadas (course_id, package_id, active, ends_at) para compatibilidade com Portal do Aluno.
-- Não altera migrations antigas.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE public.subscription_status AS ENUM ('ACTIVE', 'INACTIVE');
  END IF;
END $$;

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS distribution_id UUID REFERENCES public.content_distributions(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS status public.subscription_status NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

UPDATE public.subscriptions
SET status = CASE WHEN active IS TRUE THEN 'ACTIVE'::public.subscription_status ELSE 'INACTIVE'::public.subscription_status END
WHERE status IS NULL;

UPDATE public.subscriptions
SET expires_at = ends_at
WHERE expires_at IS NULL AND ends_at IS NOT NULL;

CREATE OR REPLACE FUNCTION public.sync_subscription_legacy_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_course_id UUID;
  v_package_id UUID;
BEGIN
  NEW.active := (NEW.status = 'ACTIVE');
  NEW.ends_at := NEW.expires_at;

  IF NEW.distribution_id IS NOT NULL THEN
    SELECT p.course_id, pv.package_id
    INTO v_course_id, v_package_id
    FROM public.content_distributions cd
    JOIN public.package_versions pv ON pv.id = cd.package_version_id
    JOIN public.packages p ON p.id = pv.package_id
    WHERE cd.id = NEW.distribution_id;

    IF v_course_id IS NOT NULL THEN
      NEW.course_id := v_course_id;
    END IF;
    IF v_package_id IS NOT NULL THEN
      NEW.package_id := v_package_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_subscription_legacy ON public.subscriptions;
CREATE TRIGGER trg_sync_subscription_legacy
  BEFORE INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.sync_subscription_legacy_fields();

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_distribution_unique
  ON public.subscriptions (user_id, distribution_id)
  WHERE distribution_id IS NOT NULL;

ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_dates_check;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_dates_check CHECK (
    expires_at IS NULL OR starts_at IS NULL OR expires_at > starts_at
  );
