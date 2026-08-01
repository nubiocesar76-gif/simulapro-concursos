/**
 * Publicação Editorial — convergência para o acervo real (Sprint 7.1A, IA-007).
 *
 * Para cada ciclo `APROVADO_EDITORIAL` informado: resolve a taxonomia real
 * (subjects/topics) por nome a partir da disciplina/assunto editorial;
 * publica automaticamente só quando a resolução é inequívoca; em qualquer
 * outro caso, bloqueia SÓ aquela questão (o ciclo continua
 * `APROVADO_EDITORIAL`, nada é perdido, pode ser tentado de novo depois de
 * ajustar a taxonomia real). Nunca cria `subjects`/`topics` novos. Sempre
 * registra a decisão (`editorial_ai_decisions`) e a publicação
 * (`editorial_ai_publications`), ambas infraestrutura já existente.
 *
 * Uso:
 *   npm run editorial:publish -- \
 *     --cycle-id <uuid> [--cycle-id <uuid> ...] \
 *     --package-id <uuid> --package-version-id <uuid> \
 *     --actor-user-id <uuid>
 */
import { loadEnv, projectRoot } from "../seed/core/env.ts";

function parseArgs(argv: string[]): {
  cycleIds: string[];
  packageId: string;
  packageVersionId: string;
  actorUserId: string;
} {
  const cycleIds: string[] = [];
  let packageId: string | undefined;
  let packageVersionId: string | undefined;
  let actorUserId: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--cycle-id") {
      cycleIds.push(argv[++i]);
    } else if (arg === "--package-id") {
      packageId = argv[++i];
    } else if (arg === "--package-version-id") {
      packageVersionId = argv[++i];
    } else if (arg === "--actor-user-id") {
      actorUserId = argv[++i];
    }
  }

  const missing = [
    ["--cycle-id (ao menos um)", cycleIds.length ? "x" : undefined],
    ["--package-id", packageId],
    ["--package-version-id", packageVersionId],
    ["--actor-user-id", actorUserId],
  ].filter(([, v]) => !v);
  if (missing.length) {
    throw new Error(
      `Argumentos obrigatórios ausentes: ${missing.map(([flag]) => flag).join(", ")}.`,
    );
  }

  return {
    cycleIds,
    packageId: packageId!,
    packageVersionId: packageVersionId!,
    actorUserId: actorUserId!,
  };
}

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const { convergeEditorialCycleToAcervo } =
    await import("../../src/lib/editorial-ai/publish/convergence.server.ts");

  const { cycleIds, packageId, packageVersionId, actorUserId } = parseArgs(process.argv.slice(2));

  console.log(
    `Publicando ${cycleIds.length} ciclo(s) contra package_version_id=${packageVersionId}`,
  );

  let converged = 0;
  let blocked = 0;
  for (const cycleId of cycleIds) {
    const result = await convergeEditorialCycleToAcervo({
      cycleId,
      packageId,
      packageVersionId,
      actorUserId,
    });
    if (result.outcome === "CONVERGED") {
      converged++;
      console.log(`  [CONVERGED] ${cycleId} -> questions.id=${result.questionId}`);
    } else {
      blocked++;
      console.log(`  [BLOCKED]   ${cycleId} -> ${result.reason}`);
    }
  }

  console.log("\n=== Relatório final ===");
  console.log(`Convergidas: ${converged}`);
  console.log(`Bloqueadas (taxonomia ambígua, ciclo permanece APROVADO_EDITORIAL): ${blocked}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
