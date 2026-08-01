-- SIA V1 (Bloco 9 "Tempo"): a média de tempo de resolução é calculada por
-- agregação real sobre study_session_questions.response_time_seconds,
-- primeiro por question_id, com fallback por topic_id e depois board_id
-- quando a questão específica ainda não tem amostra suficiente. Nenhum dos
-- três índices existia até agora (confirmado em supabase/migrations/*.sql
-- via busca real, não suposição) — aditivo, não altera dado existente.
CREATE INDEX IF NOT EXISTS idx_study_session_questions_question_id
  ON public.study_session_questions(question_id);

CREATE INDEX IF NOT EXISTS idx_questions_topic_id
  ON public.questions(topic_id);

CREATE INDEX IF NOT EXISTS idx_questions_board_id
  ON public.questions(board_id);
