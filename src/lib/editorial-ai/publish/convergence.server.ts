import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  editorialAiCycleService,
  getEditorialAiInputByCycleId,
  getLatestEditorialAiContentByCycleId,
  createEditorialAiDecision,
  createEditorialAiPublication,
} from "../service.server";
import { resolveSubjectByName, resolveTopicByName } from "./taxonomy-resolution.server";
import { formatAlternativesForDb, type QuestionAlternative } from "../../questions";

/**
 * Convergência editorial (Sprint 7.1A, IA-007) — o único ponto em que um
 * ciclo `APROVADO_EDITORIAL` do Motor Editorial passa a existir em
 * `questions`, o acervo real. Reaproveita integralmente o padrão já usado
 * em `src/lib/import.ts::applyImportBatch` (mesmo formato de payload, mesmo
 * `.insert()` direto em `questions`) e `formatAlternativesForDb`
 * (`src/lib/questions.ts`) — nenhuma tabela nova, nenhum pipeline novo.
 *
 * Nunca decide sozinho: publica automaticamente só quando a taxonomia
 * resolve para exatamente 1 `subject`/`topic` (regra 4); em qualquer outro
 * caso (0 ou N correspondências) bloqueia SÓ aquela questão, registra o
 * motivo via `editorial_ai_decisions` (`decision_type: "DECISAO_PUBLICACAO"`,
 * já previsto no schema desde a Fase 4 — não é campo novo) e mantém o ciclo
 * em `APROVADO_EDITORIAL` (regra 5). Ao final, sempre chama
 * `registerPublication()`/`createEditorialAiPublication()`, já existente,
 * nunca reimplementado.
 */
export type EditorialConvergenceResult =
  | { outcome: "CONVERGED"; cycleId: string; questionId: string; publicationId: string }
  | {
      outcome: "BLOCKED_INCOMPLETE_CONTRACT";
      cycleId: string;
      reason: string;
      publicationId: string;
    };

type EditorialAlternativeRaw = { letter: string; text: string };

/** IA gera `"(A) texto"` (`prompt-composer.server.ts`/`orchestrator.server.ts`); o acervo real espera `"A) texto"` (`formatAlternativesForDb`, `questions.ts:35-39`). Só extrai letra+texto — a formatação final é feita pela própria função já existente. */
function parseAiAlternative(raw: string): EditorialAlternativeRaw | null {
  const match = String(raw ?? "")
    .trim()
    .match(/^\(?([A-Z])\)\s*(.*)$/i);
  if (!match) return null;
  return { letter: match[1].toUpperCase(), text: match[2].trim() };
}

async function resolveConceptNames(input: {
  conceptTopicId: string | null;
  conceptSubtopicId: string | null;
}): Promise<{ disciplineName: string | null; topicName: string | null }> {
  if (input.conceptSubtopicId) {
    const { data: subtopic } = await supabaseAdmin
      .from("editorial_subtopics")
      .select("topic_id")
      .eq("id", input.conceptSubtopicId)
      .single();
    if (!subtopic) return { disciplineName: null, topicName: null };
    const { data: topic } = await supabaseAdmin
      .from("editorial_topics")
      .select("name, discipline_id")
      .eq("id", subtopic.topic_id)
      .single();
    if (!topic) return { disciplineName: null, topicName: null };
    const { data: discipline } = await supabaseAdmin
      .from("editorial_disciplines")
      .select("name")
      .eq("id", topic.discipline_id)
      .single();
    // Casa pelo tópico-pai, não pelo subassunto: a taxonomia real (subjects/topics)
    // não tem um 4º nível equivalente a subassunto — granularidade mais próxima é o tópico.
    return { disciplineName: discipline?.name ?? null, topicName: topic.name };
  }

  if (input.conceptTopicId) {
    const { data: topic } = await supabaseAdmin
      .from("editorial_topics")
      .select("name, discipline_id")
      .eq("id", input.conceptTopicId)
      .single();
    if (!topic) return { disciplineName: null, topicName: null };
    const { data: discipline } = await supabaseAdmin
      .from("editorial_disciplines")
      .select("name")
      .eq("id", topic.discipline_id)
      .single();
    return { disciplineName: discipline?.name ?? null, topicName: topic.name };
  }

  return { disciplineName: null, topicName: null };
}

async function recordPublicationDecision(input: {
  cycleId: string;
  actorUserId: string;
  justification: string;
}): Promise<string> {
  const decision = await createEditorialAiDecision({
    cycle_id: input.cycleId,
    actor_user_id: input.actorUserId,
    decision_type: "DECISAO_PUBLICACAO",
    previous_status: "APROVADO_EDITORIAL",
    new_status: "APROVADO_EDITORIAL", // publicação não muda o estado editorial do ciclo (IA-007 §5)
    justification: input.justification,
  });
  return decision.id;
}

export async function convergeEditorialCycleToAcervo(input: {
  cycleId: string;
  packageId: string;
  packageVersionId: string;
  actorUserId: string;
}): Promise<EditorialConvergenceResult> {
  const cycle = await editorialAiCycleService.getCycle(input.cycleId);
  if (!cycle) throw new Error(`Ciclo não encontrado: ${input.cycleId}`);
  if (cycle.status !== "APROVADO_EDITORIAL") {
    throw new Error(
      `Ciclo ${input.cycleId} está em "${cycle.status}", não "APROVADO_EDITORIAL" — pré-condição da IA-007 §3 não satisfeita.`,
    );
  }

  const [content, cycleInput] = await Promise.all([
    getLatestEditorialAiContentByCycleId(input.cycleId),
    getEditorialAiInputByCycleId(input.cycleId),
  ]);
  if (!content) throw new Error(`Ciclo ${input.cycleId} sem editorial_ai_contents.`);
  if (!cycleInput) throw new Error(`Ciclo ${input.cycleId} sem editorial_ai_inputs.`);

  const { disciplineName, topicName } = await resolveConceptNames({
    conceptTopicId: cycleInput.concept_topic_id,
    conceptSubtopicId: cycleInput.concept_subtopic_id,
  });

  if (!disciplineName || !topicName) {
    const justification = `Bloqueado: não foi possível determinar disciplina/assunto de origem do ciclo (concept_topic_id/concept_subtopic_id ausente ou órfão em editorial_topics/editorial_subtopics).`;
    const decisionId = await recordPublicationDecision({
      cycleId: input.cycleId,
      actorUserId: input.actorUserId,
      justification,
    });
    const publication = await createEditorialAiPublication({
      cycle_id: input.cycleId,
      decision_id: decisionId,
      question_id: null,
      outcome: "BLOCKED_INCOMPLETE_CONTRACT",
    });
    return {
      outcome: "BLOCKED_INCOMPLETE_CONTRACT",
      cycleId: input.cycleId,
      reason: justification,
      publicationId: publication.id,
    };
  }

  const subjectMatch = await resolveSubjectByName(disciplineName);
  const topicMatch =
    subjectMatch.status === "RESOLVED"
      ? await resolveTopicByName(topicName, subjectMatch.id!)
      : null;

  const taxonomyResolved = subjectMatch.status === "RESOLVED" && topicMatch?.status === "RESOLVED";

  if (!taxonomyResolved) {
    const justification = [
      `Bloqueado: resolução de taxonomia não foi inequívoca (regra 4/5 — publicar só quando inequívoco).`,
      `Disciplina "${disciplineName}" -> subjects: ${subjectMatch.status}${subjectMatch.candidateIds.length ? ` (${subjectMatch.candidateIds.length} candidatos)` : ""}.`,
      subjectMatch.status === "RESOLVED"
        ? `Assunto "${topicName}" -> topics: ${topicMatch?.status}${topicMatch?.candidateIds.length ? ` (${topicMatch.candidateIds.length} candidatos)` : ""}.`
        : `Assunto "${topicName}" não verificado (disciplina não resolvida primeiro).`,
    ].join(" ");

    const decisionId = await recordPublicationDecision({
      cycleId: input.cycleId,
      actorUserId: input.actorUserId,
      justification,
    });
    const publication = await createEditorialAiPublication({
      cycle_id: input.cycleId,
      decision_id: decisionId,
      question_id: null,
      outcome: "BLOCKED_INCOMPLETE_CONTRACT",
    });
    return {
      outcome: "BLOCKED_INCOMPLETE_CONTRACT",
      cycleId: input.cycleId,
      reason: justification,
      publicationId: publication.id,
    };
  }

  const alternatives: QuestionAlternative[] = (
    Array.isArray(content.alternatives) ? (content.alternatives as unknown[]) : []
  )
    .map((raw) => parseAiAlternative(String(raw)))
    .filter((a): a is EditorialAlternativeRaw => a !== null);

  const payload = {
    package_id: input.packageId,
    package_version_id: input.packageVersionId,
    subject_id: subjectMatch.id!,
    topic_id: topicMatch!.id!,
    board_id: cycleInput.board_id,
    position_id: cycleInput.position_id,
    exam_id: null, // conteúdo inédito por IA — não pertence a nenhum concurso real (IA-001 §7.2)
    statement: content.statement ?? "",
    alternatives: formatAlternativesForDb(alternatives),
    correct_answer: content.correct_answer,
    explanation: content.explanation,
    metadata: content.bibliographic_reference
      ? { bibliography: content.bibliographic_reference, editorial_ai_cycle_id: input.cycleId }
      : { editorial_ai_cycle_id: input.cycleId },
  };

  const { data: inserted, error } = await supabaseAdmin
    .from("questions")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;

  const justification = `Convergido: disciplina "${disciplineName}" -> subjects.id=${subjectMatch.id}; assunto "${topicName}" -> topics.id=${topicMatch!.id}; questions.id=${inserted.id}.`;
  const decisionId = await recordPublicationDecision({
    cycleId: input.cycleId,
    actorUserId: input.actorUserId,
    justification,
  });
  const publication = await createEditorialAiPublication({
    cycle_id: input.cycleId,
    decision_id: decisionId,
    question_id: inserted.id,
    outcome: "CONVERGED",
  });

  return {
    outcome: "CONVERGED",
    cycleId: input.cycleId,
    questionId: inserted.id,
    publicationId: publication.id,
  };
}
