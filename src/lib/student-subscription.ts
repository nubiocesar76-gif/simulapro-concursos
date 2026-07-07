// Leitura client-safe das assinaturas do próprio aluno (RLS já restringe a linhas
// próprias) + helpers de exibição. Nenhuma chamada ao Asaas acontece aqui — isso é
// exclusivo dos server functions em `student-subscription.functions.ts`.

import { supabase } from "@/integrations/supabase/client";
import type { AsaasDisplayStatus, AsaasLiveStatus } from "@/lib/student-subscription.functions";

export type MySubscriptionRow = {
  id: string;
  status: "ACTIVE" | "INACTIVE";
  starts_at: string;
  expires_at: string | null;
  distribution_id: string;
  distribution_name: string;
  package_name: string;
  course_name: string;
};

export async function fetchMySubscriptions(userId: string): Promise<MySubscriptionRow[]> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      id,
      status,
      starts_at,
      expires_at,
      distribution_id,
      content_distributions!inner(
        name,
        package_versions(
          packages(name, courses(name))
        )
      )
    `,
    )
    .eq("user_id", userId)
    .not("distribution_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const dist = row.content_distributions as unknown as {
      name: string;
      package_versions: {
        packages: { name: string; courses: { name: string } | null } | null;
      } | null;
    } | null;

    return {
      id: row.id,
      status: row.status as "ACTIVE" | "INACTIVE",
      starts_at: row.starts_at,
      expires_at: row.expires_at,
      distribution_id: row.distribution_id as string,
      distribution_name: dist?.name ?? "—",
      package_name: dist?.package_versions?.packages?.name ?? "—",
      course_name: dist?.package_versions?.packages?.courses?.name ?? "—",
    };
  });
}

export type DisplayStatus =
  "Ativa" | "Aguardando pagamento" | "Cancelada" | "Expirada" | "Em atraso";

// Acesso continua governado só por `status` local (ACTIVE/INACTIVE) — esta função é
// puramente de exibição, combinando o dado local com o que o Asaas responde ao vivo.
export function resolveDisplayStatus(
  localStatus: "ACTIVE" | "INACTIVE",
  localExpiresAt: string | null,
  live: AsaasLiveStatus | undefined,
): DisplayStatus {
  if (localStatus === "ACTIVE") {
    if (localExpiresAt && new Date(localExpiresAt) < new Date()) return "Expirada";
    if (live?.displayStatus === "EM_ATRASO") return "Em atraso";
    return "Ativa";
  }
  if (live?.displayStatus === "AGUARDANDO_PAGAMENTO") return "Aguardando pagamento";
  return "Cancelada";
}

export function displayStatusBadgeVariant(
  status: DisplayStatus,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "Ativa") return "default";
  if (status === "Aguardando pagamento") return "secondary";
  if (status === "Em atraso") return "destructive";
  return "outline";
}

const BILLING_TYPE_LABELS: Record<string, string> = {
  BOLETO: "Boleto",
  CREDIT_CARD: "Cartão de crédito",
  PIX: "Pix",
  UNDEFINED: "A definir no pagamento",
};

export function formatBillingType(billingType: string | null): string {
  if (!billingType) return "—";
  return BILLING_TYPE_LABELS[billingType] ?? billingType;
}

export function formatDueDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

export type { AsaasDisplayStatus, AsaasLiveStatus };
