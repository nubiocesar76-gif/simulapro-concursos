-- Sprint 2B: unicidade case-insensitive do nome em courses.
-- Não altera FKs nem ON DELETE.

DO $$
BEGIN
  IF EXISTS (
    SELECT lower(trim(name))
    FROM public.courses
    GROUP BY lower(trim(name))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Existem nomes de curso duplicados (case-insensitive). Resolva manualmente antes de aplicar este índice.';
  END IF;
END $$;

CREATE UNIQUE INDEX courses_name_unique_ci
ON public.courses (lower(trim(name)));
