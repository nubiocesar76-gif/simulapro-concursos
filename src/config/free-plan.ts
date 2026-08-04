// Sprint G6.0 — Plano Free. Estendido (agosto/2026) para multicargo: cada cargo elegível
// tem sua própria distribuição "Primeiro Simulado Grátis", com uma amostra curada de
// questões reais e já publicadas daquele cargo (cópias, não as questões originais do
// acervo pago — mesmo padrão usado desde a origem para o Enfermeiro). Não é um plano
// comercial (não vende, não passa pelo Asaas, não tem checkout), por isso fica fora de
// `COMMERCIAL_PLANS` — que é especificamente o catálogo de planos vendáveis.
export const FREE_PLAN_DISTRIBUTION_BY_POSITION: Record<string, string> = {
  enfermeiro: "356638a1-d7b9-4be7-930d-b5dc3861c7ac", // Primeiro Simulado Grátis
  "tecnico-em-enfermagem": "704c71bd-34f4-4120-879e-ec4d21686190", // Primeiro Simulado Grátis - Técnico
};

/** Cargos elegíveis ao Plano Free — hoje, todo cargo com distribuição Free própria. */
export const FREE_PLAN_POSITION_SLUGS = Object.keys(FREE_PLAN_DISTRIBUTION_BY_POSITION);

/** Todas as distribuições Free existentes (qualquer cargo) — usado por checagens que não têm o cargo em mãos ainda. */
export const FREE_PLAN_DISTRIBUTION_IDS = Object.values(FREE_PLAN_DISTRIBUTION_BY_POSITION);

export function getFreePlanDistributionId(positionSlug: string): string | undefined {
  return FREE_PLAN_DISTRIBUTION_BY_POSITION[positionSlug];
}

/** Cargo dono de uma distribuição Free, ou undefined se `distributionId` não for uma delas. */
export function getPositionSlugForFreeDistribution(distributionId: string): string | undefined {
  return Object.entries(FREE_PLAN_DISTRIBUTION_BY_POSITION).find(
    ([, id]) => id === distributionId,
  )?.[0];
}
