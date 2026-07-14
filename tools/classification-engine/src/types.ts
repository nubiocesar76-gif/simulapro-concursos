export type IssueSeverity = "ERROR" | "WARNING";

export type IssueCode =
  | "JSON_INVÁLIDO"
  | "DISCIPLINA_INEXISTENTE"
  | "ASSUNTO_INEXISTENTE"
  | "ASSUNTO_FORA_DA_DISCIPLINA"
  | "BANCA_INEXISTENTE"
  | "CONCURSO_INEXISTENTE"
  | "CARGO_INEXISTENTE"
  | "ANO_INVALIDO"
  | "KEYWORD_DUPLICADA"
  | "KEYWORD_FORA_DO_PADRÃO"
  | "DIFICULDADE_INVALIDA"
  | "EXPLICAÇÃO_VAZIA"
  | "REGRA_EDITORIAL_DESCUMPRIDA"
  | "CLASSIFICACAO_AUSENTE"
  | "QUESTAO_ORFA";

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

export interface RawQuestionRef {
  number: number;
  status: "VALID" | "ANULADA" | "REVIEW_REQUIRED";
}

export interface ClassificationIssue {
  question: number | null;
  severity: IssueSeverity;
  code: IssueCode;
  message: string;
  suggestion: string;
  ruleId?: string;
}

export interface ClassificationReportSummary {
  questions: number;
  approved: number;
  warnings: number;
  errors: number;
  skippedAnuladas: number;
}

export interface ClassificationReport {
  generatedAt: string;
  inputs: {
    rawPath: string;
    classificationPath: string;
    taxonomyIndexPath: string;
    editorialRulesPath: string;
  };
  summary: ClassificationReportSummary;
  issues: ClassificationIssue[];
}

export interface LoadedClassificationInput {
  raw: RawQuestionRef[];
  classifications: ClassificationEntry[];
  rawPath: string;
  classificationPath: string;
}

export interface EditorialRulesConfig {
  editorialDir: string;
  loaded: boolean;
  difficultyValues: readonly string[];
  yearMin: number;
  yearMax: number;
  keywordsMin: number;
  keywordsMax: number;
  keywordMaxLength: number;
  legacySubjectSlugs: readonly string[];
  allowedKeywordPrefixes: readonly string[];
}

export interface ValidationContext {
  taxonomyIndexPath: string;
  editorial: EditorialRulesConfig;
}
