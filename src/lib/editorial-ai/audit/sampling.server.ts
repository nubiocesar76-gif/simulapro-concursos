import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { editorialAiCycleService, getEditorialAiInputByCycleId } from "../service.server";
import type { EditorialAiCycle } from "../types";

/**
 * Amostragem estratificada (Fase 5 — Auditor Editorial, IT-007). Lê
 * exclusivamente dados já persistidos (editorial_ai_cycles/inputs, boards,
 * editorial_topics/subtopics/disciplines) — nenhuma tabela nova, nenhuma
 * escrita. `remaining_inputs.difficultyLevel` já é gravado por
 * scripts/editorial/run-generation.ts, não é um campo novo.
 */
export type EditorialAuditSampleItem = {
  cycleId: string;
  batchId: string | null;
  boardId: string;
  boardName: string;
  disciplineName: string;
  topicName: string;
  subtopicName: string | null;
  difficultyLevel: string;
  createdAt: string;
};

export type EditorialAuditSamplingInput = {
  batchIds: string[];
  /** Máximo de ciclos por estrato (banca × dificuldade). Omitido = população inteira do lote. */
  sampleSizePerStratum?: number;
};

function stratumKey(boardName: string, difficultyLevel: string): string {
  return `${boardName}::${difficultyLevel}`;
}

export async function sampleEditorialAiCycles(
  input: EditorialAuditSamplingInput,
): Promise<EditorialAuditSampleItem[]> {
  if (!input.batchIds.length) {
    throw new Error("Informe ao menos um batchId para auditar.");
  }

  const cyclesByBatch = await Promise.all(
    input.batchIds.map((batchId) => editorialAiCycleService.listCycles({ batchId })),
  );
  const cycles: EditorialAiCycle[] = cyclesByBatch.flat();
  if (!cycles.length) {
    return [];
  }

  const inputsByCycle = await Promise.all(
    cycles.map((cycle) => getEditorialAiInputByCycleId(cycle.id)),
  );

  const boardIds = new Set<string>();
  const topicIds = new Set<string>();
  const subtopicIds = new Set<string>();
  for (const cycleInput of inputsByCycle) {
    if (cycleInput?.board_id) boardIds.add(cycleInput.board_id);
    if (cycleInput?.concept_topic_id) topicIds.add(cycleInput.concept_topic_id);
    if (cycleInput?.concept_subtopic_id) subtopicIds.add(cycleInput.concept_subtopic_id);
  }

  const [boardsRes, topicsRes, subtopicsRes] = await Promise.all([
    boardIds.size
      ? supabaseAdmin
          .from("boards")
          .select("id, name")
          .in("id", [...boardIds])
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
    supabaseAdmin.from("editorial_topics").select("id, name, discipline_id"),
    supabaseAdmin.from("editorial_subtopics").select("id, name, topic_id"),
  ]);

  const boardNameById = new Map((boardsRes.data ?? []).map((b) => [b.id, b.name]));
  const topicById = new Map((topicsRes.data ?? []).map((t) => [t.id, t]));
  const subtopicById = new Map((subtopicsRes.data ?? []).map((s) => [s.id, s]));

  const disciplineIds = new Set<string>();
  for (const topicId of topicIds) {
    const topic = topicById.get(topicId);
    if (topic?.discipline_id) disciplineIds.add(topic.discipline_id);
  }
  for (const subtopicId of subtopicIds) {
    const subtopic = subtopicById.get(subtopicId);
    const topic = subtopic ? topicById.get(subtopic.topic_id) : undefined;
    if (topic?.discipline_id) disciplineIds.add(topic.discipline_id);
  }

  const { data: disciplines } = disciplineIds.size
    ? await supabaseAdmin
        .from("editorial_disciplines")
        .select("id, name")
        .in("id", [...disciplineIds])
    : { data: [] as { id: string; name: string }[] };
  const disciplineNameById = new Map((disciplines ?? []).map((d) => [d.id, d.name]));

  const items: EditorialAuditSampleItem[] = [];
  for (let i = 0; i < cycles.length; i++) {
    const cycle = cycles[i];
    const cycleInput = inputsByCycle[i];
    if (!cycleInput?.board_id) continue; // ciclo sem insumo completo — fora do escopo de auditoria de conteúdo

    const boardName = boardNameById.get(cycleInput.board_id) ?? "(banca desconhecida)";

    let topicName = "(assunto desconhecido)";
    let subtopicName: string | null = null;
    let disciplineName = "(disciplina desconhecida)";
    if (cycleInput.concept_subtopic_id) {
      const subtopic = subtopicById.get(cycleInput.concept_subtopic_id);
      subtopicName = subtopic?.name ?? null;
      const topic = subtopic ? topicById.get(subtopic.topic_id) : undefined;
      topicName = topic?.name ?? topicName;
      disciplineName = topic?.discipline_id
        ? (disciplineNameById.get(topic.discipline_id) ?? disciplineName)
        : disciplineName;
    } else if (cycleInput.concept_topic_id) {
      const topic = topicById.get(cycleInput.concept_topic_id);
      topicName = topic?.name ?? topicName;
      disciplineName = topic?.discipline_id
        ? (disciplineNameById.get(topic.discipline_id) ?? disciplineName)
        : disciplineName;
    }

    const remainingInputs = cycleInput.remaining_inputs as { difficultyLevel?: string } | null;
    const difficultyLevel = remainingInputs?.difficultyLevel ?? "(dificuldade desconhecida)";

    items.push({
      cycleId: cycle.id,
      batchId: cycle.batch_id,
      boardId: cycleInput.board_id,
      boardName,
      disciplineName,
      topicName,
      subtopicName,
      difficultyLevel,
      createdAt: cycle.created_at,
    });
  }

  if (!input.sampleSizePerStratum) {
    return items;
  }

  const byStratum = new Map<string, EditorialAuditSampleItem[]>();
  for (const item of items) {
    const key = stratumKey(item.boardName, item.difficultyLevel);
    const bucket = byStratum.get(key) ?? [];
    bucket.push(item);
    byStratum.set(key, bucket);
  }

  const sampled: EditorialAuditSampleItem[] = [];
  for (const bucket of byStratum.values()) {
    const sortedBucket = [...bucket].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    sampled.push(...sortedBucket.slice(0, input.sampleSizePerStratum));
  }
  return sampled;
}
