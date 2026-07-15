// Server-only. Lógica de negócio do webhook do Asaas: autenticidade, idempotência,
// despacho de eventos e sincronização de `subscriptions`.
//
// Reaproveita 100% a estrutura já homologada: mesma tabela `subscriptions`, mesmos
// campos (`status`, `expires_at`), mesma tabela `logs` para auditoria — nenhuma tabela,
// coluna ou lógica de permissão nova. Correlação evento → assinatura local é feita via
// `externalReference` (ver `integrations/asaas/reference.server.ts`), já que não há
// coluna própria para guardar o ID da assinatura/cliente no Asaas nesta sprint.

import { timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getAsaasConfig } from "@/integrations/asaas/config.server";
import { AsaasService } from "@/integrations/asaas/AsaasService.server";
import { findCommercialPlan, findCommercialPlanByDistributionId } from "@/config/commercial-plans";
import { parseExternalReference } from "@/integrations/asaas/reference.server";

const WEBHOOK_TOKEN_HEADER = "asaas-access-token";

export function isAuthenticWebhookRequest(request: Request): boolean {
  const config = getAsaasConfig();
  const received = request.headers.get(WEBHOOK_TOKEN_HEADER);
  if (!received) return false;

  const expected = Buffer.from(config.webhookSecret);
  const actual = Buffer.from(received);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

// --- Formato do payload recebido (só os campos que esta sprint lê) ---

type AsaasWebhookPayload = {
  id?: string;
  event: string;
  payment?: {
    id: string;
    subscription?: string;
    externalReference?: string;
    status?: string;
  };
  subscription?: {
    id: string;
    externalReference?: string;
    status?: string;
    nextDueDate?: string;
  };
};

const SUPPORTED_EVENTS = new Set([
  "PAYMENT_CONFIRMED",
  "PAYMENT_RECEIVED",
  "PAYMENT_OVERDUE",
  "PAYMENT_DELETED",
  "PAYMENT_REFUNDED",
  "PAYMENT_REFUND_IN_PROGRESS",
  "PAYMENT_CHARGEBACK_REQUESTED",
  "PAYMENT_CHARGEBACK_DISPUTE",
  "PAYMENT_AWAITING_CHARGEBACK_REVERSAL",
  "SUBSCRIPTION_CREATED",
  "SUBSCRIPTION_UPDATED",
  "SUBSCRIPTION_CANCELLED",
]);

function resolveEventId(payload: AsaasWebhookPayload): string {
  if (payload.id) return payload.id;
  const nestedId = payload.payment?.id ?? payload.subscription?.id ?? "unknown";
  return `${payload.event}:${nestedId}`;
}

// --- Log/auditoria — nunca grava dado sensível (cartão, token, API key) ---

async function recordAsaasLog(
  action: string,
  entityId: string | null,
  metadata: Record<string, any>,
) {
  try {
    await supabaseAdmin.from("logs").insert({
      user_id: null,
      action,
      entity: "asaas_webhook",
      entity_id: entityId,
      metadata,
    });
  } catch {
    // nunca deixa o webhook falhar por causa do log
  }
}

// --- Idempotência, reaproveitando a tabela `logs` já existente como ledger ---

async function wasEventAlreadyProcessed(eventId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("logs")
    .select("id")
    .eq("action", "asaas.webhook.processed")
    .eq("entity_id", eventId)
    .limit(1)
    .maybeSingle();

  if (error) {
    // Falha na checagem: preferimos arriscar reprocessar (os handlers abaixo são
    // idempotentes por natureza — upsert por user_id+distribution_id) a perder o evento.
    await recordAsaasLog("asaas.webhook.error", eventId, {
      stage: "idempotency_check",
      message: error.message,
    });
    return false;
  }
  return !!data;
}

async function markEventProcessed(eventId: string, eventName: string) {
  await recordAsaasLog("asaas.webhook.processed", eventId, { event: eventName });
}

// --- Sincronização de assinatura, reaproveitando a estrutura já homologada ---

async function distributionExists(distributionId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("content_distributions")
    .select("id")
    .eq("id", distributionId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

async function findSubscription(userId: string, distributionId: string) {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("id, status")
    .eq("user_id", userId)
    .eq("distribution_id", distributionId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function activateOrRenewSubscription(params: {
  userId: string;
  distributionId: string;
  expiresAt: string | null;
  eventId: string;
}) {
  const { userId, distributionId, expiresAt, eventId } = params;

  if (!(await distributionExists(distributionId))) {
    await recordAsaasLog("asaas.webhook.error", eventId, {
      stage: "activate_or_renew",
      message:
        "distribution_id do externalReference não corresponde a nenhuma distribuição existente",
    });
    return;
  }

  const existing = await findSubscription(userId, distributionId);
  const wasActive = existing?.status === "ACTIVE";

  if (existing) {
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({ status: "ACTIVE", expires_at: expiresAt })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from("subscriptions").insert({
      user_id: userId,
      distribution_id: distributionId,
      status: "ACTIVE",
      starts_at: new Date().toISOString(),
      expires_at: expiresAt,
    });
    if (error) throw error;
  }

  await recordAsaasLog(
    wasActive ? "asaas.subscription.renewed" : "asaas.subscription.activated",
    eventId,
    { user_id: userId, distribution_id: distributionId },
  );
}

async function deactivateSubscription(params: {
  userId: string;
  distributionId: string;
  eventId: string;
  reason: string;
}) {
  const { userId, distributionId, eventId, reason } = params;
  const existing = await findSubscription(userId, distributionId);
  if (!existing) {
    await recordAsaasLog("asaas.webhook.error", eventId, {
      stage: reason,
      message: "assinatura local não encontrada para desativar",
    });
    return;
  }

  // Nunca exclui o registro — só atualiza o status, preservando o histórico.
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({ status: "INACTIVE" })
    .eq("id", existing.id);
  if (error) throw error;

  await recordAsaasLog(`asaas.subscription.${reason}`, eventId, {
    user_id: userId,
    distribution_id: distributionId,
  });
}

function computeCommercialExpiresAt(
  accessDurationMonths: number,
  confirmedAt: Date = new Date(),
): string {
  const expiresAt = new Date(confirmedAt);
  expiresAt.setMonth(expiresAt.getMonth() + accessDurationMonths);
  return expiresAt.toISOString();
}

function isCommercialFixedTermPlan(distributionId: string): boolean {
  return findCommercialPlanByDistributionId(distributionId) !== undefined;
}

// --- Despacho ---

export async function processAsaasWebhookEvent(payload: AsaasWebhookPayload): Promise<void> {
  const eventId = resolveEventId(payload);

  if (!SUPPORTED_EVENTS.has(payload.event)) {
    await recordAsaasLog("asaas.webhook.ignored", eventId, { event: payload.event });
    return;
  }

  if (await wasEventAlreadyProcessed(eventId)) {
    return;
  }

  await recordAsaasLog("asaas.webhook.received", eventId, { event: payload.event });

  switch (payload.event) {
    case "PAYMENT_CONFIRMED":
    case "PAYMENT_RECEIVED": {
      const ref = parseExternalReference(payload.payment?.externalReference);
      if (!ref) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "payment_confirmed_or_received",
          message: "externalReference ausente ou inválida",
        });
        break;
      }
      // Bug encontrado na homologação (Sprint 4.2E): sem `payment.subscription`,
      // resolveNextExpiry caía no fallback `null` e a ativação concedia acesso sem
      // vencimento (para sempre). Como o checkout desta plataforma só cria cobrança via
      // assinatura, um pagamento confirmado sem vínculo de assinatura é entrada
      // inesperada — não ativa nem renova, só registra o erro para investigação manual.
      if (!payload.payment?.subscription) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "payment_confirmed_or_received",
          message:
            "payment.subscription ausente — pagamento não vinculado a uma assinatura, ativação recusada",
        });
        break;
      }

      if (!ref.planId) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "payment_confirmed_or_received",
          message:
            "planId ausente no externalReference (referência de formato legado ou incompleta) — ativação recusada",
          distribution_id: ref.distributionId,
        });
        break;
      }

      const plan = findCommercialPlan(ref.planId);
      if (!plan) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "payment_confirmed_or_received",
          message:
            "planId não corresponde a nenhum plano comercial configurado — ativação recusada",
          plan_id: ref.planId,
          distribution_id: ref.distributionId,
        });
        break;
      }

      const expiresAt = computeCommercialExpiresAt(plan.accessDurationMonths);
      await activateOrRenewSubscription({
        userId: ref.userId,
        distributionId: ref.distributionId,
        expiresAt,
        eventId,
      });

      try {
        await AsaasService.cancelarAssinatura(payload.payment.subscription);
      } catch (error) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "cancel_after_activation",
          message: error instanceof Error ? error.message : "falha ao cancelar assinatura no Asaas",
          asaas_subscription_id: payload.payment.subscription,
          user_id: ref.userId,
          distribution_id: ref.distributionId,
        });
      }
      break;
    }

    case "PAYMENT_OVERDUE": {
      const ref = parseExternalReference(payload.payment?.externalReference);
      if (!ref) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "payment_overdue",
          message: "externalReference ausente ou inválida",
        });
        break;
      }
      await deactivateSubscription({
        userId: ref.userId,
        distributionId: ref.distributionId,
        eventId,
        reason: "overdue",
      });
      break;
    }

    case "PAYMENT_REFUNDED": {
      const ref = parseExternalReference(payload.payment?.externalReference);
      if (!ref) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "payment_refunded",
          message: "externalReference ausente ou inválida",
        });
        break;
      }
      await deactivateSubscription({
        userId: ref.userId,
        distributionId: ref.distributionId,
        eventId,
        reason: "refunded",
      });
      break;
    }

    case "PAYMENT_REFUND_IN_PROGRESS":
    case "PAYMENT_CHARGEBACK_REQUESTED":
    case "PAYMENT_CHARGEBACK_DISPUTE":
    case "PAYMENT_AWAITING_CHARGEBACK_REVERSAL": {
      const paymentLogAction: Record<string, string> = {
        PAYMENT_REFUND_IN_PROGRESS: "asaas.payment.refund_in_progress",
        PAYMENT_CHARGEBACK_REQUESTED: "asaas.payment.chargeback_requested",
        PAYMENT_CHARGEBACK_DISPUTE: "asaas.payment.chargeback_dispute",
        PAYMENT_AWAITING_CHARGEBACK_REVERSAL: "asaas.payment.chargeback_reversal_pending",
      };
      const ref = parseExternalReference(payload.payment?.externalReference);
      if (!ref) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: payload.event.toLowerCase(),
          message: "externalReference ausente ou inválida",
        });
        break;
      }
      const existing = await findSubscription(ref.userId, ref.distributionId);
      if (!existing) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: payload.event.toLowerCase(),
          message: "assinatura local não encontrada",
        });
        break;
      }
      await recordAsaasLog(paymentLogAction[payload.event], eventId, {
        user_id: ref.userId,
        distribution_id: ref.distributionId,
      });
      break;
    }

    case "PAYMENT_DELETED": {
      // Remover uma cobrança pontual não implica cancelar a assinatura —
      // SUBSCRIPTION_CANCELLED é o evento responsável por isso. Só registramos.
      await recordAsaasLog("asaas.webhook.payment_deleted", eventId, {
        payment_id: payload.payment?.id ?? null,
      });
      break;
    }

    case "SUBSCRIPTION_CREATED": {
      const ref = parseExternalReference(payload.subscription?.externalReference);
      if (!ref) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "subscription_created",
          message: "externalReference ausente ou inválida",
        });
        break;
      }
      if (!(await distributionExists(ref.distributionId))) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "subscription_created",
          message: "distribution_id inválido",
        });
        break;
      }
      const existing = await findSubscription(ref.userId, ref.distributionId);
      if (!existing) {
        // Cria o vínculo local sem liberar acesso — a ativação real só acontece
        // em PAYMENT_CONFIRMED/PAYMENT_RECEIVED.
        const { error } = await supabaseAdmin.from("subscriptions").insert({
          user_id: ref.userId,
          distribution_id: ref.distributionId,
          status: "INACTIVE",
          starts_at: new Date().toISOString(),
          expires_at: null,
        });
        if (error) throw error;
      }
      await recordAsaasLog("asaas.subscription.created", eventId, {
        user_id: ref.userId,
        distribution_id: ref.distributionId,
      });
      break;
    }

    case "SUBSCRIPTION_UPDATED": {
      const ref = parseExternalReference(payload.subscription?.externalReference);
      if (!ref) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "subscription_updated",
          message: "externalReference ausente ou inválida",
        });
        break;
      }
      if (payload.subscription?.status && payload.subscription.status !== "ACTIVE") {
        if (isCommercialFixedTermPlan(ref.distributionId)) {
          await recordAsaasLog("asaas.subscription.updated", eventId, {
            user_id: ref.userId,
            distribution_id: ref.distributionId,
            asaas_status: payload.subscription.status,
            note: "cancelamento técnico pós-pagamento — acesso local preservado",
          });
        } else {
          await deactivateSubscription({
            userId: ref.userId,
            distributionId: ref.distributionId,
            eventId,
            reason: "updated_inactive",
          });
        }
      } else {
        await recordAsaasLog("asaas.subscription.updated", eventId, {
          user_id: ref.userId,
          distribution_id: ref.distributionId,
        });
      }
      break;
    }

    case "SUBSCRIPTION_CANCELLED": {
      const ref = parseExternalReference(payload.subscription?.externalReference);
      if (!ref) {
        await recordAsaasLog("asaas.webhook.error", eventId, {
          stage: "subscription_cancelled",
          message: "externalReference ausente ou inválida",
        });
        break;
      }
      if (isCommercialFixedTermPlan(ref.distributionId)) {
        await recordAsaasLog("asaas.subscription.cancelled", eventId, {
          user_id: ref.userId,
          distribution_id: ref.distributionId,
          note: "cancelamento técnico pós-pagamento — acesso local preservado",
        });
      } else {
        await deactivateSubscription({
          userId: ref.userId,
          distributionId: ref.distributionId,
          eventId,
          reason: "cancelled",
        });
      }
      break;
    }
  }

  await markEventProcessed(eventId, payload.event);
}
