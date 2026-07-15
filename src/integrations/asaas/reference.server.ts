// Server-only. Encodes/decodes the correlation key stored in Asaas' `externalReference`
// field. This is how a webhook event is mapped back to a local (user_id, distribution_id,
// plan_id) tuple without adding any new column to `subscriptions` — no migration required.
//
// The encode side (buildExternalReference) is used by the checkout flow
// (student-subscription.functions.ts) when creating the Asaas customer/subscription; the
// decode side (parseExternalReference) is used by the webhook handler.
//
// Formato atual (Sprint P0.5A): "simulapro:{userId}:{distributionId}:{planId}" — o planId
// foi adicionado para que o webhook resolva o plano comercial pelo que foi de fato
// comprado, não pela distribuição (que pode ser compartilhada por mais de um plano).
// O formato legado de 3 segmentos (sem planId) ainda é aceito na leitura, para não
// quebrar assinaturas já criadas no Asaas antes desta mudança — `planId` volta
// `undefined` nesse caso, e quem consome o retorno decide como tratar essa ausência.

const PREFIX = "simulapro";
const CUSTOMER_PREFIX = "simulapro-customer";

export function buildExternalReference(
  userId: string,
  distributionId: string,
  planId: string,
): string {
  return `${PREFIX}:${userId}:${distributionId}:${planId}`;
}

export type ParsedExternalReference = {
  userId: string;
  distributionId: string;
  planId?: string;
};

export function parseExternalReference(
  value: string | null | undefined,
): ParsedExternalReference | null {
  if (!value) return null;
  const parts = value.split(":");
  if (parts[0] !== PREFIX) return null;

  if (parts.length === 4) {
    const [, userId, distributionId, planId] = parts;
    if (!userId || !distributionId || !planId) return null;
    return { userId, distributionId, planId };
  }

  // Formato legado (pré Sprint P0.5A), sem planId.
  if (parts.length === 3) {
    const [, userId, distributionId] = parts;
    if (!userId || !distributionId) return null;
    return { userId, distributionId };
  }

  return null;
}

// Referência do cliente (Asaas customer) é um formato à parte, com prefixo distinto,
// para nunca ser confundida com a referência de assinatura acima ao decodificar.
export function buildCustomerExternalReference(userId: string): string {
  return `${CUSTOMER_PREFIX}:${userId}`;
}
