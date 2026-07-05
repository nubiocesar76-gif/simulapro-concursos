/**
 * Utilitários do módulo Versões.
 */

export const VERSION_STATUS_EDITABLE = ["DRAFT", "READY"] as const;
export const VERSION_STATUS_ALL = ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"] as const;

export type VersionStatusEditable = (typeof VERSION_STATUS_EDITABLE)[number];
export type VersionStatus = (typeof VERSION_STATUS_ALL)[number];

export const VERSION_STATUS_LABELS: Record<VersionStatus, string> = {
  DRAFT: "Rascunho",
  READY: "Pronta",
  PUBLISHED: "Publicada",
  ARCHIVED: "Arquivada",
};

const SEMVER_PATTERN = /^\d+\.\d+(?:\.\d+)?$/;

export function validateVersionNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("Número da versão é obrigatório.");
  if (!SEMVER_PATTERN.test(trimmed)) {
    throw new Error("Número inválido. Use formato semântico (ex.: 1.0, 1.1, 2026.1).");
  }
  return trimmed;
}

export function validateVersionName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome é obrigatório.");
  if (trimmed.length < 2) throw new Error("Nome deve ter pelo menos 2 caracteres.");
  if (trimmed.length > 200) throw new Error("Nome deve ter no máximo 200 caracteres.");
  return trimmed;
}

export function validateVersionDescription(description: string) {
  const trimmed = description.trim();
  if (trimmed.length > 2000) throw new Error("Descrição deve ter no máximo 2000 caracteres.");
  return trimmed || null;
}

export function validateReleaseNotes(notes: string) {
  const trimmed = notes.trim();
  if (trimmed.length > 5000) throw new Error("Notas de release devem ter no máximo 5000 caracteres.");
  return trimmed || null;
}

export function formatVersionError(message: string) {
  if (message.includes("row-level security")) {
    return "Sem permissão para esta operação. Verifique se seu usuário possui role admin.";
  }
  if (message.includes("duplicate key") || message.includes("unique")) {
    return "Já existe uma versão com este número neste pacote.";
  }
  return message;
}
