import type {
  EditorialAiGenerateRequest,
  EditorialAiGenerateResponse,
  EditorialAiProviderCapabilities,
} from "./provider.types";

/**
 * Contrato do provedor de IA (IT-009): representa qualquer mecanismo de
 * geração de texto por IA, sem acoplamento a um provedor específico.
 * Apenas o contrato — nenhuma implementação existe nesta sprint. A conexão
 * real com um provedor é escopo de IT-010; até lá, o Provider não participa
 * da execução (Orchestrator → Service → Repository → Supabase).
 */
export interface EditorialAiProvider {
  readonly capabilities: EditorialAiProviderCapabilities;
  generate(request: EditorialAiGenerateRequest): Promise<EditorialAiGenerateResponse>;
}
