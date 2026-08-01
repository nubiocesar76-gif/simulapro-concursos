-- SIA V1 (Bloco 3 "Estilo da banca"): texto editorial fixo por banca,
-- vindo de um catálogo curado (nunca improvisado por questão). Aditiva —
-- não altera nem apaga dado existente. Nula por padrão: a maioria das
-- bancas ainda não tem texto cadastrado (piloto começa com só 1 banca).
ALTER TABLE public.boards ADD COLUMN IF NOT EXISTS style_summary TEXT;
