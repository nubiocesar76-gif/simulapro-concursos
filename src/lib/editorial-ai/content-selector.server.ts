import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  ContentSelector,
  EditorialContentTarget,
  EditorialManualTargetRequest,
  EditorialTargetRequest,
  EditorialTargetSelectionResult,
} from "./content-selector";

/**
 * Repertório de {objetivo cognitivo, estratégia de cobrança} usado para
 * variar os alvos quando `quantity > 1`. Construído a partir da UNIÃO das
 * categorias já catalogadas nos Dossiês IBFC e FGV (Cap. 6 "Objetivos
 * Cognitivos" e Cap. 7 "Estratégias de Cobrança", ambos "V1.0 Congelado")
 * — não são inventadas aqui, são o repertório real observado nas duas
 * bancas com Dossiê completo. Genérico o bastante para bancas sem Dossiê
 * completo (board-loader sinaliza `hasFullDossie: false` nesse caso).
 */
const COGNITIVE_STRATEGY_REPERTOIRE: Array<{ cognitiveObjective: string; strategy: string }> = [
  {
    cognitiveObjective: "Reconhecimento/recordação direta",
    strategy: "Cobrança direta da definição ou dispositivo",
  },
  {
    cognitiveObjective: "Julgamento composto (afirmativas em lista)",
    strategy: "Julgamento de afirmativas (V/F ou I/II/III)",
  },
  {
    cognitiveObjective: "Aplicação a caso concreto",
    strategy: "Cenário clínico ou administrativo aplicado",
  },
  {
    cognitiveObjective: "Comparação entre conceitos próximos",
    strategy: "Comparação entre conceitos da mesma família",
  },
  {
    cognitiveObjective: "Interpretação de texto-base/dispositivo normativo",
    strategy: "Interpretação literal precisa de dispositivo",
  },
  {
    cognitiveObjective: "Verificação por eliminação",
    strategy: "Identificação da exceção (comando negativo)",
  },
  {
    cognitiveObjective: "Derivação lógica a partir de premissas",
    strategy: "Encadeamento lógico entre afirmativas relacionadas",
  },
  {
    cognitiveObjective: "Classificação técnica-doutrinária",
    strategy: "Classificação de um caso dentro de uma taxonomia técnica",
  },
  {
    cognitiveObjective: "Reconhecimento por descrição",
    strategy: "Descrição de sinais/achados para identificar o conceito",
  },
  {
    cognitiveObjective: "Dependência de texto específico",
    strategy: "Cobrança ancorada em um trecho normativo específico",
  },
];

async function resolveDisciplineIdByName(name: string): Promise<{ id: string; name: string }> {
  const { data, error } = await supabaseAdmin
    .from("editorial_disciplines")
    .select("id, name")
    .ilike("name", `%${name}%`);
  if (error) throw new Error(`Erro ao resolver disciplina "${name}": ${error.message}`);
  return pickSingleMatch(data ?? [], name, "disciplina");
}

async function resolveTopicIdByName(
  disciplineId: string,
  name: string,
): Promise<{ id: string; name: string }> {
  const { data, error } = await supabaseAdmin
    .from("editorial_topics")
    .select("id, name")
    .eq("discipline_id", disciplineId)
    .ilike("name", `%${name}%`);
  if (error) throw new Error(`Erro ao resolver assunto "${name}": ${error.message}`);
  return pickSingleMatch(data ?? [], name, "assunto");
}

async function resolveSubtopicIdByName(
  topicId: string,
  name: string,
): Promise<{ id: string; name: string }> {
  const { data, error } = await supabaseAdmin
    .from("editorial_subtopics")
    .select("id, name")
    .eq("topic_id", topicId)
    .ilike("name", `%${name}%`);
  if (error) throw new Error(`Erro ao resolver subassunto "${name}": ${error.message}`);
  return pickSingleMatch(data ?? [], name, "subassunto");
}

function pickSingleMatch<T extends { id: string; name: string }>(
  candidates: T[],
  query: string,
  label: string,
): T {
  if (candidates.length === 0) {
    throw new Error(`Nenhum(a) ${label} encontrado(a) contendo "${query}".`);
  }
  const exact = candidates.find((c) => c.name.trim().toLowerCase() === query.trim().toLowerCase());
  if (exact) return exact;
  if (candidates.length > 1) {
    const names = candidates.map((c) => `"${c.name}"`).join(", ");
    throw new Error(
      `"${query}" casou com mais de um(a) ${label}: ${names}. Informe o nome completo para desambiguar.`,
    );
  }
  return candidates[0];
}

async function selectManualTargets(
  request: EditorialManualTargetRequest,
): Promise<EditorialTargetSelectionResult> {
  if (request.quantity < 1) {
    throw new Error("quantity deve ser >= 1.");
  }

  const discipline = await resolveDisciplineIdByName(request.disciplineName);
  const topic = await resolveTopicIdByName(discipline.id, request.topicName);
  const subtopic = request.subtopicName
    ? await resolveSubtopicIdByName(topic.id, request.subtopicName)
    : undefined;

  const warnings: string[] = [];
  const repertoireSize = COGNITIVE_STRATEGY_REPERTOIRE.length;
  const targetCount = Math.min(request.quantity, repertoireSize);
  if (request.quantity > repertoireSize) {
    warnings.push(
      `Pedidos ${request.quantity} alvos distintos, mas o repertório catalogado de objetivo/estratégia só cobre ${repertoireSize} combinações sem repetir — retornando ${repertoireSize}. Repetir combinação para forçar o total pedido inventaria variação sem lastro, o que este módulo não faz.`,
    );
  }

  const targets: EditorialContentTarget[] = Array.from({ length: targetCount }, (_, i) => ({
    subtopicId: subtopic?.id,
    topicId: subtopic ? undefined : topic.id,
    boardId: request.boardId,
    cognitiveObjective: COGNITIVE_STRATEGY_REPERTOIRE[i].cognitiveObjective,
    strategy: COGNITIVE_STRATEGY_REPERTOIRE[i].strategy,
    sourceOrigin: "MANUAL",
  }));

  return { targets, warnings };
}

export class DefaultContentSelector implements ContentSelector {
  async selectTargets(request: EditorialTargetRequest): Promise<EditorialTargetSelectionResult> {
    if (request.mode === "manual") {
      return selectManualTargets(request);
    }
    throw new Error(
      "Seleção inteligente ainda não implementada — reservado para o Motor de Aprendizado.",
    );
  }
}

export const contentSelector: ContentSelector = new DefaultContentSelector();
