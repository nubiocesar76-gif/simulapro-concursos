import Anthropic from "@anthropic-ai/sdk";
import { VERSION as ANTHROPIC_SDK_VERSION } from "@anthropic-ai/sdk/version";
import type { EditorialAiProvider } from "../provider";
import type {
  EditorialAiGenerateRequest,
  EditorialAiGenerateResponse,
  EditorialAiProviderCapabilities,
} from "../provider.types";

/**
 * Primeira implementação concreta de EditorialAiProvider (IT-010).
 *
 * Responsabilidade única: receber EditorialAiGenerateRequest, chamar o SDK
 * oficial da Anthropic e converter a resposta para EditorialAiGenerateResponse.
 * Não conhece Batch, Cycle, Repository, Service, Orchestrator ou Supabase.
 * Não monta prompt editorial — apenas encaminha `request.instruction` como
 * está. Ainda não está conectado a nenhum ponto do fluxo (IT-011+).
 *
 * Dependência: pacote `@anthropic-ai/sdk` (SDK oficial da Anthropic),
 * instalado na versão estável ^0.112.5 (IT-010A).
 */

const CAPABILITIES: EditorialAiProviderCapabilities = {
  supportsStreaming: false,
  supportsJson: false,
  supportsVision: false,
  supportsToolCalling: false,
  supportsThinking: false,
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

function requireEnvInt(name: string): number {
  const raw = requireEnv(name);
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`Variável de ambiente ${name} deve ser um número inteiro positivo.`);
  }
  return parsed;
}

export class ClaudeProvider implements EditorialAiProvider {
  readonly capabilities: EditorialAiProviderCapabilities = CAPABILITIES;

  private readonly client: Anthropic;
  private readonly model: string;
  private readonly maxTokens: number;

  constructor() {
    const apiKey = requireEnv("ANTHROPIC_API_KEY");
    this.model = requireEnv("ANTHROPIC_MODEL");
    this.maxTokens = requireEnvInt("ANTHROPIC_MAX_TOKENS");
    this.client = new Anthropic({ apiKey });
  }

  async generate(request: EditorialAiGenerateRequest): Promise<EditorialAiGenerateResponse> {
    const startedAt = Date.now();

    let response: Anthropic.Message;
    try {
      response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [{ role: "user", content: request.instruction }],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "erro desconhecido";
      throw new Error(`Falha ao chamar o provedor de IA (Claude): ${message}`);
    }

    const durationMs = Date.now() - startedAt;

    const rawText = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return {
      rawText,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        durationMs,
      },
      metadata: {
        providerName: "anthropic",
        providerVersion: ANTHROPIC_SDK_VERSION,
        modelIdentifier: response.model,
      },
    };
  }
}
