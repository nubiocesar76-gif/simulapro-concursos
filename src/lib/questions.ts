/**
 * Utilitários compartilhados de questões.
 * Usado pelo módulo Questões; preparado para reutilização futura pela Importação.
 */

export type QuestionAlternative = { letter: string; text: string };

export type QuestionMetadataFields = {
  image_url: string;
  bibliography: string;
  legal_reference: string;
  // SIA (Sistema de Inteligência de Aprendizagem) — campos opcionais por questão.
  // Nenhum é obrigatório: ausência = bloco correspondente simplesmente não
  // renderiza (ver docs do plano SIA V1). `sia_tags` é o único array; os
  // demais são texto livre, mesmo padrão de `bibliography`/`legal_reference`.
  sia_tags: string[];
  sia_error_reason_category: string;
  sia_error_reason_detail: string;
  sia_pegadinha_trigger: string;
  sia_pegadinha_explanation: string;
  // Um trecho citado (substring exata do enunciado) por linha — nunca número
  // de linha bruto, para não quebrar se o enunciado for editado depois.
  sia_long_text_key_excerpts: string;
  sia_long_text_note: string;
  sia_interpretation_trigger: string;
  sia_interpretation_explanation: string;
  sia_calculation_steps: string;
  sia_calculation_common_error: string;
};

export const DIFFICULTY_OPTIONS = ["Fácil", "Média", "Difícil"] as const;

export function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

/** Converte alternativas do banco (JSON) para estrutura editável. */
export function parseAlternativesFromDb(value: unknown): QuestionAlternative[] {
  if (!value)
    return [
      { letter: "A", text: "" },
      { letter: "B", text: "" },
    ];
  const items = Array.isArray(value) ? value : null;
  if (!items?.length)
    return [
      { letter: "A", text: "" },
      { letter: "B", text: "" },
    ];

  return items.map((item, index) => {
    const raw = normalizeText(item);
    const match = raw.match(/^([A-Z])\)\s*(.*)$/i);
    if (match) return { letter: match[1].toUpperCase(), text: match[2] };
    return { letter: String.fromCharCode(65 + index), text: raw };
  });
}

/** Serializa alternativas para o formato JSON do banco. */
export function formatAlternativesForDb(alternatives: QuestionAlternative[]): string[] {
  return alternatives
    .filter((a) => normalizeText(a.text))
    .map((a) => `${a.letter.toUpperCase()}) ${normalizeText(a.text)}`);
}

/** Parse tolerante — nunca lança, mesmo com JSON malformado ou tipo inesperado. */
function parseSiaTags(raw: unknown): string[] {
  const s = normalizeText(raw);
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) {
      return parsed.filter((t): t is string => typeof t === "string" && t.trim().length > 0);
    }
  } catch {
    // Nunca lança — metadado inválido vira lista vazia (bloco de tags some).
  }
  return [];
}

export function parseMetadataFields(metadata: unknown): QuestionMetadataFields {
  const m = (metadata && typeof metadata === "object" ? metadata : {}) as Record<string, unknown>;
  return {
    image_url: normalizeText(m.image_url),
    bibliography: normalizeText(m.bibliography),
    legal_reference: normalizeText(m.legal_reference),
    sia_tags: parseSiaTags(m.sia_tags),
    sia_error_reason_category: normalizeText(m.sia_error_reason_category),
    sia_error_reason_detail: normalizeText(m.sia_error_reason_detail),
    sia_pegadinha_trigger: normalizeText(m.sia_pegadinha_trigger),
    sia_pegadinha_explanation: normalizeText(m.sia_pegadinha_explanation),
    sia_long_text_key_excerpts: normalizeText(m.sia_long_text_key_excerpts),
    sia_long_text_note: normalizeText(m.sia_long_text_note),
    sia_interpretation_trigger: normalizeText(m.sia_interpretation_trigger),
    sia_interpretation_explanation: normalizeText(m.sia_interpretation_explanation),
    sia_calculation_steps: normalizeText(m.sia_calculation_steps),
    sia_calculation_common_error: normalizeText(m.sia_calculation_common_error),
  };
}

export function buildQuestionMetadata(
  fields: QuestionMetadataFields,
): Record<string, string> | null {
  const metadata: Record<string, string> = {};
  if (fields.image_url) metadata.image_url = fields.image_url;
  if (fields.bibliography) metadata.bibliography = fields.bibliography;
  if (fields.legal_reference) metadata.legal_reference = fields.legal_reference;
  if (fields.sia_tags.length) metadata.sia_tags = JSON.stringify(fields.sia_tags);
  if (fields.sia_error_reason_category)
    metadata.sia_error_reason_category = fields.sia_error_reason_category;
  if (fields.sia_error_reason_detail)
    metadata.sia_error_reason_detail = fields.sia_error_reason_detail;
  if (fields.sia_pegadinha_trigger) metadata.sia_pegadinha_trigger = fields.sia_pegadinha_trigger;
  if (fields.sia_pegadinha_explanation)
    metadata.sia_pegadinha_explanation = fields.sia_pegadinha_explanation;
  if (fields.sia_long_text_key_excerpts)
    metadata.sia_long_text_key_excerpts = fields.sia_long_text_key_excerpts;
  if (fields.sia_long_text_note) metadata.sia_long_text_note = fields.sia_long_text_note;
  if (fields.sia_interpretation_trigger)
    metadata.sia_interpretation_trigger = fields.sia_interpretation_trigger;
  if (fields.sia_interpretation_explanation)
    metadata.sia_interpretation_explanation = fields.sia_interpretation_explanation;
  if (fields.sia_calculation_steps) metadata.sia_calculation_steps = fields.sia_calculation_steps;
  if (fields.sia_calculation_common_error)
    metadata.sia_calculation_common_error = fields.sia_calculation_common_error;
  return Object.keys(metadata).length ? metadata : null;
}

export function validateQuestionInput(input: {
  statement: string;
  alternatives: QuestionAlternative[];
  correctAnswer: string;
  year: string;
}) {
  const statement = normalizeText(input.statement);
  if (!statement) throw new Error("Enunciado é obrigatório.");
  if (statement.length < 10) throw new Error("Enunciado deve ter pelo menos 10 caracteres.");

  const formatted = formatAlternativesForDb(input.alternatives);
  if (formatted.length < 2) throw new Error("Informe pelo menos 2 alternativas.");

  const correctAnswer = normalizeText(input.correctAnswer).toUpperCase();
  if (!correctAnswer) throw new Error("Gabarito é obrigatório.");
  if (!/^[A-Z]$/.test(correctAnswer)) throw new Error("Gabarito deve ser uma letra (A, B, C...).");

  const letters = formatted.map((a) => a.charAt(0).toUpperCase());
  if (!letters.includes(correctAnswer)) {
    throw new Error("Gabarito deve corresponder a uma das alternativas informadas.");
  }

  let year: number | null = null;
  if (normalizeText(input.year)) {
    year = Number(input.year);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      throw new Error("Ano deve ser um número entre 1900 e 2100.");
    }
  }

  return { statement, alternatives: formatted, correctAnswer, year };
}

export function formatQuestionError(message: string) {
  if (message.includes("row-level security")) {
    return "Sem permissão para esta operação. Verifique se seu usuário possui role admin.";
  }
  return message;
}

/** Parser de alternativas em texto (pipe/newline) — compatível com importação. */
export function parseAlternativesText(value: unknown): string[] | null {
  if (Array.isArray(value)) return value.map((v) => normalizeText(v)).filter(Boolean);
  const s = normalizeText(value);
  if (!s) return null;
  if (s.startsWith("[")) {
    try {
      const parsed = JSON.parse(s);
      return Array.isArray(parsed) ? parsed.map((v) => normalizeText(v)).filter(Boolean) : null;
    } catch {
      return null;
    }
  }
  const parts = s
    .split(/\||\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : null;
}
