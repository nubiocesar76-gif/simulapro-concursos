// Server-only. Encodes/decodes the correlation key stored in Asaas' `externalReference`
// field. This is how a webhook event is mapped back to a local (user_id, distribution_id)
// pair without adding any new column to `subscriptions` — no migration required.
//
// The encode side (buildExternalReference) is meant to be used by the future checkout
// flow (Sprint 4.2D) when creating the Asaas customer/subscription; the decode side
// (parseExternalReference) is used by the webhook handler right now.

const PREFIX = "simulapro";
const CUSTOMER_PREFIX = "simulapro-customer";

export function buildExternalReference(userId: string, distributionId: string): string {
  return `${PREFIX}:${userId}:${distributionId}`;
}

export type ParsedExternalReference = {
  userId: string;
  distributionId: string;
};

export function parseExternalReference(
  value: string | null | undefined,
): ParsedExternalReference | null {
  if (!value) return null;
  const parts = value.split(":");
  if (parts.length !== 3 || parts[0] !== PREFIX) return null;
  const [, userId, distributionId] = parts;
  if (!userId || !distributionId) return null;
  return { userId, distributionId };
}

// Referência do cliente (Asaas customer) é um formato à parte, com prefixo distinto,
// para nunca ser confundida com a referência de assinatura acima ao decodificar.
export function buildCustomerExternalReference(userId: string): string {
  return `${CUSTOMER_PREFIX}:${userId}`;
}
