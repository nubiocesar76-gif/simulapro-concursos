/**
 * Utilitários do módulo Assinaturas.
 */

export const SUBSCRIPTION_STATUS_OPTIONS = ["ACTIVE", "INACTIVE"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS_OPTIONS)[number];

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: "Ativa",
  INACTIVE: "Inativa",
};

export function validateSubscriptionDates(startsAt: string, expiresAt: string) {
  const starts = startsAt.trim() ? new Date(startsAt).toISOString() : new Date().toISOString();
  const expires = expiresAt.trim() ? new Date(expiresAt).toISOString() : null;

  if (startsAt.trim() && Number.isNaN(new Date(startsAt).getTime())) {
    throw new Error("Data de início inválida.");
  }
  if (expiresAt.trim() && Number.isNaN(new Date(expiresAt).getTime())) {
    throw new Error("Data de expiração inválida.");
  }
  if (expires && new Date(expires) <= new Date(starts)) {
    throw new Error("Data de expiração deve ser posterior à data de início.");
  }

  return { starts_at: starts, expires_at: expires };
}

export function formatSubscriptionError(message: string) {
  if (message.includes("row-level security")) {
    return "Sem permissão para esta operação. Verifique se seu usuário possui role admin.";
  }
  if (message.includes("subscriptions_user_distribution_unique") || message.includes("duplicate key")) {
    return "Este usuário já possui assinatura para esta distribuição.";
  }
  if (message.includes("subscriptions_dates_check")) {
    return "Data de expiração deve ser posterior à data de início.";
  }
  return message;
}
