/**
 * Utilitários compartilhados de questões.
 * Usado pelo módulo Questões; preparado para reutilização futura pela Importação.
 */

export type QuestionAlternative = { letter: string; text: string };

export type QuestionMetadataFields = {
  image_url: string;
  bibliography: string;
  legal_reference: string;
};

export const DIFFICULTY_OPTIONS = ["Fácil", "Média", "Difícil"] as const;

export function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

/** Converte alternativas do banco (JSON) para estrutura editável. */
export function parseAlternativesFromDb(value: unknown): QuestionAlternative[] {
  if (!value) return [{ letter: "A", text: "" }, { letter: "B", text: "" }];
  const items = Array.isArray(value) ? value : null;
  if (!items?.length) return [{ letter: "A", text: "" }, { letter: "B", text: "" }];

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

export function parseMetadataFields(metadata: unknown): QuestionMetadataFields {
  const m = (metadata && typeof metadata === "object" ? metadata : {}) as Record<string, unknown>;
  return {
    image_url: normalizeText(m.image_url),
    bibliography: normalizeText(m.bibliography),
    legal_reference: normalizeText(m.legal_reference),
  };
}

export function buildQuestionMetadata(fields: QuestionMetadataFields): Record<string, string> | null {
  const metadata: Record<string, string> = {};
  if (fields.image_url) metadata.image_url = fields.image_url;
  if (fields.bibliography) metadata.bibliography = fields.bibliography;
  if (fields.legal_reference) metadata.legal_reference = fields.legal_reference;
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
  const parts = s.split(/\||\n/).map((p) => p.trim()).filter(Boolean);
  return parts.length ? parts : null;
}
