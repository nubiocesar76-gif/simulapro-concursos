// createServerFn wrappers — seguros para importar de componentes React (o build
// substitui a implementação por um RPC stub no bundle do cliente). Lógica que toca a
// API do Asaas (segredo de API) só roda aqui dentro, nunca no navegador.

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { AsaasService } from "@/integrations/asaas/AsaasService.server";
import {
  buildCustomerExternalReference,
  buildExternalReference,
} from "@/integrations/asaas/reference.server";
import { COMMERCIAL_PLANS, findCommercialPlan } from "@/config/commercial-plans";

export type AsaasDisplayStatus =
  "ATIVA" | "AGUARDANDO_PAGAMENTO" | "CANCELADA" | "EM_ATRASO" | "NAO_ENCONTRADA";

export type AsaasLiveStatus = {
  displayStatus: AsaasDisplayStatus;
  nextDueDate: string | null;
  billingType: string | null;
  invoiceUrl: string | null;
};

async function lookupAsaasLiveStatus(
  userId: string,
  distributionId: string,
): Promise<AsaasLiveStatus> {
  // O externalReference agora inclui o planId (Sprint P0.5A), e a assinatura local
  // não guarda qual plano foi comprado — por isso tentamos cada plano comercial que
  // aponta para esta distribuição até encontrar a assinatura correspondente no Asaas.
  const candidatePlans = COMMERCIAL_PLANS.filter((plan) => plan.distributionId === distributionId);

  for (const plan of candidatePlans) {
    const ref = buildExternalReference(userId, distributionId, plan.id);
    const subscription = await AsaasService.buscarAssinaturaPorExternalReference(ref);
    if (!subscription) continue;

    const latestPayment = await AsaasService.buscarCobrancaMaisRecente(subscription.id).catch(
      () => null,
    );

    let displayStatus: AsaasDisplayStatus = "ATIVA";
    if (subscription.status !== "ACTIVE") {
      displayStatus = "CANCELADA";
    } else if (latestPayment?.status === "OVERDUE") {
      displayStatus = "EM_ATRASO";
    } else if (
      latestPayment &&
      latestPayment.status !== "CONFIRMED" &&
      latestPayment.status !== "RECEIVED"
    ) {
      displayStatus = "AGUARDANDO_PAGAMENTO";
    }

    return {
      displayStatus,
      nextDueDate: subscription.nextDueDate ?? null,
      billingType: subscription.billingType ?? null,
      invoiceUrl: latestPayment?.invoiceUrl ?? null,
    };
  }

  return {
    displayStatus: "NAO_ENCONTRADA",
    nextDueDate: null,
    billingType: null,
    invoiceUrl: null,
  };
}

// Bug G4: "ACTIVE" numa assinatura do Asaas só significa que existe uma cobrança
// recorrente cadastrada lá — não significa que algum pagamento foi confirmado. Um
// checkout abandonado (usuário nunca paga) deixa a assinatura no Asaas em ACTIVE para
// sempre, porque só o webhook de pagamento confirmado a cancela. Por isso quem decide
// se o usuário já tem acesso é exclusivamente o banco local (`subscriptions`, ativada
// só pelo webhook) — o mesmo critério de vigência já usado em study-session.ts e
// study-engine.ts (status ACTIVE + dentro de starts_at/expires_at).
function isLocalSubscriptionCurrentlyActive(startsAt: string, expiresAt: string | null): boolean {
  const now = Date.now();
  if (new Date(startsAt).getTime() > now) return false;
  if (expiresAt && new Date(expiresAt).getTime() < now) return false;
  return true;
}

// Usada tanto na carga inicial da tela "Minha Assinatura" quanto no botão "Atualizar" —
// mesma consulta ao vivo, sem escrever em `subscriptions` (ativação é só do webhook).
export const getAsaasLiveStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { distributionId: string }) => data)
  .handler(async ({ data, context }) => {
    return lookupAsaasLiveStatus(context.userId, data.distributionId);
  });

export const iniciarCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { planId: string; cpfCnpj: string }) => data)
  .handler(async ({ data, context }) => {
    const plan = findCommercialPlan(data.planId);
    if (!plan) {
      throw new Error("Plano não encontrado.");
    }

    const cpfCnpj = data.cpfCnpj.replace(/\D/g, "");
    if (cpfCnpj.length < 11) {
      throw new Error("CPF/CNPJ inválido.");
    }

    const { data: profile, error: profileError } = await context.supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", context.userId)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!profile?.email) {
      throw new Error("Perfil sem e-mail cadastrado.");
    }

    // Reaproveita o cliente já existente no Asaas (buscando por externalReference) em
    // vez de criar um duplicado a cada tentativa de checkout.
    const customerRef = buildCustomerExternalReference(context.userId);
    let customer = await AsaasService.buscarClientePorExternalReference(customerRef);
    if (!customer) {
      customer = await AsaasService.criarCliente({
        name: profile.full_name ?? profile.email,
        email: profile.email,
        cpfCnpj,
        externalReference: customerRef,
      });
    }

    const subscriptionRef = buildExternalReference(context.userId, plan.distributionId, plan.id);

    // Quem decide se o usuário já tem acesso é o banco local, não o Asaas (Bug G4) —
    // ver `isLocalSubscriptionCurrentlyActive` acima. `buscarAssinaturaPorExternalReference`
    // continua existindo e sendo usada em `lookupAsaasLiveStatus`, só não serve mais como
    // critério de bloqueio de um novo checkout.
    const { data: localSubscription, error: localSubscriptionError } = await context.supabase
      .from("subscriptions")
      .select("starts_at, expires_at")
      .eq("user_id", context.userId)
      .eq("distribution_id", plan.distributionId)
      .eq("status", "ACTIVE")
      .maybeSingle();
    if (localSubscriptionError) throw localSubscriptionError;
    if (
      localSubscription &&
      isLocalSubscriptionCurrentlyActive(localSubscription.starts_at, localSubscription.expires_at)
    ) {
      throw new Error("Você já possui uma assinatura ativa para este plano.");
    }

    const nextDueDate = new Date().toISOString().slice(0, 10);
    const subscription = await AsaasService.criarAssinatura({
      customerId: customer.id,
      billingType: plan.billingType,
      value: plan.value,
      nextDueDate,
      cycle: plan.cycle,
      externalReference: subscriptionRef,
    });

    // A ativação em si continua acontecendo só pelo webhook (Sprint 4.2C) quando o
    // pagamento for confirmado — aqui só criamos a cobrança e devolvemos o link.
    const payment = await AsaasService.buscarCobrancaMaisRecente(subscription.id).catch(() => null);
    if (!payment?.invoiceUrl) {
      throw new Error(
        "Assinatura criada, mas o link de pagamento ainda não está disponível. Tente novamente em instantes.",
      );
    }

    return { redirectUrl: payment.invoiceUrl };
  });
