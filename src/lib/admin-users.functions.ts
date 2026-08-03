// createServerFn wrapper — segue o mesmo padrão de free-subscription.functions.ts:
// import dinâmico de supabaseAdmin (nunca top-level, este módulo embarca no bundle do
// cliente). Exclusão definitiva de usuário só é possível aqui, nunca no client, porque
// exige a Admin API do Supabase (service role).

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { userId: string }) => data)
  .handler(async ({ data, context }) => {
    // 1. Confirma que quem está chamando é admin. `context.supabase` é autenticado com o
    // token do solicitante — a policy "Users read their roles" sempre permite ler o
    // próprio user_id, então isso funciona mesmo antes de sabermos se é admin.
    const { data: callerRoles, error: callerRolesError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (callerRolesError) throw callerRolesError;
    const callerIsAdmin = (callerRoles ?? []).some((r) => r.role === "admin");
    if (!callerIsAdmin) {
      throw new Error("Apenas administradores podem excluir usuários.");
    }

    // 2. Nunca autoexclusão do admin logado.
    if (data.userId === context.userId) {
      throw new Error("Você não pode excluir sua própria conta enquanto estiver logado.");
    }

    // 3. Se o alvo é admin, nunca deixar o sistema sem nenhum administrador.
    const { data: targetRoles, error: targetRolesError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.userId);
    if (targetRolesError) throw targetRolesError;
    const targetIsAdmin = (targetRoles ?? []).some((r) => r.role === "admin");

    if (targetIsAdmin) {
      const { count: adminCount, error: adminCountError } = await context.supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      if (adminCountError) throw adminCountError;
      if ((adminCount ?? 0) <= 1) {
        throw new Error("Não é possível excluir o último administrador do sistema.");
      }
    }

    const { data: targetProfile } = await context.supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", data.userId)
      .maybeSingle();

    // 4. Exclusão definitiva: só via Admin API sobre auth.users. Nunca DELETE direto em
    // profiles/user_roles — deixaria um auth.users órfão sem perfil (RLS "Admins manage
    // profiles"/"Admins manage roles" tecnicamente permitiria isso, mas o cascade correto
    // só dispara ao apagar a linha em auth.users). A cascata (ON DELETE CASCADE) já
    // existente cuida de profiles, user_roles, subscriptions, study_sessions (e
    // study_session_questions via FK em cascata), question_attempts, favorites, statistics.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (deleteError) throw deleteError;

    // 5. Log da ação, mesmo padrão de logEvent (src/lib/log.ts), mas usando o contexto já
    // autenticado do server function em vez de supabase.auth.getUser() no client.
    await context.supabase.from("logs").insert({
      user_id: context.userId,
      action: "user.delete",
      entity: "profiles",
      entity_id: data.userId,
      metadata: {
        target_email: targetProfile?.email ?? null,
        target_full_name: targetProfile?.full_name ?? null,
      },
    });

    return { success: true };
  });
