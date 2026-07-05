/** Utilitários de UI compartilhados do Portal Admin (Sprint 7F). */

export function formatAdminError(message: string) {
  if (message.includes("row-level security")) {
    return "Sem permissão para esta operação. Verifique se seu usuário possui role admin.";
  }
  if (message.includes("duplicate key") || message.includes("unique")) {
    return "Registro duplicado. Verifique os dados informados.";
  }
  return message;
}
