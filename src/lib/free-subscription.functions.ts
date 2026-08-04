// createServerFn wrapper para o Plano Free (Sprint G6.0) — seguro para importar de
// componentes React (o build substitui a implementação por um RPC stub no bundle do
// cliente), mesmo padrão de student-subscription.functions.ts. Sem Asaas, sem
// checkout, sem cobrança: só cria/confirma o vínculo local em `subscriptions`.

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { COMMERCIAL_PLANS } from "@/config/commercial-plans";
import { getFreePlanDistributionId } from "@/config/free-plan";

// Mesmo critério de vigência já usado em study-session.ts, study-engine.ts e
// student-subscription.functions.ts (Bug G4/G4.1).
function isLocallyActive(startsAt: string, expiresAt: string | null): boolean {
  const now = Date.now();
  if (new Date(startsAt).getTime() > now) return false;
  if (expiresAt && new Date(expiresAt).getTime() < now) return false;
  return true;
}

export const iniciarPlanoFree = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { positionSlug: string }) => data)
  .handler(async ({ context, data }) => {
    const FREE_PLAN_DISTRIBUTION_ID = getFreePlanDistributionId(data.positionSlug);
    if (!FREE_PLAN_DISTRIBUTION_ID) {
      throw new Error("Plano Free não disponível para este cargo.");
    }

    const paidDistributionIds = [...new Set(COMMERCIAL_PLANS.map((plan) => plan.distributionId))];

    // 1. Já existe assinatura PAGA ativa? Plano Free não fica disponível.
    if (paidDistributionIds.length > 0) {
      const { data: paidSubscriptions, error: paidError } = await context.supabase
        .from("subscriptions")
        .select("starts_at, expires_at")
        .eq("user_id", context.userId)
        .eq("status", "ACTIVE")
        .in("distribution_id", paidDistributionIds);
      if (paidError) throw paidError;

      const hasActivePaid = (paidSubscriptions ?? []).some((s) =>
        isLocallyActive(s.starts_at, s.expires_at),
      );
      if (hasActivePaid) {
        throw new Error(
          "Você já possui uma assinatura paga ativa — o Plano Free não está disponível.",
        );
      }
    }

    // 2. Já existe assinatura FREE ativa?
    const { data: freeSubscription, error: freeError } = await context.supabase
      .from("subscriptions")
      .select("starts_at, expires_at")
      .eq("user_id", context.userId)
      .eq("distribution_id", FREE_PLAN_DISTRIBUTION_ID)
      .eq("status", "ACTIVE")
      .maybeSingle();
    if (freeError) throw freeError;
    if (
      freeSubscription &&
      isLocallyActive(freeSubscription.starts_at, freeSubscription.expires_at)
    ) {
      throw new Error("Você já está usando o Plano Free.");
    }

    // 3. Ativar. Escrita precisa do service role: a RLS de `subscriptions` só permite
    // INSERT/UPDATE para admin (policy `admin_write_subscriptions`), então o próprio
    // aluno não consegue criar a linha via `context.supabase`. Import dinâmico porque
    // este módulo é *.functions.ts (embarca no bundle do cliente) — `supabaseAdmin`
    // só é seguro dentro de um handler de servidor, nunca em top-level aqui.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // subscriptions.course_id é obrigatório (subscriptions_course_id_fkey) — resolvido
    // pela mesma cadeia content_distributions → package_versions → packages usada em
    // src/lib/asaas-webhook.server.ts, nunca inventado.
    const { data: distribution, error: distributionError } = await supabaseAdmin
      .from("content_distributions")
      .select("package_versions(packages(course_id))")
      .eq("id", FREE_PLAN_DISTRIBUTION_ID)
      .maybeSingle();
    if (distributionError) throw distributionError;
    const courseId = distribution?.package_versions?.packages?.course_id;
    if (!courseId) {
      throw new Error("Não foi possível determinar o curso do Plano Free.");
    }

    const { error: activateError } = await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: context.userId,
        distribution_id: FREE_PLAN_DISTRIBUTION_ID,
        course_id: courseId,
        status: "ACTIVE",
        starts_at: new Date().toISOString(),
        expires_at: null,
        // "sistema": ativação automática pelo próprio aluno, sem curador humano —
        // created_by é FK para auth.users, não aceita texto livre.
        created_by: null,
      },
      { onConflict: "user_id,distribution_id" },
    );
    if (activateError) throw activateError;

    return { success: true };
  });
