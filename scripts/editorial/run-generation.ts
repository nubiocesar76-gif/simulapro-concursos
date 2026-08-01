/**
 * Motor Editorial — CLI de geração (Etapa 8).
 *
 * Fluxo: content-selector (Etapa 3, modo manual) → difficulty-engine
 * (Etapa 4) → context-resolver (discipline-loader + board-loader, Etapas
 * 1-2) → orchestrator.generate() (prompt-composer + provider Claude +
 * response-parser + editorial-validator, Etapas 5-7), um ciclo por alvo.
 *
 * Nunca publica, nunca avança o estado do ciclo além de RASCUNHO_IA —
 * publicação/homologação são decisão humana (IA-006/007), fora de escopo.
 *
 * Uso:
 *   npm run editorial:generate -- \
 *     --discipline "Saúde do Idoso" --topic "Síndromes Geriátricas" \
 *     --subtopic "Quedas" --board FGV --level "Média" --quantity 10 \
 *     --actor-user-id <uuid de um auth.users real>
 *
 * --actor-user-id é obrigatório porque editorial_ai_batches.created_by
 * referencia auth.users(id) sem exceção (mesma regra de IA-006) — este
 * script nunca inventa ou usa um id fixo/fake.
 *
 * ---
 * Retomada automática (falha do provedor: créditos, timeout, erro temporário)
 *
 * Se `editorialAiOrchestrator.generate()` falhar no meio do processamento de
 * um alvo, o ciclo já criado fica "pendente": tem `editorial_ai_cycles`
 * (RASCUNHO_IA) e `editorial_ai_inputs`, mas nenhum `editorial_ai_contents`
 * — nada é perdido nem revertido, porque cada `create*` já é uma escrita
 * isolada e definitiva (arquitetura existente, não alterada aqui).
 *
 * Para retomar exatamente esse(s) ciclo(s) sem recriar nada:
 *   npm run editorial:generate -- --resume-batch-id <uuid do batch>
 *
 * Localiza automaticamente, dentro daquele batch, todo ciclo sem conteúdo
 * gerado e chama `orchestrator.generate()` de novo apenas para eles, usando
 * o `editorial_ai_inputs` já persistido (mesma banca/assunto/subassunto/
 * dificuldade/objetivo-estratégia do alvo original). Ciclo com conteúdo já
 * gerado, ou em qualquer status além de RASCUNHO_IA, é sempre pulado — nunca
 * regenerado, nunca duplicado. Ver função `resumeBatch` abaixo.
 */
import { loadEnv, projectRoot } from "../seed/core/env.ts";
import { supabaseAdmin } from "../../src/integrations/supabase/client.server.ts";
import { contentSelector } from "../../src/lib/editorial-ai/content-selector.server.ts";
import { buildDifficultyGuidance } from "../../src/lib/editorial-ai/difficulty-engine.ts";
import { editorialContextResolver } from "../../src/lib/editorial-ai/context-resolver.server.ts";
import {
  editorialAiBatchService,
  editorialAiCycleService,
  getEditorialAiInputByCycleId,
  getLatestEditorialAiContentByCycleId,
  listEditorialAiAnnotationsByCycleId,
} from "../../src/lib/editorial-ai/service.server.ts";
import type { EditorialDifficultyLevel } from "../../src/lib/editorial-ai/difficulty-engine.ts";
import type { EditorialAiOrchestrator } from "../../src/lib/editorial-ai/orchestrator.ts";
// orchestrator.server.ts instancia o ClaudeProvider (ANTHROPIC_*) no carregamento
// do módulo — importado dinamicamente abaixo, depois de loadEnv(), para que as
// variáveis de ambiente já estejam em process.env quando o módulo for avaliado.

type CliArgs = {
  discipline: string;
  topic: string;
  subtopic?: string;
  board: string;
  level: EditorialDifficultyLevel;
  quantity: number;
  actorUserId: string;
  course: string;
  position: string;
};

function parseArgs(argv: string[]): CliArgs {
  const map = new Map<string, string>();
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      map.set(key, value);
      i++;
    }
  }

  const discipline = map.get("discipline");
  const topic = map.get("topic");
  const board = map.get("board");
  const level = map.get("level") as EditorialDifficultyLevel | undefined;
  const quantity = Number(map.get("quantity") ?? "1");
  const actorUserId = map.get("actor-user-id");

  const missing = [
    ["--discipline", discipline],
    ["--topic", topic],
    ["--board", board],
    ["--level", level],
    ["--actor-user-id", actorUserId],
  ].filter(([, value]) => !value);
  if (missing.length) {
    throw new Error(
      `Argumentos obrigatórios ausentes: ${missing.map(([flag]) => flag).join(", ")}.`,
    );
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("--quantity deve ser um inteiro >= 1.");
  }

  return {
    discipline: discipline!,
    topic: topic!,
    subtopic: map.get("subtopic"),
    board: board!,
    level: level!,
    quantity,
    actorUserId: actorUserId!,
    course: map.get("course") ?? "Enfermagem",
    position: map.get("position") ?? "Enfermeiro",
  };
}

async function resolveIdByName(
  table: "boards" | "courses" | "positions",
  name: string,
): Promise<string> {
  const { data, error } = await supabaseAdmin.from(table).select("id, name").ilike("name", name);
  if (error) throw new Error(`Erro ao resolver ${table} "${name}": ${error.message}`);
  if (!data || data.length === 0)
    throw new Error(`Nenhum registro em ${table} com nome "${name}".`);
  if (data.length > 1) {
    throw new Error(
      `"${name}" casou com mais de um registro em ${table}: ${data.map((d) => d.name).join(", ")}.`,
    );
  }
  return data[0].id;
}

async function resolveActiveArchitectureId(): Promise<string | undefined> {
  const { data } = await supabaseAdmin
    .from("editorial_architectures")
    .select("id")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  return data?.id;
}

function extractResumeBatchId(argv: string[]): string | undefined {
  const index = argv.indexOf("--resume-batch-id");
  return index >= 0 ? argv[index + 1] : undefined;
}

/**
 * Único ponto que chama `orchestrator.generate()` — usado tanto pelo fluxo
 * normal (ciclo recém-criado) quanto pela retomada (ciclo já existente,
 * sem conteúdo). Nenhuma lógica do Motor Editorial em si: só monta o
 * `EditorialContext` e delega ao orchestrator já existente.
 */
async function runGenerationForCycle(
  orchestrator: EditorialAiOrchestrator,
  cycleId: string,
  batchId: string,
  target: {
    boardId: string;
    courseId: string;
    positionId: string;
    conceptTopicId?: string | null;
    conceptSubtopicId?: string | null;
    cognitiveObjective: string;
    strategy: string;
    difficultyInstruction: string;
  },
) {
  const editorialContext = await editorialContextResolver.resolve({
    boardId: target.boardId,
    courseId: target.courseId,
    positionId: target.positionId,
    conceptTopicId: target.conceptTopicId ?? undefined,
    conceptSubtopicId: target.conceptSubtopicId ?? undefined,
    cognitiveObjective: target.cognitiveObjective,
    strategy: target.strategy,
    difficultyInstruction: target.difficultyInstruction,
  });

  return orchestrator.generate({
    editorialContext,
    parameters: { cycleId, batchId },
    executionOptions: {},
  });
}

/**
 * Retomada automática de um batch existente. Localiza, dentro do batch, os
 * ciclos que ainda não têm `editorial_ai_contents` (o único sinal usado para
 * "pendente" — nenhuma coluna nova) e refaz apenas a chamada ao provedor
 * para eles, reconstruindo o alvo a partir do `editorial_ai_inputs` já
 * persistido. Nunca cria batch, nunca cria ciclo, nunca toca em ciclo que já
 * tem conteúdo ou que saiu de RASCUNHO_IA — idempotente por construção:
 * rodar duas vezes sobre o mesmo batch já concluído não faz nada na 2ª vez.
 */
async function resumeBatch(orchestrator: EditorialAiOrchestrator, resumeBatchId: string) {
  const batch = await editorialAiBatchService.getBatch(resumeBatchId);
  if (!batch) {
    throw new Error(`Batch não encontrado: ${resumeBatchId}`);
  }

  const cycles = await editorialAiCycleService.listCycles({ batchId: resumeBatchId });
  console.log(`Batch ${resumeBatchId} — ${cycles.length} ciclo(s) registrado(s).`);
  if (cycles.length === 0) {
    console.log("Nenhum ciclo neste batch ainda — nada para retomar.");
    return;
  }

  let skipped = 0;
  let resumed = 0;
  let stillPending = 0;

  for (const cycle of cycles) {
    const existingContent = await getLatestEditorialAiContentByCycleId(cycle.id);
    if (existingContent) {
      console.log(
        `  [concluído] Ciclo ${cycle.id} já tem conteúdo (v${existingContent.version}) — pulando.`,
      );
      skipped++;
      continue;
    }
    if (cycle.status !== "RASCUNHO_IA") {
      console.log(
        `  [fora de escopo] Ciclo ${cycle.id} está em "${cycle.status}" (não é RASCUNHO_IA) — nunca regenerar ciclo já avançado, pulando.`,
      );
      skipped++;
      continue;
    }

    const input = await getEditorialAiInputByCycleId(cycle.id);
    if (!input || !input.board_id || !input.course_id || !input.position_id) {
      console.warn(
        `  [aviso] Ciclo ${cycle.id} está pendente mas não tem editorial_ai_inputs completo — não é possível retomar automaticamente, pulando.`,
      );
      stillPending++;
      continue;
    }

    const remaining = (input.remaining_inputs ?? {}) as Record<string, unknown>;
    const difficultyLevel =
      (remaining.difficultyLevel as EditorialDifficultyLevel | undefined) ?? "Média";
    const cognitiveObjective =
      (remaining.cognitiveObjective as string | undefined) ?? "Reconhecimento/recordação direta";
    const strategy =
      (remaining.strategy as string | undefined) ?? "Cobrança direta da definição ou dispositivo";
    if (!remaining.cognitiveObjective) {
      console.warn(
        `  [aviso] Ciclo ${cycle.id}: objetivo/estratégia não foram persistidos no input original (ciclo criado antes deste mecanismo de retomada) — usando padrão do repertório.`,
      );
    }

    console.log(
      `  [retomando] Ciclo ${cycle.id} — board=${input.board_id} topic=${input.concept_topic_id ?? "-"} subtopic=${input.concept_subtopic_id ?? "-"} nível=${difficultyLevel}`,
    );
    try {
      // editorial_ai_requests/responses são 1:1 por ciclo (UNIQUE cycle_id,
      // migration 20260717020000) — diferente de editorial_ai_contents, que
      // é versionado. orchestrator.generate() sempre insere uma request nova
      // incondicionalmente, então uma tentativa anterior que chegou a montar
      // a instrução (mas falhou depois, ex.: provedor sem crédito) deixa uma
      // request órfã que bloqueia qualquer nova tentativa no mesmo ciclo.
      // Como já confirmamos acima que este ciclo não tem content, request e
      // response (se existirem) são necessariamente dessa tentativa
      // fracassada — nunca de uma bem-sucedida — então é seguro descartá-las
      // para o orchestrator recriar do zero. Nenhuma tabela nova, nenhuma
      // coluna nova, nenhuma alteração no orchestrator/service em si.
      const { error: deleteResponseError } = await supabaseAdmin
        .from("editorial_ai_responses")
        .delete()
        .eq("cycle_id", cycle.id);
      if (deleteResponseError) throw deleteResponseError;
      const { error: deleteRequestError } = await supabaseAdmin
        .from("editorial_ai_requests")
        .delete()
        .eq("cycle_id", cycle.id);
      if (deleteRequestError) throw deleteRequestError;

      const difficulty = buildDifficultyGuidance(difficultyLevel);
      const generation = await runGenerationForCycle(orchestrator, cycle.id, resumeBatchId, {
        boardId: input.board_id,
        courseId: input.course_id,
        positionId: input.position_id,
        conceptTopicId: input.concept_topic_id,
        conceptSubtopicId: input.concept_subtopic_id,
        cognitiveObjective,
        strategy,
        difficultyInstruction: difficulty.instruction,
      });
      const annotations = await listEditorialAiAnnotationsByCycleId(cycle.id);
      console.log(
        `  [concluído] Ciclo ${cycle.id} gerado com sucesso, ${annotations.length} anotações registradas. (${generation.usage.outputTokens ?? "?"} tokens de saída)`,
      );
      resumed++;
    } catch (err) {
      console.error(
        `  [falhou de novo] Ciclo ${cycle.id} continua pendente: ${err instanceof Error ? err.message : err}`,
      );
      stillPending++;
    }
  }

  console.log("\n=== Relatório de retomada ===");
  console.log(`Batch: ${resumeBatchId}`);
  console.log(`Ciclos totais no batch: ${cycles.length}`);
  console.log(`Já concluídos antes desta execução (pulados): ${skipped}`);
  console.log(`Retomados com sucesso agora: ${resumed}`);
  console.log(`Ainda pendentes (falharam de novo ou sem input utilizável): ${stillPending}`);
}

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const { editorialAiOrchestrator } =
    await import("../../src/lib/editorial-ai/orchestrator.server.ts");

  const resumeBatchId = extractResumeBatchId(process.argv.slice(2));
  if (resumeBatchId) {
    await resumeBatch(editorialAiOrchestrator, resumeBatchId);
    process.exit(0);
  }

  const args = parseArgs(process.argv.slice(2));

  const [boardId, courseId, positionId, architectureId] = await Promise.all([
    resolveIdByName("boards", args.board),
    resolveIdByName("courses", args.course),
    resolveIdByName("positions", args.position),
    resolveActiveArchitectureId(),
  ]);

  console.log(
    `Selecionando alvos (modo manual): ${args.discipline} > ${args.topic}${args.subtopic ? " > " + args.subtopic : ""}, banca=${args.board}, quantidade pedida=${args.quantity}`,
  );
  const selection = await contentSelector.selectTargets({
    mode: "manual",
    disciplineName: args.discipline,
    topicName: args.topic,
    subtopicName: args.subtopic,
    boardId,
    quantity: args.quantity,
  });
  for (const warning of selection.warnings) console.warn(`AVISO (content-selector): ${warning}`);
  console.log(`Alvos resolvidos: ${selection.targets.length}`);

  const batch = await editorialAiOrchestrator.createBatch({
    name: `${args.discipline} / ${args.topic}${args.subtopic ? " / " + args.subtopic : ""} — ${args.board} — ${args.level} — ${new Date().toISOString()}`,
    description: `Gerado via editorial:generate CLI. Disciplina="${args.discipline}", Assunto="${args.topic}", Subassunto="${args.subtopic ?? "(nível assunto)"}", Banca="${args.board}", Dificuldade="${args.level}", Quantidade pedida=${args.quantity}.`,
    architecture_id: architectureId ?? null,
    created_by: args.actorUserId,
  });
  console.log(`Batch criado: ${batch.id}`);

  const difficulty = buildDifficultyGuidance(args.level);

  const results: Array<{ cycleId: string; warnings: string[]; annotationCount: number }> = [];

  for (const [index, target] of selection.targets.entries()) {
    console.log(
      `\n[${index + 1}/${selection.targets.length}] Ciclo — objetivo: ${target.cognitiveObjective} / estratégia: ${target.strategy}`,
    );

    const cycle = await editorialAiOrchestrator.createCycle({
      architecture_id: architectureId ?? null,
      batch_id: batch.id,
    });

    await editorialAiOrchestrator.registerInput({
      cycle_id: cycle.id,
      concept_topic_id: target.topicId ?? null,
      concept_subtopic_id: target.subtopicId ?? null,
      board_id: target.boardId,
      course_id: courseId,
      position_id: positionId,
      remaining_inputs: {
        difficultyLevel: args.level,
        quantityRequested: args.quantity,
        sourceOrigin: target.sourceOrigin,
        // Persistidos para que uma eventual retomada (--resume-batch-id)
        // reconstrua o mesmo alvo exato, em vez de cair no padrão do
        // repertório — ver resumeBatch() acima.
        cognitiveObjective: target.cognitiveObjective,
        strategy: target.strategy,
      } as never,
    });

    const generation = await runGenerationForCycle(editorialAiOrchestrator, cycle.id, batch.id, {
      boardId: target.boardId,
      courseId,
      positionId,
      conceptTopicId: target.topicId,
      conceptSubtopicId: target.subtopicId,
      cognitiveObjective: target.cognitiveObjective,
      strategy: target.strategy,
      difficultyInstruction: difficulty.instruction,
    });

    const annotations = await listEditorialAiAnnotationsByCycleId(cycle.id);
    results.push({ cycleId: cycle.id, warnings: [], annotationCount: annotations.length });
    console.log(
      `  Ciclo ${cycle.id} — RASCUNHO_IA criado, ${annotations.length} anotações de validação registradas. (${generation.usage.outputTokens ?? "?"} tokens de saída)`,
    );
  }

  console.log("\n=== Relatório final ===");
  console.log(`Batch: ${batch.id}`);
  console.log(`Ciclos RASCUNHO_IA criados: ${results.length}`);
  console.log(
    `Total de anotações de validação: ${results.reduce((sum, r) => sum + r.annotationCount, 0)}`,
  );
  console.log(
    "Nenhum conteúdo foi publicado ou homologado — revisão humana (IA-006/007) é a próxima etapa, fora deste script.",
  );

  process.exit(0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
