/**
 * Utilitários do módulo Distribuições de Conteúdo.
 */

export const DISTRIBUTION_STATUS_EDITABLE = ["ACTIVE", "INACTIVE"] as const;
export const DISTRIBUTION_STATUS_ALL = ["ACTIVE", "INACTIVE", "SCHEDULED", "EXPIRED"] as const;

export type DistributionStatusEditable = (typeof DISTRIBUTION_STATUS_EDITABLE)[number];
export type DistributionStatus = (typeof DISTRIBUTION_STATUS_ALL)[number];

export const DISTRIBUTION_STATUS_LABELS: Record<DistributionStatus, string> = {
  ACTIVE: "Ativa",
  INACTIVE: "Inativa",
  SCHEDULED: "Agendada",
  EXPIRED: "Expirada",
};

export function validateDistributionName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome é obrigatório.");
  if (trimmed.length < 2) throw new Error("Nome deve ter pelo menos 2 caracteres.");
  if (trimmed.length > 200) throw new Error("Nome deve ter no máximo 200 caracteres.");
  return trimmed;
}

export function validateDistributionDescription(description: string) {
  const trimmed = description.trim();
  if (trimmed.length > 2000) throw new Error("Descrição deve ter no máximo 2000 caracteres.");
  return trimmed || null;
}

export function validateDistributionDates(availableFrom: string, availableUntil: string) {
  const from = availableFrom.trim() ? new Date(availableFrom).toISOString() : null;
  const until = availableUntil.trim() ? new Date(availableUntil).toISOString() : null;

  if (availableFrom.trim() && Number.isNaN(new Date(availableFrom).getTime())) {
    throw new Error("Data inicial inválida.");
  }
  if (availableUntil.trim() && Number.isNaN(new Date(availableUntil).getTime())) {
    throw new Error("Data final inválida.");
  }
  if (from && until && new Date(until) <= new Date(from)) {
    throw new Error("Data final deve ser posterior à data inicial.");
  }

  return { available_from: from, available_until: until };
}

export function formatDistributionError(message: string) {
  if (message.includes("row-level security")) {
    return "Sem permissão para esta operação. Verifique se seu usuário possui role admin.";
  }
  if (message.includes("Somente versões publicadas")) {
    return "Somente versões publicadas podem ser distribuídas.";
  }
  if (message.includes("content_distributions_dates_check")) {
    return "Data final deve ser posterior à data inicial.";
  }
  return message;
}
