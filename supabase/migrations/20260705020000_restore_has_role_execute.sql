-- Corretiva: restaura EXECUTE em has_role para authenticated.
--
-- A função public.has_role(UUID, public.app_role) é SECURITY DEFINER e é
-- invocada pelas policies RLS no contexto do usuário autenticado (ex.:
-- user_roles, profiles, taxonomia, study_sessions). A migration
-- 20260702152657 revogou EXECUTE; 20260704161000 deveria restaurar, mas
-- ambientes que não aplicaram essa migration continuam com:
--   permission denied for function has_role
--
-- Idempotente: GRANT pode ser executado mais de uma vez sem efeito colateral.
-- handle_new_user permanece sem GRANT para authenticated (só via trigger).

GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
