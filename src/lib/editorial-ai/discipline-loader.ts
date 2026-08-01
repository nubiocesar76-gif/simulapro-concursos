/**
 * Contrato do Discipline Loader — Motor Editorial V1, Etapa 1.
 *
 * Resolve o "Conceito" (I-01/I-02) e o material de disciplina (I-10/I-11/I-12
 * de docs/editorial/engine-v2/08-IA-001-blueprint-editorial.md) a partir de
 * um assunto/subassunto já identificado — via `editorial-ai/content-selector`,
 * nunca escolhido aqui. Este módulo só carrega, nunca decide o que estudar.
 */

export type DisciplineLoaderInput = {
  conceptTopicId?: string;
  conceptSubtopicId?: string;
};

export type DisciplineLoaderResult = {
  concept: {
    name: string;
    canonicalDefinition: string;
  };
  /** I-10: regras/palavras-chave/evidências já normalizadas em `editorial_*`. */
  classificationNotes?: string;
  /** I-11: dicionário editorial (sinônimos, palavras-chave, siglas, leis/protocolos) do Dossiê de disciplina narrativo. */
  dictionaryNotes?: string;
  /** I-12: casos ambíguos conhecidos do Dossiê de disciplina narrativo. */
  ambiguousCasesNotes?: string;
};

export interface DisciplineLoader {
  load(input: DisciplineLoaderInput): Promise<DisciplineLoaderResult>;
}
