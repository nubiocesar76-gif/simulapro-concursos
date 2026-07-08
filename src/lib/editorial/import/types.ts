export type EditorialPackageManifest = {
  engine_version: string;
  architecture_version: string;
  course_slug: string;
  position_slug: string;
  architecture_slug: string;
  architecture_name: string;
  description?: string;
  required_files: string[];
  optional_files?: string[];
};

export type SourceDiscipline = {
  id: string;
  nome: string;
  descricao?: string;
  frequencia_percentual?: number;
  prioridade?: "ALTA" | "MEDIA" | "BAIXA";
  observacoes?: string;
};

export type SourceTopic = {
  id: string;
  disciplina_id: string;
  nome: string;
  descricao?: string;
  frequencia?: string;
  prioridade?: string;
};

export type SourceSubtopic = {
  id: string;
  assunto_id: string;
  nome: string;
  descricao?: string;
  slug: string;
};

export type SourceKeyword = {
  id: string;
  subassunto_id: string;
  palavra: string;
  peso: number;
  tipo: "PRINCIPAL" | "SECUNDARIA" | "FRACA";
};

export type SourceRule = {
  id: string;
  se_encontrar: string[];
  disciplina_id: string;
  disciplina?: string;
  assunto_id?: string;
  subassunto_id?: string;
  confianca_percentual: number;
};

export type EditorialPackage = {
  path: string;
  manifest: EditorialPackageManifest;
  filesRead: string[];
  disciplines: SourceDiscipline[];
  topics: SourceTopic[];
  subtopics: SourceSubtopic[];
  keywords: SourceKeyword[];
  rules: SourceRule[];
};

export type ValidationIssue = {
  level: "error" | "warning";
  code: string;
  message: string;
  entity?: string;
  ref?: string;
};

export type EntityPreviewCounts = {
  total: number;
  new: number;
  updated: number;
  removed: number;
  unchanged: number;
};

export type ImportPreview = {
  packagePath: string;
  manifest: EditorialPackageManifest;
  filesRead: string[];
  validation: {
    valid: boolean;
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
  };
  counts: {
    architectures: EntityPreviewCounts;
    disciplines: EntityPreviewCounts;
    topics: EntityPreviewCounts;
    subtopics: EntityPreviewCounts;
    keywords: EntityPreviewCounts;
    rules: EntityPreviewCounts;
    evidence: EntityPreviewCounts;
  };
  architectureId: string | null;
};

export type ImportRecordCounts = {
  architectures: number;
  disciplines: number;
  topics: number;
  subtopics: number;
  keywords: number;
  rules: number;
  deprecated: number;
  changelog: number;
};

export type ImportResult = {
  success: boolean;
  logId: string;
  architectureId: string;
  durationMs: number;
  recordCounts: ImportRecordCounts;
  importedFiles: string[];
};

export type EditorialPackageSummary = {
  path: string;
  label: string;
  manifest: EditorialPackageManifest;
};
