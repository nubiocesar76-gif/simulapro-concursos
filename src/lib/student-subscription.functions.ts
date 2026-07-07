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
import { findCommercialPlan } from "@/config/commercial-plans";

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
  const ref = buildExternalReference(userId, distributionId);
  const subscription = await AsaasService.buscarAssinaturaPorExternalReference(ref);

  if (!subscription) {
    return {
      displayStatus: "NAO_ENCONTRADA",
      nextDueDate: null,
      billingType: null,
      invoiceUrl: null,
    };
  }

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

    const subscriptionRef = buildExternalReference(context.userId, plan.distributionId);
    const existingSubscription =
      await AsaasService.buscarAssinaturaPorExternalReference(subscriptionRef);
    if (existingSubscription?.status === "ACTIVE") {
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
