/**
 * Contrato do Editorial Validator — Motor Editorial V1, Etapa 7.
 *
 * Implementa os 10 critérios assistivos da IA-005
 * (docs/editorial/engine-v2/12-IA-005-validacao-editorial.md), já fixados
 * como CHECK constraint em `editorial_ai_annotations.criterion`
 * (supabase/migrations/20260717020000_editorial_ai_engine_core.sql).
 *
 * Nenhum critério aqui aprova ou reprova sozinho — cada um produz uma nota
 * (`description`) para o revisor humano (IA-006). Critérios com checagem
 * mecânica direta ficam determinísticos; os que exigem julgamento
 * semântico registram como apontamento para leitura humana, nunca tentam
 * decidir sozinhos.
 */

import type { EditorialParsedElements } from "./response-parser";
import type { EditorialPromptContext } from "./prompt-composer";
import type { EditorialAiAnnotationCriterion } from "./types";

export type EditorialValidationInput = {
  elements: EditorialParsedElements;
  context: EditorialPromptContext;
};

export type EditorialValidationAnnotation = {
  criterion: EditorialAiAnnotationCriterion;
  description: string;
};

export interface EditorialValidator {
  validate(input: EditorialValidationInput): Promise<EditorialValidationAnnotation[]>;
}
