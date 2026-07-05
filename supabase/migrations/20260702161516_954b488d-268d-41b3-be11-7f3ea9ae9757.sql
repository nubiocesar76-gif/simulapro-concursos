
-- 1) Packages get an optional course
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL;

-- 2) Questions get FKs to package and version (populated by import)
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS package_version_id uuid REFERENCES public.package_versions(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_questions_package_version ON public.questions(package_version_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject_id);

-- 3) Only one published version per package
CREATE OR REPLACE FUNCTION public.enforce_single_published_version()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.published IS TRUE THEN
    UPDATE public.package_versions
       SET published = false
     WHERE package_id = NEW.package_id
       AND id <> NEW.id
       AND published = true;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_single_published_version ON public.package_versions;
CREATE TRIGGER trg_single_published_version
  AFTER INSERT OR UPDATE OF published ON public.package_versions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_single_published_version();
