export const ACERVO_PIPELINE_STAGES = [
  "PLANNED",
  "VERIFIED",
  "DOWNLOADED",
  "TEXT_EXTRACTED",
  "QUESTIONS_GENERATED",
  "REVIEW",
  "APPROVED",
  "IMPORTED",
  "PUBLISHED",
] as const;

export type AcervoPipelineStage = (typeof ACERVO_PIPELINE_STAGES)[number];

export type CatalogExamStatus =
  | "PLANNED"
  | "DOWNLOADED"
  | "PROCESSING"
  | "REVIEW"
  | "APPROVED"
  | "IMPORTED"
  | "PUBLISHED";

export type CatalogExam = {
  /** UUID no banco */
  catalogId: string;
  /** Slug usado nas rotas (ex.: ebserh-2025) */
  id: string;
  status: CatalogExamStatus;
  organization: string;
  contest: string;
  year: number;
  board: string;
  boardId: string;
  position: string;
  positionId: string;
  /** Total de questões importadas (legado: coluna "Questões" na tabela) */
  questions: number;
  importedQuestions: number;
  approvedQuestions: number;
  publishedQuestions: number;
  pdf: string;
  answerKey: string;
  storageFolder: string;
  notes: string;
  verified: boolean;
  pdfAvailable: boolean;
  answerKeyAvailable: boolean;
  /** Campos legados para compatibilidade com a UI existente */
  imported: boolean;
  reviewed: boolean;
  approved: boolean;
  package: string;
  observations: string;
};

export type WorkFileKey =
  | "prova"
  | "gabarito"
  | "edital"
  | "rawMd"
  | "questionsRaw"
  | "questionsJson";

export type WorkManifest = {
  pipelineStage: AcervoPipelineStage;
  files: Record<WorkFileKey, boolean>;
};

export type AcervoStats = {
  totalExams: number;
  publishedExams: number;
  importedQuestions: number;
  reviewedQuestions: number;
};
