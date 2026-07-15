// Catálogo de planos comerciais vendáveis (Fase 4 — V1 Comercial).
// Preço, nome comercial e quais distribuições entram em cada plano são decisão da
// equipe (ver docs/COMMERCIAL_V1_ROADMAP.md seção 2) — nenhum valor é inventado aqui.
// Centralizado em código (sem tabela nova) porque o schema atual não tem coluna de preço.
//
// Cada plano aponta para uma `content_distribution` já existente (id em `distributionId`).
// Preencher esta lista é um passo manual da equipe antes do lançamento comercial.

import type {
  AsaasBillingType,
  AsaasSubscriptionCycle,
} from "@/integrations/asaas/AsaasService.server";

export type CommercialPlan = {
  id: string;
  label: string;
  description: string;
  distributionId: string;
  /** Valor em reais (não centavos), no formato que a API do Asaas espera. */
  value: number;
  cycle: AsaasSubscriptionCycle;
  billingType: AsaasBillingType;
  /**
   * Duração real do ciclo de acesso vendido, em meses (decisão comercial —
   * ver docs/commercial/P0_IMPLEMENTATION_PLAN.md, Sprint P0.1/P0.3).
   * É a fonte de verdade para calcular `expires_at` do aluno — não usar o
   * `nextDueDate` nativo do Asaas para isso, pois `cycle` acima é só o
   * veículo de cobrança inicial (a assinatura Asaas é cancelada logo após
   * o primeiro pagamento confirmado, conforme Sprint P0.3).
   */
  accessDurationMonths: number;
};

// Decisão comercial aprovada em 2026-07-14 (Fase 8, Sprint P0.1) — única
// referência oficial de preço/duração do Plano Fundador. Ver
// docs/commercial/P0_IMPLEMENTATION_PLAN.md.
export const COMMERCIAL_PLANS: CommercialPlan[] = [
  {
    id: "plano-fundador",
    label: "Plano Fundador",
    description:
      "Acesso completo ao Acervo Enfermeiro por um ciclo de 6 meses. Vagas limitadas da primeira leva, sem cobrança automática — você decide se renova ao final do ciclo.",
    distributionId: "1b527a9e-eb48-4ad5-b6b5-c480dd894eb3", // Distribuição RC1 - Enfermagem (ACTIVE)
    value: 149.9,
    cycle: "MONTHLY",
    billingType: "UNDEFINED",
    accessDurationMonths: 6,
  },
  {
    id: "plano-mensal",
    label: "Plano Mensal",
    description: "Acesso completo ao banco de questões durante 30 dias.",
    distributionId: "1b527a9e-eb48-4ad5-b6b5-c480dd894eb3", // Distribuição RC1 - Enfermagem (ACTIVE)
    value: 39.9,
    cycle: "MONTHLY",
    billingType: "UNDEFINED",
    accessDurationMonths: 1,
  },
];

export function findCommercialPlan(planId: string): CommercialPlan | undefined {
  return COMMERCIAL_PLANS.find((plan) => plan.id === planId);
}

export function findCommercialPlanByDistributionId(
  distributionId: string,
): CommercialPlan | undefined {
  return COMMERCIAL_PLANS.find((plan) => plan.distributionId === distributionId);
}
