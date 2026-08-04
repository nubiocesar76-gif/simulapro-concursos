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
  /**
   * Slugs de `positions` (tabela `positions.slug`) elegíveis para este plano.
   * Único ponto hoje que amarra plano comercial a cargo — não existe coluna de
   * cargo em `subscriptions`/`packages`/`content_distributions`. Se uma
   * distribuição futura precisar vender cargos por outro critério que não o
   * plano, este modelo precisará ser revisto (ver DIAGNOSTICO_ISOLAMENTO_CARGO_FLUXO_ALUNO_V1.md).
   */
  positionSlugs: string[];
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
    positionSlugs: ["enfermeiro"],
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
    positionSlugs: ["enfermeiro"],
    value: 39.9,
    cycle: "MONTHLY",
    billingType: "UNDEFINED",
    accessDurationMonths: 1,
  },
  // Cargo Técnico de Enfermagem (jornada multiárea/multicargo — agosto/2026). Deliberadamente
  // NÃO criamos uma "família" de planos por cargo (ex.: nomes/labels específicos por cargo) —
  // o rótulo exibido ao aluno é o mesmo conceito genérico de recorrência ("Mensal") já usado
  // para o Enfermeiro, porque a etapa de escolha de cargo (courses/positions reais, ver
  // SubscriptionPage.tsx) já deu o contexto antes de chegar aqui. O cargo em si é resolvido
  // só por `positionSlugs`/`distributionId`, exatamente como os planos de Enfermeiro acima.
  {
    id: "tecnico-fundador",
    label: "Plano Fundador",
    description:
      "Acesso completo ao Acervo Técnico em Enfermagem por um ciclo de 6 meses. Vagas limitadas da primeira leva, sem cobrança automática — você decide se renova ao final do ciclo.",
    distributionId: "3fbbfa90-2a67-4bdb-be6a-1a11ba0fec06", // Distribuição RC1 - Técnico em Enfermagem (ACTIVE)
    positionSlugs: ["tecnico-em-enfermagem"],
    value: 149.9,
    cycle: "MONTHLY",
    billingType: "UNDEFINED",
    accessDurationMonths: 6,
  },
  {
    id: "tecnico-mensal",
    label: "Mensal",
    description: "Acesso completo ao banco de questões do Técnico de Enfermagem durante 30 dias.",
    distributionId: "3fbbfa90-2a67-4bdb-be6a-1a11ba0fec06", // Distribuição RC1 - Técnico em Enfermagem (ACTIVE)
    positionSlugs: ["tecnico-em-enfermagem"],
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

/**
 * Planos comerciais elegíveis para um cargo (`positions.slug`). Usado pela tela de
 * assinatura depois que o aluno já escolheu Área (courses) → Cargo (positions) via
 * consulta real ao banco — este arquivo nunca é a fonte da lista de áreas/cargos,
 * só decide quais planos existem para o cargo já escolhido (ver
 * PLANO_TECNICO_MULTIAREA_MULTICARGO_V1.md, Ajuste 2).
 */
export function getPlansForPosition(positionSlug: string): CommercialPlan[] {
  return COMMERCIAL_PLANS.filter((plan) => plan.positionSlugs.includes(positionSlug));
}

/**
 * União dos `positionSlugs` de todos os planos comerciais que apontam para
 * esta distribuição. Array vazio significa "nenhum plano comercial mapeado
 * para esta distribuição" — quem consome este retorno decide como tratar
 * esse caso (hoje: sem restrição adicional, ver `getAllowedPositionIdsForDistribution`
 * em `src/lib/study-session.ts`).
 */
export function getAllowedPositionSlugsForDistribution(distributionId: string): string[] {
  const slugs = new Set<string>();
  for (const plan of COMMERCIAL_PLANS) {
    if (plan.distributionId === distributionId) {
      for (const slug of plan.positionSlugs) slugs.add(slug);
    }
  }
  return [...slugs];
}
