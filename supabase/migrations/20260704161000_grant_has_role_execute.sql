-- Restaura EXECUTE em has_role para o role authenticated.
--
-- Contexto: a migration 20260702152657 revogou EXECUTE de has_role para
-- PUBLIC, anon e authenticated. As policies RLS (admin_write_*, user_roles,
-- profiles, import_batches, etc.) invocam has_role() no contexto do usuário
-- autenticado; sem EXECUTE, a avaliação da policy falha e bloqueia writes.
--
-- handle_new_user permanece sem GRANT para authenticated (só roda via trigger).

GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
