import type { EditorialAiOrchestrator } from "./orchestrator";
import type { EditorialAiProvider } from "./provider";
import { ClaudeProvider } from "./providers/claude-provider";
import { editorialPromptComposer } from "./prompt-composer.server";
import { editorialResponseParser } from "./response-parser.server";
import { editorialValidator } from "./editorial-validator.server";
import type { EditorialGenerationCommand, EditorialGenerationResult } from "./generation";
import {
  createEditorialAiAnnotation,
  createEditorialAiContent,
  createEditorialAiDecision,
  createEditorialAiInput,
  createEditorialAiPublication,
  createEditorialAiRequest,
  createEditorialAiResponse,
  editorialAiBatchService,
  editorialAiCycleService,
} from "./service.server";
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

function requireId(id: string, label: string): void {
  if (!id) {
    throw new Error(`${label} é obrigatório.`);
  }
}

class DefaultEditorialAiOrchestrator implements EditorialAiOrchestrator {
  constructor(private readonly provider: EditorialAiProvider) {}

  async createBatch(input: EditorialAiBatchInsert): Promise<EditorialAiBatch> {
    return editorialAiBatchService.createBatch(input);
  }

  async createCycle(input: EditorialAiCycleInsert): Promise<EditorialAiCycle> {
    return editorialAiCycleService.createCycle(input);
  }

  async registerInput(input: EditorialAiInputInsert): Promise<EditorialAiInput> {
    requireId(input.cycle_id, "cycle_id");
    return createEditorialAiInput(input);
  }

  async registerRequest(input: EditorialAiRequestInsert): Promise<EditorialAiRequest> {
    requireId(input.cycle_id, "cycle_id");
    return createEditorialAiRequest(input);
  }

  async registerResponse(input: EditorialAiResponseInsert): Promise<EditorialAiResponse> {
    requireId(input.cycle_id, "cycle_id");
    return createEditorialAiResponse(input);
  }

  async registerContent(input: EditorialAiContentInsert): Promise<EditorialAiContent> {
    requireId(input.cycle_id, "cycle_id");
    return createEditorialAiContent(input);
  }

  async registerAnnotation(input: EditorialAiAnnotationInsert): Promise<EditorialAiAnnotation> {
    requireId(input.cycle_id, "cycle_id");
    return createEditorialAiAnnotation(input);
  }

  async registerDecision(input: EditorialAiDecisionInsert): Promise<EditorialAiDecision> {
    requireId(input.cycle_id, "cycle_id");
    return createEditorialAiDecision(input);
  }

  async registerPublication(input: EditorialAiPublicationInsert): Promise<EditorialAiPublication> {
    requireId(input.cycle_id, "cycle_id");
    return createEditorialAiPublication(input);
  }

  async generate(command: EditorialGenerationCommand): Promise<EditorialGenerationResult> {
    const prompt = editorialPromptComposer.compose(command.editorialContext);

    await createEditorialAiRequest({
      cycle_id: command.parameters.cycleId,
      composed_instruction: prompt,
    });

    const response = await this.provider.generate({ instruction: prompt });

    await createEditorialAiResponse({
      cycle_id: command.parameters.cycleId,
      raw_response: response.rawText,
    });

    const parsed = editorialResponseParser.parse(response.rawText);

    await createEditorialAiContent({
      cycle_id: command.parameters.cycleId,
      version: 1,
      statement: parsed.elements.statement ?? null,
      alternatives: parsed.elements.alternatives.map((a) => `(${a.letter}) ${a.text}`),
      correct_answer: parsed.elements.correctAnswer ?? null,
      explanation: parsed.elements.explanation ?? null,
      context: parsed.elements.context ?? null,
      concept_reference: parsed.elements.conceptReference ?? null,
      cognitive_objective: parsed.elements.cognitiveObjective ?? null,
      bibliographic_reference: parsed.elements.bibliographicReference ?? null,
      editorial_metadata: { parserWarnings: parsed.warnings } as never,
    });

    // Etapa 7 (IA-005): anotações assistivas — nunca decidem sozinhas,
    // estado do ciclo permanece RASCUNHO_IA (decisão humana é IA-006).
    const annotations = await editorialValidator.validate({
      elements: parsed.elements,
      context: command.editorialContext,
    });
    for (const annotation of annotations) {
      await createEditorialAiAnnotation({
        cycle_id: command.parameters.cycleId,
        criterion: annotation.criterion,
        description: annotation.description,
      });
    }

    return {
      content: { rawText: response.rawText },
      metadata: response.metadata,
      usage: response.usage,
      persistenceHints: {
        cycleId: command.parameters.cycleId,
        generatedAt: new Date().toISOString(),
      },
    };
  }
}

export const editorialAiOrchestrator: EditorialAiOrchestrator = new DefaultEditorialAiOrchestrator(
  new ClaudeProvider(),
);
