/**
 * Utilitários do módulo Pacotes.
 */

export const PACKAGE_STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const;
export type PackageStatus = (typeof PACKAGE_STATUS_OPTIONS)[number];

export const PACKAGE_STATUS_LABELS: Record<PackageStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  ARCHIVED: "Arquivado",
};

export function generatePackageSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function validatePackageName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome é obrigatório.");
  if (trimmed.length < 2) throw new Error("Nome deve ter pelo menos 2 caracteres.");
  if (trimmed.length > 200) throw new Error("Nome deve ter no máximo 200 caracteres.");
  return trimmed;
}

export function validatePackageDescription(description: string) {
  const trimmed = description.trim();
  if (trimmed.length > 2000) throw new Error("Descrição deve ter no máximo 2000 caracteres.");
  return trimmed || null;
}

export function formatPackageError(message: string) {
  if (message.includes("row-level security")) {
    return "Sem permissão para esta operação. Verifique se seu usuário possui role admin.";
  }
  if (message.includes("duplicate key") || message.includes("unique")) {
    return "Já existe um pacote com este nome neste curso.";
  }
  return message;
}
