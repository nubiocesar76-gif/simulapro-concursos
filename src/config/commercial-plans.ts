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
};

// Vazio por padrão — a equipe adiciona os planos reais antes de abrir vendas.
export const COMMERCIAL_PLANS: CommercialPlan[] = [];

export function findCommercialPlan(planId: string): CommercialPlan | undefined {
  return COMMERCIAL_PLANS.find((plan) => plan.id === planId);
}
