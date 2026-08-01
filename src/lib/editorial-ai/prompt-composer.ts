/**
 * Contrato da composição de prompts editoriais (IT-012).
 * Transforma dados editoriais já resolvidos em uma única instrução textual,
 * seguindo os blocos lógicos definidos em IA-002. Não chama IA, não salva
 * banco, não conhece Supabase, não conhece nenhum provedor de IA.
 */

export type EditorialPromptConceptContext = {
  name: string;
  canonicalDefinition: string;
};

export type EditorialPromptBoardContext = {
  name: string;
  styleNotes: string;
};

export type EditorialPromptCycleDecisionContext = {
  courseName: string;
  positionName: string;
  cognitiveObjective: string;
  strategy: string;
  /** Instrução de dificuldade já traduzida pelo difficulty-engine (Etapa 4) — texto pronto, este módulo não recalcula nada. */
  difficultyInstruction: string;
};

export type EditorialPromptOperationalContext = {
  classificationNotes?: string;
  dictionaryNotes?: string;
  ambiguousCasesNotes?: string;
};

/**
 * Contrato de entrada da composição — apenas o necessário para montar o
 * prompt, já resolvido por quem chama (nenhuma consulta é feita aqui).
 */
export type EditorialPromptContext = {
  concept: EditorialPromptConceptContext;
  board: EditorialPromptBoardContext;
  cycleDecision: EditorialPromptCycleDecisionContext;
  operationalContext?: EditorialPromptOperationalContext;
  requiredElements: string[];
  restrictions: string[];
};

export interface EditorialPromptComposer {
  compose(context: EditorialPromptContext): string;
}
