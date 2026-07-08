import { generatePackageSlug } from "../../../src/lib/packages.ts";
import type { SeedDb } from "../taxonomy/entities.ts";
import {
  DEFAULT_QUESTIONS_DESCRIPTION,
  DEFAULT_QUESTIONS_VERSION,
  EXPORT_PAGE_SIZE,
  QUESTION_ENGINE_NAME,
  type SeedEnvironment,
} from "./metadata.ts";
import { parseAlternativesForSeed, readSeedMetadata } from "./entities.ts";
import { computeContentHashFromDb } from "./hash.ts";
import type { QuestionSeedItem, QuestionsMetadata, QuestionsSeedFile } from "./schema.ts";

type ExportRow = {
  id: string;
  statement: string;
  alternatives: unknown;
  correct_answer: string | null;
  explanation: string | null;
  year: number | null;
  metadata: unknown;
  subjects: { slug: string } | null;
  topics: { slug: string } | null;
  boards: { name: string } | null;
  exams: { name: string } | null;
  positions: { slug: string } | null;
};

export type ExportQuestionsOptions = {
  version?: string;
  description?: string;
  environment: SeedEnvironment;
};

/**
 * status e keywords existem no JSON como contrato do seed (versionamento / futuro).
 * O banco atual não persiste esses campos — export sempre emite ACTIVE e keywords: [].
 */
function rowToSeedItem(row: ExportRow): QuestionSeedItem & { contentHash: string } {
  const alternatives = parseAlternativesForSeed(row.alternatives);
  const correctAnswer = (row.correct_answer ?? "").toUpperCase();
  const contentHash = computeContentHashFromDb(row.statement, row.alternatives, row.correct_answer);
  const { references, source } = readSeedMetadata(row.metadata);

  const item: QuestionSeedItem & { contentHash: string } = {
    statement: row.statement,
    alternatives,
    correctAnswer,
    explanation: row.explanation ?? "",
    references,
    status: "ACTIVE",
    keywords: [],
    contentHash,
  };

  if (row.positions?.slug) item.position = row.positions.slug;
  if (row.boards?.name) item.board = generatePackageSlug(row.boards.name);
  if (row.exams?.name) item.contest = generatePackageSlug(row.exams.name);
  if (row.subjects?.slug) item.subject = row.subjects.slug;
  if (row.topics?.slug) item.topic = row.topics.slug;
  if (row.year != null) item.year = row.year;
  if (source && Object.keys(source).length) item.source = source;

  return {
    statement: item.statement,
    alternatives: item.alternatives,
    correctAnswer: item.correctAnswer,
    ...(item.position ? { position: item.position } : {}),
    ...(item.board ? { board: item.board } : {}),
    ...(item.contest ? { contest: item.contest } : {}),
    ...(item.subject ? { subject: item.subject } : {}),
    ...(item.topic ? { topic: item.topic } : {}),
    ...(item.year != null ? { year: item.year } : {}),
    explanation: item.explanation,
    references: item.references,
    status: item.status,
    keywords: item.keywords,
    ...(item.source ? { source: item.source } : {}),
    contentHash: item.contentHash,
  };
}

export async function exportQuestions(
  db: SeedDb,
  options: ExportQuestionsOptions,
): Promise<QuestionsSeedFile> {
  const exported: Array<QuestionSeedItem & { contentHash: string }> = [];
  let from = 0;

  while (true) {
    const { data, error } = await db
      .from("questions")
      .select(
        `id, statement, alternatives, correct_answer, explanation, year, metadata,
         subjects(slug),
         topics(slug),
         boards(name),
         exams(name),
         positions(slug)`,
      )
      .order("id", { ascending: true })
      .range(from, from + EXPORT_PAGE_SIZE - 1);
    if (error) throw error;
    if (!data?.length) break;

    for (const row of data as ExportRow[]) {
      exported.push(rowToSeedItem(row));
    }

    if (data.length < EXPORT_PAGE_SIZE) break;
    from += EXPORT_PAGE_SIZE;
  }

  exported.sort((a, b) => a.contentHash.localeCompare(b.contentHash));

  const metadata: QuestionsMetadata = {
    version: options.version ?? DEFAULT_QUESTIONS_VERSION,
    generatedAt: new Date().toISOString(),
    generatedBy: QUESTION_ENGINE_NAME,
    description: options.description ?? DEFAULT_QUESTIONS_DESCRIPTION,
    environment: options.environment,
  };

  return { metadata, questions: exported };
}
