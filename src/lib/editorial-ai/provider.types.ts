/**
 * Tipos compartilhados do contrato de provedor de IA (IT-009).
 * Apenas tipos — nenhuma lógica, nenhuma implementação, nenhum provedor
 * específico mencionado. Conexão real com um provedor é escopo de IT-010.
 */

export type EditorialAiGenerateRequest = {
  instruction: string;
};

export type EditorialAiUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  durationMs: number;
};

export type EditorialAiProviderMetadata = {
  providerName: string;
  providerVersion: string;
  modelIdentifier: string;
};

export type EditorialAiGenerateResponse = {
  rawText: string;
  usage: EditorialAiUsage;
  metadata: EditorialAiProviderMetadata;
};

export type EditorialAiProviderCapabilities = {
  supportsStreaming: boolean;
  supportsJson: boolean;
  supportsVision: boolean;
  supportsToolCalling: boolean;
  supportsThinking: boolean;
};
