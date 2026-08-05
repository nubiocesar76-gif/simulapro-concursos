// Catálogo de planos comerciais vendáveis (Fase 4 — V1 Comercial).
// Modelo escalável (agosto/2026): o aluno assina acesso à plataforma SimulaPro —
// não a um cargo específico. Após o login, escolhe o concurso/cargo que deseja estudar.
// Novos cargos entram via catálogo interno; a Landing Page e estes planos permanecem iguais.

import type {
  AsaasBillingType,
  AsaasSubscriptionCycle,
} from "@/integrations/asaas/AsaasService.server";

export type CommercialPlan = {
  id: string;
  label: string;
  description: string;
  /**
   * Distribuição padrão (retrocompatibilidade com referências legadas).
   * Preferir `getPlanDistributionId(plan, positionSlug)` no checkout.
   */
  distributionId: string;
  /**
   * Mapeia cargo (`positions.slug`) → `content_distribution.id` ativada no pagamento.
   * Permite um único plano comercial servir todos os cargos atuais e futuros adicionados aqui.
   */
  distributionByPosition: Record<string, string>;
  /** Cargos elegíveis — hoje Enfermeiro e Técnico; expandir ao adicionar novas distribuições. */
  positionSlugs: string[];
  value: number;
  cycle: AsaasSubscriptionCycle;
  billingType: AsaasBillingType;
  accessDurationMonths: number;
};

const ENFERMEIRO_DISTRIBUTION = "1b527a9e-eb48-4ad5-b6b5-c480dd894eb3";
const TECNICO_DISTRIBUTION = "3fbbfa90-2a67-4bdb-be6a-1a11ba0fec06";

const PLATFORM_POSITION_SLUGS = ["enfermeiro", "tecnico-em-enfermagem"] as const;

const PLATFORM_DISTRIBUTION_BY_POSITION: Record<string, string> = {
  enfermeiro: ENFERMEIRO_DISTRIBUTION,
  "tecnico-em-enfermagem": TECNICO_DISTRIBUTION,
};

export const COMMERCIAL_PLANS: CommercialPlan[] = [
  {
    id: "plano-fundador",
    label: "Plano Semestral",
    description:
      "Melhor custo-benefício para quem quer estudar com tranquilidade. Acesso completo por 6 meses a todos os concursos disponíveis.",
    distributionId: ENFERMEIRO_DISTRIBUTION,
    distributionByPosition: { ...PLATFORM_DISTRIBUTION_BY_POSITION },
    positionSlugs: [...PLATFORM_POSITION_SLUGS],
    value: 149.9,
    cycle: "MONTHLY",
    billingType: "UNDEFINED",
    accessDurationMonths: 6,
  },
  {
    id: "plano-mensal",
    label: "Plano Mensal",
    description:
      "Ideal para quem deseja começar agora. Acesso completo a todos os concursos disponíveis durante sua assinatura, sem fidelidade.",
    distributionId: ENFERMEIRO_DISTRIBUTION,
    distributionByPosition: { ...PLATFORM_DISTRIBUTION_BY_POSITION },
    positionSlugs: [...PLATFORM_POSITION_SLUGS],
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
  return COMMERCIAL_PLANS.find(
    (plan) =>
      plan.distributionId === distributionId ||
      Object.values(plan.distributionByPosition).includes(distributionId),
  );
}

export function getPlanDistributionId(plan: CommercialPlan, positionSlug: string): string {
  return plan.distributionByPosition[positionSlug] ?? plan.distributionId;
}

export function getAllCommercialDistributionIds(): string[] {
  const ids = new Set<string>();
  for (const plan of COMMERCIAL_PLANS) {
    ids.add(plan.distributionId);
    for (const id of Object.values(plan.distributionByPosition)) ids.add(id);
  }
  return [...ids];
}

/** Planos comerciais elegíveis — iguais para todos os cargos da plataforma. */
export function getPlansForPosition(positionSlug: string): CommercialPlan[] {
  return COMMERCIAL_PLANS.filter((plan) => plan.positionSlugs.includes(positionSlug));
}

export function getAllowedPositionSlugsForDistribution(distributionId: string): string[] {
  const slugs = new Set<string>();
  for (const plan of COMMERCIAL_PLANS) {
    const matches =
      plan.distributionId === distributionId ||
      Object.values(plan.distributionByPosition).includes(distributionId);
    if (matches) {
      for (const slug of plan.positionSlugs) slugs.add(slug);
    }
  }
  return [...slugs];
}
