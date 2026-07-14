export type QuestionStatus = "VALID" | "ANULADA" | "REVIEW_REQUIRED";

export interface RawQuestion {
  number: number;
  statement: string;
  alternatives: Partial<Record<"A" | "B" | "C" | "D" | "E", string>>;
  correctAnswer: string | null;
  status: QuestionStatus;
  page: number | null;
  warnings: string[];
}

export interface GabaritoEntry {
  number: number;
  answer: string | null;
  anulada: boolean;
}

export interface ExtractionReport {
  totalFound: number;
  valid: number;
  anuladas: number;
  reviewRequired: number;
  withoutGabarito: number;
  withoutCompleteAlternatives: number;
  duplicateNumbers: number[];
  generatedAt: string;
}

/** Entrada humana (ou futura IA) em classification.template.json — uma por questão do raw. */
export interface ClassificationEntry {
  question: number;
  board: string;
  contest: string;
  position: string;
  subject: string;
  topic: string;
  year: string;
  difficulty: string;
  keywords: string[];
  explanation: string;
}

export interface ValidationIssue {
  check: string;
  detail: string;
}

/** Campos semânticos exigidos antes do merge produzir um CSV pronto para convert:questions. */
export const REQUIRED_CLASSIFICATION_FIELDS = [
  "board",
  "contest",
  "position",
  "subject",
  "topic",
  "year",
  "explanation",
] as const satisfies ReadonlyArray<keyof ClassificationEntry>;
