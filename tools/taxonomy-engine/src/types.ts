export type EntityKind = "course" | "position" | "subject" | "topic" | "board" | "contest";

export type SeedStatus = "ACTIVE" | "INACTIVE";

export interface TaxonomyMetadata {
  version: string;
  generatedAt: string;
  generatedBy: string;
  description: string;
  environment: string;
}

export interface TaxonomyEntityBase {
  id: string;
  kind: EntityKind;
  name: string;
  slug: string;
  status: SeedStatus;
  order: number;
  /** Reservado para sinônimos futuros no seed — vazio nesta versão. */
  synonyms: string[];
  searchText: string;
}

export interface CourseRecord extends TaxonomyEntityBase {
  kind: "course";
  description: string | null;
}

export interface PositionRecord extends TaxonomyEntityBase {
  kind: "position";
  courseSlug: string;
  courseName: string;
  description: string | null;
}

export interface SubjectRecord extends TaxonomyEntityBase {
  kind: "subject";
  courseSlug: string;
  courseName: string;
}

export interface TopicRecord extends TaxonomyEntityBase {
  kind: "topic";
  courseSlug: string;
  courseName: string;
  subjectSlug: string;
  subjectName: string;
}

export interface BoardRecord extends TaxonomyEntityBase {
  kind: "board";
  acronym: string | null;
}

export interface ContestRecord extends TaxonomyEntityBase {
  kind: "contest";
  boardSlug: string;
  boardName: string;
  year: number | null;
}

export type TaxonomyRecord =
  | CourseRecord
  | PositionRecord
  | SubjectRecord
  | TopicRecord
  | BoardRecord
  | ContestRecord;

export interface TaxonomyCounts {
  courses: number;
  positions: number;
  subjects: number;
  topics: number;
  boards: number;
  contests: number;
  total: number;
}

export interface TaxonomyIndex {
  metadata: TaxonomyMetadata;
  sourcePath: string;
  generatedAt: string;
  counts: TaxonomyCounts;
  records: TaxonomyRecord[];
  byId: Map<string, TaxonomyRecord>;
  bySlug: Map<string, TaxonomyRecord[]>;
  byKind: Map<EntityKind, TaxonomyRecord[]>;
}

export interface ValidationIssue {
  check: string;
  detail: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
}

export interface SearchOptions {
  kind?: EntityKind;
  limit?: number;
  /** Incluir sinônimos na busca (quando populados). Default: true. */
  includeSynonyms?: boolean;
}

export interface SearchResult {
  record: TaxonomyRecord;
  score: number;
  matchedOn: "name" | "slug" | "synonym";
}

/** Formato serializado de `taxonomy.index.json` para consultas rápidas. */
export interface TaxonomyIndexFile {
  metadata: TaxonomyMetadata;
  sourcePath: string;
  generatedAt: string;
  counts: TaxonomyCounts;
  records: TaxonomyRecord[];
}
