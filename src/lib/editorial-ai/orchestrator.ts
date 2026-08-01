import type { EditorialGenerationCommand, EditorialGenerationResult } from "./generation";
import type {
  EditorialAiAnnotation,
  EditorialAiAnnotationInsert,
  EditorialAiBatch,
  EditorialAiBatchInsert,
  EditorialAiContent,
  EditorialAiContentInsert,
  EditorialAiCycle,
  EditorialAiCycleInsert,
  EditorialAiDecision,
  EditorialAiDecisionInsert,
  EditorialAiInput,
  EditorialAiInputInsert,
  EditorialAiPublication,
  EditorialAiPublicationInsert,
  EditorialAiRequest,
  EditorialAiRequestInsert,
  EditorialAiResponse,
  EditorialAiResponseInsert,
} from "./types";

/**
 * Camada de orquestração (IT-008): coordena a sequência estrutural de um
 * ciclo editorial chamando exclusivamente a camada de serviços (IT-007).
 * Não executa IA, não monta prompts, não valida critérios editoriais,
 * não valida workflow, não publica, não decide nada — apenas encaminha.
 */
export interface EditorialAiOrchestrator {
  createBatch(input: EditorialAiBatchInsert): Promise<EditorialAiBatch>;
  createCycle(input: EditorialAiCycleInsert): Promise<EditorialAiCycle>;
  registerInput(input: EditorialAiInputInsert): Promise<EditorialAiInput>;
  registerRequest(input: EditorialAiRequestInsert): Promise<EditorialAiRequest>;
  registerResponse(input: EditorialAiResponseInsert): Promise<EditorialAiResponse>;
  registerContent(input: EditorialAiContentInsert): Promise<EditorialAiContent>;
  registerAnnotation(input: EditorialAiAnnotationInsert): Promise<EditorialAiAnnotation>;
  registerDecision(input: EditorialAiDecisionInsert): Promise<EditorialAiDecision>;
  registerPublication(input: EditorialAiPublicationInsert): Promise<EditorialAiPublication>;
  generate(command: EditorialGenerationCommand): Promise<EditorialGenerationResult>;
}
