import type { EditorialPromptContext } from "./prompt-composer";

/**
 * Contrato do Resolver de Contexto Editorial (IT-007).
 * Monta um EditorialPromptContext a partir de dados que já existem —
 * taxonomia (editorial_disciplines/topics/subtopics/keywords/rules/evidence),
 * bancas (boards) e o perfil de banca já publicado em
 * docs/editorial/normalized/14-perfil-bancas.json. Não cria nenhuma tabela,
 * documento ou conceito novo; apenas lê e organiza o que já está persistido.
 *
 * `cognitiveObjective` e `strategy` não são resolvidos daqui — são decisão
 * editorial humana por ciclo (Método Editorial, Etapas 3 e 5), por isso
 * entram como entrada, não como algo buscado em tabela.
 */
export type EditorialContextResolverInput = {
  boardId: string;
  courseId: string;
  positionId: string;
  conceptTopicId?: string;
  conceptSubtopicId?: string;
  cognitiveObjective: string;
  strategy: string;
  /** Já traduzida pelo difficulty-engine (Etapa 4) — este resolver não decide dificuldade, só repassa. */
  difficultyInstruction: string;
};

export interface EditorialContextResolver {
  resolve(input: EditorialContextResolverInput): Promise<EditorialPromptContext>;
}
