-- Sprint 3: unicidade case-insensitive nos módulos de taxonomia.
-- Espelha o padrão de courses (lower(trim(name))).
-- Não altera FKs nem ON DELETE.

-- boards: nome único global
DO $$
BEGIN
  IF EXISTS (
    SELECT lower(trim(name)) FROM public.boards
    GROUP BY lower(trim(name)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicatas em boards.name (case-insensitive). Resolva manualmente.';
  END IF;
END $$;
CREATE UNIQUE INDEX boards_name_unique_ci ON public.boards (lower(trim(name)));

-- subjects: nome único global
DO $$
BEGIN
  IF EXISTS (
    SELECT lower(trim(name)) FROM public.subjects
    GROUP BY lower(trim(name)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicatas em subjects.name (case-insensitive). Resolva manualmente.';
  END IF;
END $$;
CREATE UNIQUE INDEX subjects_name_unique_ci ON public.subjects (lower(trim(name)));

-- positions: nome único por curso
DO $$
BEGIN
  IF EXISTS (
    SELECT course_id, lower(trim(name)) FROM public.positions
    GROUP BY course_id, lower(trim(name)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicatas em positions.name por course_id (case-insensitive). Resolva manualmente.';
  END IF;
END $$;
CREATE UNIQUE INDEX positions_name_unique_ci ON public.positions (course_id, lower(trim(name)));

-- exams: nome único por banca
DO $$
BEGIN
  IF EXISTS (
    SELECT board_id, lower(trim(name)) FROM public.exams
    GROUP BY board_id, lower(trim(name)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicatas em exams.name por board_id (case-insensitive). Resolva manualmente.';
  END IF;
END $$;
CREATE UNIQUE INDEX exams_name_unique_ci ON public.exams (board_id, lower(trim(name)));

-- topics: nome único por disciplina
DO $$
BEGIN
  IF EXISTS (
    SELECT subject_id, lower(trim(name)) FROM public.topics
    GROUP BY subject_id, lower(trim(name)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicatas em topics.name por subject_id (case-insensitive). Resolva manualmente.';
  END IF;
END $$;
CREATE UNIQUE INDEX topics_name_unique_ci ON public.topics (subject_id, lower(trim(name)));
