import { RESPONSE_SECTION_LABELS } from "./prompt-composer.server";
import type {
  EditorialParsedAlternative,
  EditorialParsedElements,
  EditorialParsedResponse,
  EditorialResponseParser,
} from "./response-parser";

const LABEL_ORDER = [
  RESPONSE_SECTION_LABELS.enunciado,
  RESPONSE_SECTION_LABELS.contexto,
  RESPONSE_SECTION_LABELS.alternativas,
  RESPONSE_SECTION_LABELS.gabarito,
  RESPONSE_SECTION_LABELS.justificativa,
  RESPONSE_SECTION_LABELS.referenciaConceito,
  RESPONSE_SECTION_LABELS.objetivoCognitivo,
  RESPONSE_SECTION_LABELS.referenciaBibliografica,
] as const;

/**
 * Recorta o texto bruto em `{ label: conteúdo }`, casando linhas
 * `LABEL:` (uma das RESPONSE_SECTION_LABELS) até o próximo rótulo
 * reconhecido ou fim do texto. Puramente estrutural — não julga se o
 * conteúdo faz sentido (IA-004).
 */
function splitLabeledSections(rawText: string): Map<string, string> {
  const sections = new Map<string, string>();
  const labelPattern = new RegExp(`^(${LABEL_ORDER.join("|")}):\\s*(.*)$`);

  const lines = rawText.split(/\r?\n/);
  let currentLabel: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (currentLabel) {
      sections.set(currentLabel, buffer.join("\n").trim());
    }
    buffer = [];
  };

  for (const line of lines) {
    const match = line.match(labelPattern);
    if (match) {
      flush();
      currentLabel = match[1];
      buffer = match[2] ? [match[2]] : [];
    } else if (currentLabel) {
      buffer.push(line);
    }
  }
  flush();

  return sections;
}

const ALTERNATIVE_LINE = /^\(([A-E])\)\s*(.+)$/;

function parseAlternatives(block: string | undefined): EditorialParsedAlternative[] {
  if (!block) return [];
  const alternatives: EditorialParsedAlternative[] = [];
  for (const line of block.split(/\r?\n/)) {
    const match = line.trim().match(ALTERNATIVE_LINE);
    if (match) {
      alternatives.push({
        letter: match[1] as EditorialParsedAlternative["letter"],
        text: match[2].trim(),
      });
    }
  }
  return alternatives;
}

function parseCorrectAnswer(block: string | undefined): string | undefined {
  if (!block) return undefined;
  const match = block.trim().match(/^[A-E]/);
  return match ? match[0] : undefined;
}

export class DefaultEditorialResponseParser implements EditorialResponseParser {
  parse(rawText: string): EditorialParsedResponse {
    const warnings: string[] = [];
    if (rawText.trim().length === 0) {
      warnings.push("Resposta vazia recebida do provedor.");
      return {
        content: rawText,
        elements: { alternatives: [] },
        metadata: { characterCount: rawText.length, parsedAt: new Date().toISOString() },
        notes: [],
        warnings,
      };
    }

    const sections = splitLabeledSections(rawText);
    const l = RESPONSE_SECTION_LABELS;

    const elements: EditorialParsedElements = {
      statement: sections.get(l.enunciado) || undefined,
      context: sections.get(l.contexto) || undefined,
      alternatives: parseAlternatives(sections.get(l.alternativas)),
      correctAnswer: parseCorrectAnswer(sections.get(l.gabarito)),
      explanation: sections.get(l.justificativa) || undefined,
      conceptReference: sections.get(l.referenciaConceito) || undefined,
      cognitiveObjective: sections.get(l.objetivoCognitivo) || undefined,
      bibliographicReference: sections.get(l.referenciaBibliografica) || undefined,
    };

    if (!elements.statement) warnings.push(`Seção ${l.enunciado} ausente ou vazia.`);
    if (elements.alternatives.length === 0)
      warnings.push(`Seção ${l.alternativas} ausente ou sem alternativas reconhecíveis.`);
    if (!elements.correctAnswer)
      warnings.push(`Seção ${l.gabarito} ausente ou não é uma letra A-E.`);
    if (!elements.explanation) warnings.push(`Seção ${l.justificativa} ausente ou vazia.`);
    if (!elements.bibliographicReference)
      warnings.push(`Seção ${l.referenciaBibliografica} ausente ou vazia.`);

    return {
      content: rawText,
      elements,
      metadata: {
        characterCount: rawText.length,
        parsedAt: new Date().toISOString(),
      },
      notes: [],
      warnings,
    };
  }
}

export const editorialResponseParser: EditorialResponseParser =
  new DefaultEditorialResponseParser();
