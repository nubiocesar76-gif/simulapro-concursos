-- Bug G5.2/G5.3 — corrige o erro Postgres 42P10 nos upserts de `subscriptions`.
--
-- Causa raiz: a única index cobrindo (user_id, distribution_id) era parcial
-- (`WHERE distribution_id IS NOT NULL`, ver migration
-- 20260705000000_subscriptions_distribution.sql). O código faz
-- `.upsert(..., { onConflict: "user_id,distribution_id" })` (usado tanto pelo
-- handler de SUBSCRIPTION_CREATED quanto por `activateOrRenewSubscription`, este
-- último acionado por PAYMENT_CONFIRMED/PAYMENT_RECEIVED) — o que o
-- supabase-js/PostgREST traduz em `ON CONFLICT (user_id, distribution_id)`, sem
-- repetir o predicado `WHERE`. O Postgres não infere index parciais em
-- ON CONFLICT sem essa repetição explícita, resultando em:
--   "42P10: there is no unique or exclusion constraint matching the ON CONFLICT
--    specification"
-- em toda chamada real desses dois upserts — ou seja, nenhum pagamento
-- confirmado conseguia ativar uma assinatura por esse caminho.
--
-- Verificado antes desta migration (leitura direta do banco real):
--   - zero duplicidades em (user_id, distribution_id) não-nulo;
--   - zero registros com distribution_id NULL.
-- Uma constraint UNIQUE não-parcial é compatível com os dados atuais — e, pela
-- semântica padrão do SQL, múltiplas linhas com distribution_id NULL para o
-- mesmo user_id não violariam essa constraint de qualquer forma (NULL nunca é
-- considerado igual a NULL para fins de unicidade).
--
-- A index parcial antiga fica redundante assim que a constraint não-parcial
-- existe (qualquer consulta que a usasse passa a usar a nova, que cobre um
-- superconjunto das mesmas linhas) — por isso é removida aqui, não apenas
-- deixada ao lado.
DROP INDEX IF EXISTS public.subscriptions_user_distribution_unique;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_user_distribution_unique UNIQUE (user_id, distribution_id);
