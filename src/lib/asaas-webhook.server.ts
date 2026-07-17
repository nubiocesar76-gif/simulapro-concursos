// Server-only. Lógica de negócio do webhook do Asaas: autenticidade, idempotência,
// despacho de eventos e sincronização de `subscriptions`.
//
// Reaproveita a estrutura já homologada: mesma tabela `subscriptions`, mesmos campos
// (`status`, `expires_at`), mesma tabela `logs` para auditoria de eventos de negócio.
// Correlação evento → assinatura local é feita via `externalReference` (ver
// `integrations/asaas/reference.server.ts`), já que não há coluna própria para guardar
// o ID da assinatura/cliente no Asaas nesta sprint.
//
// Idempotência (Sprint D7): a tabela dedicada `asaas_webhook_events` (id textual do
// evento do Asaas como PRIMARY KEY) substitui o dedupe por SELECT-então-INSERT em
// `logs` — ver `tryClaimWebhookEvent` abaixo e
// supabase/migrations/20260717000000_asaas_webhook_idempotency.sql.

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
//
// Sprint D9: `logs.entity_id` é UUID (ver Sprint D8) e o eventId do Asaas não tem
// garantia de ser UUID (id textual do Asaas, ou o fallback "${event}:${nestedId}" que
// nunca é UUID por construção). Gravar eventId ali fazia o INSERT falhar na validação
// de tipo do Postgres — silenciosamente, porque o retorno `{ error }` nunca era lido
// (o supabase-js não lança exceção em erro do Postgrest por padrão). Correção: eventId
// passa a viajar dentro de `metadata` (JSONB, já existente, sem nova coluna/tabela) sob
// a chave `asaas_event_id`; `entity_id` permanece null para logs do webhook. O erro de
// escrita agora é lido e logado no console do servidor, sem derrubar o processamento.
async function recordAsaasLog(
  action: string,
  eventId: string | null,
  metadata: Record<string, any>,
) {
  try {
    const { error } = await supabaseAdmin.from("logs").insert({
      user_id: null,
      action,
      entity: "asaas_webhook",
      entity_id: null,
      metadata: { ...metadata, asaas_event_id: eventId },
    });
    if (error) {
      console.error(`[asaas webhook] falha ao gravar log (action="${action}"): ${error.message}`);
    }
  } catch (err) {
    // Falha de rede/infra ao gravar o log — nunca deixa o webhook falhar por causa disso;
    // o log é uma operação auxiliar, não deve bloquear ativação/renovação de assinatura.
    console.error(
      `[asaas webhook] exceção ao gravar log (action="${action}"): ${
        err instanceof Error ? err.message : "erro desconhecido"
      }`,
    );
  }
}

// --- Idempotência real, via tabela dedicada `asaas_webhook_events` (Sprint D7) ---
//
// INSERT ... ON CONFLICT DO NOTHING (upsert + ignoreDuplicates) reivindica o evento
// atomicamente: se outra requisição concorrente já reivindicou o mesmo event_id, o
// conflito é ignorado no próprio banco e nenhuma linha é retornada — sem depender de
// um SELECT prévio, que é onde a auditoria D6 encontrou a condição de corrida.
// A reivindicação acontece ANTES do processamento (não depois), então um evento só é
// considerado "processado" quando garantidamente nenhuma outra entrega dele está em
// andamento — não quando o processamento termina.
async function tryClaimWebhookEvent(eventId: string, eventName: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("asaas_webhook_events")
    .upsert(
      { event_id: eventId, event_name: eventName },
      { onConflict: "event_id", ignoreDuplicates: true },
    )
    .select("event_id");

  if (error) {
    // Falha na checagem: preferimos arriscar reprocessar (os handlers abaixo são
    // idempotentes por natureza — upsert por user_id+distribution_id) a perder o evento.
    await recordAsaasLog("asaas.webhook.error", eventId, {
      stage: "idempotency_claim",
      message: error.message,
    });
    return true;
  }

  return (data?.length ?? 0) > 0;
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
    .select("id, status, starts_at")
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

  // Upsert único (INSERT ... ON CONFLICT DO UPDATE) no lugar do INSERT/UPDATE
  // condicionados ao SELECT acima — a decisão de criar vs. atualizar deixa de
  // depender de dois passos separados e passa a ser resolvida atomicamente
  // pela unique index já existente em subscriptions(user_id, distribution_id)
  // (ver supabase/migrations/20260705000000_subscriptions_distribution.sql),
  // eliminando a janela de corrida em que duas execuções concorrentes viam
  // "não existe" e tentavam inserir duas linhas. `starts_at` é reaproveitado
  // da leitura acima para preservar a data original de início em renovações.
  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      distribution_id: distributionId,
      status: "ACTIVE",
      starts_at: existing?.starts_at ?? new Date().toISOString(),
      expires_at: expiresAt,
    },
    { onConflict: "user_id,distribution_id" },
  );
  if (error) throw error;

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

  if (!(await tryClaimWebhookEvent(eventId, payload.event))) {
    return;
  }

  await recordAsaasLog("asaas.webhook.received", eventId, { event: payload.event });

  // Bug G5.2: uma exceção não tratada dentro do switch (ex.: o 42P10 corrigido nesta
  // mesma sprint) escapava sem deixar nenhum rastro em `logs` — só "received" ficava
  // gravado, e a investigação dependia inteiramente dos logs da Vercel. Este try/catch
  // só adiciona uma rede de observabilidade: grava o erro antes de relançar, sem mudar
  // o status HTTP devolvido (a rota já trata a exceção relançada do mesmo jeito) e sem
  // tocar na reivindicação de idempotência (o evento já foi marcado como reivindicado
  // antes deste ponto — pendência documentada, não resolvida aqui).
  try {
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
            message:
              error instanceof Error ? error.message : "falha ao cancelar assinatura no Asaas",
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
        // Cria o vínculo local sem liberar acesso — a ativação real só acontece em
        // PAYMENT_CONFIRMED/PAYMENT_RECEIVED. ON CONFLICT DO NOTHING (upsert +
        // ignoreDuplicates) no lugar do SELECT-então-INSERT anterior: se o vínculo já
        // existir (inclusive por uma entrega concorrente deste mesmo evento), o
        // conflito é ignorado atomicamente pelo banco em vez de arriscar duas linhas.
        const { error: createError } = await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: ref.userId,
            distribution_id: ref.distributionId,
            status: "INACTIVE",
            starts_at: new Date().toISOString(),
            expires_at: null,
          },
          { onConflict: "user_id,distribution_id", ignoreDuplicates: true },
        );
        if (createError) throw createError;
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
  } catch (error) {
    await recordAsaasLog("asaas.webhook.error", eventId, {
      stage: "unhandled_exception",
      message: error instanceof Error ? error.message : "erro desconhecido ao processar evento",
    });
    throw error;
  }
}
