-- Sprint 7A: infraestrutura de Sessões de Estudo.
-- Não altera migrations antigas.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'study_mode') THEN
    CREATE TYPE public.study_mode AS ENUM ('STUDY', 'EXAM', 'REVIEW', 'FAVORITES', 'WRONG_ONLY');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'study_session_status') THEN
    CREATE TYPE public.study_session_status AS ENUM ('IN_PROGRESS', 'PAUSED', 'FINISHED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  distribution_id UUID NOT NULL REFERENCES public.content_distributions(id) ON DELETE CASCADE,
  mode public.study_mode NOT NULL,
  status public.study_session_status NOT NULL DEFAULT 'IN_PROGRESS',
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  duration_seconds INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.study_session_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  question_order INT NOT NULL,
  selected_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ,
  response_time_seconds INT,
  review_later BOOLEAN NOT NULL DEFAULT false,
  favorite BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (study_session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_distribution_id ON public.study_sessions(distribution_id);
CREATE INDEX IF NOT EXISTS idx_study_session_questions_session_id ON public.study_session_questions(study_session_id);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_session_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_study_sessions"
  ON public.study_sessions FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "own_study_session_questions"
  ON public.study_session_questions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.study_sessions ss
      WHERE ss.id = study_session_id
        AND (ss.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.study_sessions ss
      WHERE ss.id = study_session_id
        AND (ss.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_sessions, public.study_session_questions TO authenticated;
GRANT ALL ON public.study_sessions, public.study_session_questions TO service_role;

DROP TRIGGER IF EXISTS trg_study_sessions_updated ON public.study_sessions;
CREATE TRIGGER trg_study_sessions_updated
  BEFORE UPDATE ON public.study_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
