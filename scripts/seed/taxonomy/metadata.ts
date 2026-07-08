export const SEED_ENGINE_NAME = "SimulaPro Seed Engine";
export const DEFAULT_TAXONOMY_DESCRIPTION = "Taxonomia oficial do SimulaPro";
export const DEFAULT_TAXONOMY_VERSION = "1.0.0";

export type SeedEnvironment = "production" | "homolog" | "development";

export function resolveSeedEnvironment(): SeedEnvironment {
  const raw = process.env.SEED_ENVIRONMENT?.trim().toLowerCase();
  if (raw === "production" || raw === "homolog" || raw === "development") return raw;
  if (process.env.NODE_ENV === "production") return "production";
  return "development";
}

export function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }));
}
