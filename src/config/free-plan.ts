// Sprint G6.0 — Plano Free.
//
// Reaproveita a distribuição "Primeiro Simulado Grátis" já criada no Portal Admin
// (Sprint P1.5). Não é um plano comercial (não vende, não passa pelo Asaas, não tem
// checkout), por isso fica fora de `COMMERCIAL_PLANS` — que é especificamente o
// catálogo de planos vendáveis.
export const FREE_PLAN_DISTRIBUTION_ID = "356638a1-d7b9-4be7-930d-b5dc3861c7ac"; // Primeiro Simulado Grátis

// Cargo(s) liberados pelo Plano Free. Antes desta constante existir, a ausência do Free em
// `COMMERCIAL_PLANS` fazia `getAllowedPositionIdsForDistribution` tratá-lo como "sem
// restrição" (ver PLANO_TECNICO_MULTIAREA_MULTICARGO_V1.md) — hoje as 20 questões do pacote
// Demo são só de Enfermeiro, então isso nunca vazou nada, mas era uma lacuna estrutural.
// Fica explícito aqui: o Free permanece só-Enfermeiro até uma decisão comercial em contrário
// (ex.: um Free dedicado para o Técnico, com sua própria distribuição).
export const FREE_PLAN_POSITION_SLUGS = ["enfermeiro"];
