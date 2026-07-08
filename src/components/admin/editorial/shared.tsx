import { createContext, useContext } from "react";
import type { Tables } from "@/integrations/supabase/types";
import type { EditorialScope } from "@/lib/editorial/scope";

export type EditorialArchitecture = Tables<"editorial_architectures">;
export type EditorialDiscipline = Tables<"editorial_disciplines">;
export type EditorialTopic = Tables<"editorial_topics">;
export type EditorialKeyword = Tables<"editorial_keywords">;
export type EditorialRule = Tables<"editorial_rules">;
export type EditorialEvidence = Tables<"editorial_evidence">;

type EditorialContextValue = {
  scope: EditorialScope;
  architectureId: string | null;
  setArchitectureId: (id: string | null) => void;
};

const EditorialContext = createContext<EditorialContextValue | null>(null);

export function EditorialProvider({
  value,
  children,
}: {
  value: EditorialContextValue;
  children: React.ReactNode;
}) {
  return <EditorialContext.Provider value={value}>{children}</EditorialContext.Provider>;
}

export function useEditorialContext() {
  const ctx = useContext(EditorialContext);
  if (!ctx) {
    throw new Error("useEditorialContext deve ser usado dentro de EditorialProvider.");
  }
  return ctx;
}

export function slugifyEditorial(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function formatEditorialError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Erro inesperado.";
}

const ARCHITECTURE_STATUS_LABELS: Record<EditorialArchitecture["status"], string> = {
  PROPOSTO: "Proposto",
  EM_REVISAO: "Em revisão",
  APROVADO: "Aprovado",
  PUBLICADO: "Publicado",
  DEPRECIADO: "Depreciado",
};

export function architectureStatusLabel(status: EditorialArchitecture["status"]) {
  return ARCHITECTURE_STATUS_LABELS[status] ?? status;
}
