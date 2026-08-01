import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { EditorialContextResolver, EditorialContextResolverInput } from "./context-resolver";
import type { EditorialPromptContext } from "./prompt-composer";
import { disciplineLoader } from "./discipline-loader.server";
import { boardLoader } from "./board-loader.server";

/**
 * Restrições transcritas do Método Editorial de Produção de Questões V1
 * (congelado), Cap. 1, itens 1.5-1.6 — não são inventadas aqui, apenas
 * repetidas como restrição operacional de qualquer ciclo de geração.
 */
const METODO_EDITORIAL_RESTRICTIONS = [
  "Nunca inventar ou deslocar a fronteira do Conceito.",
  "Nunca fabricar conteúdo sem lastro em fonte factual estabelecida.",
  "O conhecimento nunca se curva ao estilo da banca — em conflito, o Conceito prevalece.",
  "Nunca copiar ou parafrasear uma questão real identificável do acervo — a questão final deve ser inédita.",
];

/**
 * Calibração editorial (Sprint 4.3) — regras adicionadas a partir dos achados
 * reais da homologação humana (Sprint 4.2), não do Método Editorial V1
 * congelado. Mantidas em constante separada para não misturar proveniência
 * com METODO_EDITORIAL_RESTRICTIONS. Cobre as Regras 1 (referências), 2
 * (normas) e 4 (diversidade temática); a Regra 3 (DNA das bancas) é aplicada
 * em prompt-composer.server.ts::buildBoardBlock, por ser específica de cada
 * banca, não genérica.
 */
const EDITORIAL_CALIBRATION_RESTRICTIONS = [
  "Referências bibliográficas: priorize sempre a referência primária mais específica ao Conceito. Nunca anexe uma norma apenas por estar tematicamente relacionada — cada referência citada deve ser a fonte real e central do conteúdo testado, não uma citação de reforço. Quando existir um protocolo oficial específico para o Conceito (ex.: um PCDT, uma Portaria dedicada, uma Resolução de conselho de classe), ele deve ser preferido a referências genéricas de literatura.",
  'Normas: não cite número de artigo, inciso, alínea ou subitem de uma norma a menos que haja alta confiança na exatidão desse número. Em caso de dúvida sobre a numeração exata, cite apenas a norma oficial pelo nome/número principal (ex.: "NR-32", sem apontar o subitem específico).',
  "Diversidade temática: ao decidir o ângulo de cobrança dentro do microtema (qual estratégia, qual dado específico testar), evite o ângulo mais óbvio/genérico quando o Conceito comportar múltiplos ângulos válidos, reduzindo a chance de sobreposição com questões já publicadas sobre o mesmo microtema. Isso não impede gerar um ângulo semelhante quando for o único ângulo válido para o Conceito.",
];

/**
 * Elementos exigidos no retorno (E-01…E-10 do IA-001), espelhando 1:1 as
 * colunas substantivas de editorial_ai_contents.
 */
const REQUIRED_ELEMENTS = [
  "Enunciado",
  "Alternativas",
  "Gabarito",
  "Justificativa técnica por alternativa",
  "Contexto (quando aplicável)",
  "Referência ao conceito",
  "Objetivo cognitivo demonstrado",
  "Referência bibliográfica",
];

/**
 * Coordenador fino (IT-007): monta o EditorialPromptContext delegando a
 * resolução de conteúdo para discipline-loader (Etapa 1) e board-loader
 * (Etapa 2) — não resolve mais nada sozinho, apenas orquestra os dois e
 * repassa a decisão editorial (objetivo/estratégia/dificuldade) que chega
 * já pronta de content-selector + difficulty-engine (Etapas 3-4).
 */
export class DefaultEditorialContextResolver implements EditorialContextResolver {
  async resolve(input: EditorialContextResolverInput): Promise<EditorialPromptContext> {
    const hasTopic = Boolean(input.conceptTopicId);
    const hasSubtopic = Boolean(input.conceptSubtopicId);
    if (hasTopic === hasSubtopic) {
      throw new Error(
        "Informe exatamente um entre conceptTopicId e conceptSubtopicId (mesma regra de editorial_ai_inputs).",
      );
    }

    const [disciplineResult, board, course, position] = await Promise.all([
      disciplineLoader.load({
        conceptTopicId: input.conceptTopicId,
        conceptSubtopicId: input.conceptSubtopicId,
      }),
      boardLoader.load({ boardId: input.boardId }),
      this.resolveCourse(input.courseId),
      this.resolvePosition(input.positionId),
    ]);

    return {
      concept: disciplineResult.concept,
      board: { name: board.name, styleNotes: board.styleNotes },
      cycleDecision: {
        courseName: course,
        positionName: position,
        cognitiveObjective: input.cognitiveObjective,
        strategy: input.strategy,
        difficultyInstruction: input.difficultyInstruction,
      },
      operationalContext: {
        classificationNotes: disciplineResult.classificationNotes,
        dictionaryNotes: disciplineResult.dictionaryNotes,
        ambiguousCasesNotes: disciplineResult.ambiguousCasesNotes,
      },
      requiredElements: REQUIRED_ELEMENTS,
      restrictions: [...METODO_EDITORIAL_RESTRICTIONS, ...EDITORIAL_CALIBRATION_RESTRICTIONS],
    };
  }

  private async resolveCourse(courseId: string) {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("name")
      .eq("id", courseId)
      .single();
    if (error || !data) {
      throw new Error(`Curso não encontrado: ${error?.message ?? courseId}`);
    }
    return data.name;
  }

  private async resolvePosition(positionId: string) {
    const { data, error } = await supabaseAdmin
      .from("positions")
      .select("name")
      .eq("id", positionId)
      .single();
    if (error || !data) {
      throw new Error(`Cargo não encontrado: ${error?.message ?? positionId}`);
    }
    return data.name;
  }
}

export const editorialContextResolver: EditorialContextResolver =
  new DefaultEditorialContextResolver();
