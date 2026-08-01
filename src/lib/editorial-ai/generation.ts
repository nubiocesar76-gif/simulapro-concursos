import type { EditorialPromptContext } from "./prompt-composer";
import type { EditorialAiProviderMetadata, EditorialAiUsage } from "./provider.types";
import type { EditorialAiDecisionType } from "./types";

/**
 * Contrato de uma solicitação completa de geração editorial (IT-013).
 * Representa a entrada e a saída oficiais do Orchestrator para um ciclo de
 * geração. Apenas tipos — nenhuma lógica, nenhuma classe, nenhum método.
 */

export type EditorialGenerationParameters = {
  cycleId: string;
  batchId?: string;
};

export type EditorialGenerationExecutionOptions = {
  dryRun?: boolean;
};

/**
 * Tudo que o Orchestrator precisa receber para conduzir um ciclo de
 * geração: o contexto editorial já resolvido (mesmo contrato do Prompt
 * Composer, IT-012), os parâmetros do ciclo e as opções de execução.
 */
export type EditorialGenerationCommand = {
  editorialContext: EditorialPromptContext;
  parameters: EditorialGenerationParameters;
  executionOptions: EditorialGenerationExecutionOptions;
};

export type EditorialGenerationContent = {
  rawText: string;
};

/**
 * Informações necessárias para que uma sprint futura registre o resultado
 * via camada de serviços — apenas valores já conhecidos por quem emitiu o
 * comando, nunca uma entidade de banco, ID do Supabase ou DTO de Repository.
 */
export type EditorialGenerationPersistenceHints = {
  cycleId: string;
  generatedAt: string;
};

/**
 * Tudo que o Orchestrator devolverá ao final de um ciclo de geração.
 */
export type EditorialGenerationResult = {
  content: EditorialGenerationContent;
  metadata: EditorialAiProviderMetadata;
  usage: EditorialAiUsage;
  persistenceHints: EditorialGenerationPersistenceHints;
};

/**
 * Contrato de domínio de uma decisão editorial futura (IT-020).
 * Apenas o tipo — nenhuma persistência, nenhuma lógica de aprovação,
 * nenhuma heurística. `status` reaproveita o vocabulário já homologado em
 * IA-006/IT-005 (auditoria, homologação, reprovação, decisão de
 * publicação); `actorId` existe porque IA-006 exige, sem exceção, um ator
 * humano identificável em qualquer decisão editorial.
 */
export type EditorialDecision = {
  status: EditorialAiDecisionType;
  actorId: string;
  reason?: string;
  createdAt: string;
};

/**
 * Contrato de domínio de uma revisão editorial em andamento (ER-001).
 * Apenas o tipo — nenhuma persistência, nenhuma lógica, nenhuma classe.
 *
 * EditorialReview NÃO é EditorialDecision: a revisão identifica o
 * *processo* (quem está revisando qual conteúdo, desde quando); a decisão
 * (IT-020) representa o *resultado* desse processo, quando ele terminar.
 * Por isso este tipo não tem nenhum campo de status/resultado.
 */
export type EditorialReview = {
  reviewId: string;
  contentId: string;
  reviewerId: string;
  startedAt: string;
};
