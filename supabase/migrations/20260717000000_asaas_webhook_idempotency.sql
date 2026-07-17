-- Sprint D7 — idempotência real do webhook do Asaas.
--
-- A auditoria D6 encontrou uma condição de corrida no dedupe de eventos do
-- webhook: a checagem "evento já processado?" fazia SELECT antes de INSERT
-- na tabela genérica `logs`, sem nenhuma trava de banco entre as duas
-- operações. Duas entregas concorrentes do mesmo evento podiam passar pela
-- checagem antes de qualquer uma marcar o evento como processado.
--
-- Esta migration cria uma tabela dedicada, com PRIMARY KEY textual no id do
-- evento do Asaas (não é UUID — não reaproveitamos `logs.entity_id`, que é
-- tipado UUID, para não colidir com esse formato). A aplicação passa a usar
-- INSERT ... ON CONFLICT DO NOTHING (via upsert com ignoreDuplicates) para
-- "reivindicar" o evento atomicamente antes de processá-lo — elimina o
-- intervalo de corrida por construção, sem depender de SELECT prévio.
CREATE TABLE IF NOT EXISTS public.asaas_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.asaas_webhook_events ENABLE ROW LEVEL SECURITY;

-- Tabela interna de controle do webhook — só o backend (service_role, que
-- bypassa RLS) acessa; nenhuma policy para authenticated/anon, mesma postura
-- de outras tabelas de auditoria/ledger neste schema.
GRANT ALL ON public.asaas_webhook_events TO service_role;
