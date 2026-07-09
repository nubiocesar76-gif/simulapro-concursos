import { computeContentHash } from "./hash.ts";
import {
  buildSeedMetadata,
  formatAlternativesForDb as formatAlternatives,
  loadQuestionIndex,
  loadTaxonomyMaps,
  resolveQuestionTaxonomyIds,
} from "./entities.ts";
import { INSERT_BATCH_SIZE } from "./metadata.ts";
import type { QuestionSeedItem, QuestionsSeedFile } from "./schema.ts";
import type { SeedDb } from "../taxonomy/entities.ts";
import type { QuestionSeedReport } from "../core/question-report.ts";
import { ignoreQuestion } from "../core/question-report.ts";
import type { Json } from "@/integrations/supabase/types";

/**
 * status e keywords existem no JSON como contrato do seed (versionamento / futuro).
 * O banco atual não persiste esses campos — não são gravados na importação.
 */
type InsertRow = {
  statement: string;
  alternatives: string[];
  correct_answer: string;
  explanation: string | null;
  year: number | null;
  subject_id: string | null;
  topic_id: string | null;
  board_id: string | null;
  exam_id: string | null;
  position_id: string | null;
  package_version_id: string | null;
  metadata: Record<string, unknown>;
  contentHash: string;
};

async function flushBatch(db: SeedDb, batch: InsertRow[], report: QuestionSeedReport) {
  if (!batch.length) return;

  const rows = batch.map(({ contentHash: _hash, metadata, ...row }) => ({
    ...row,
    metadata: metadata as Json,
  }));
  const { error } = await db.from("questions").insert(rows);
  if (error) throw error;
  report.questionsCreated += batch.length;
  batch.length = 0;
}

export async function seedQuestions(db: SeedDb, file: QuestionsSeedFile, report: QuestionSeedReport) {
  const [maps, index] = await Promise.all([loadTaxonomyMaps(db), loadQuestionIndex(db)]);
  const sorted = [...file.questions].sort((a, b) => {
    const hashA = computeContentHash(a.statement, a.alternatives, a.correctAnswer);
    const hashB = computeContentHash(b.statement, b.alternatives, b.correctAnswer);
    return hashA.localeCompare(hashB);
  });

  const batch: InsertRow[] = [];

  for (const item of sorted) {
    const contentHash = computeContentHash(item.statement, item.alternatives, item.correctAnswer);
    if (index.has(contentHash)) {
      ignoreQuestion(report, contentHash.slice(0, 12));
      continue;
    }

    const taxonomyIds = await resolveQuestionTaxonomyIds(db, item, maps);
    batch.push({
      statement: item.statement.trim(),
      alternatives: formatAlternatives(item.alternatives),
      correct_answer: item.correctAnswer.toUpperCase(),
      explanation: item.explanation?.trim() || null,
      year: item.year ?? null,
      ...taxonomyIds,
      metadata: buildSeedMetadata(item, contentHash),
      contentHash,
    });
    index.set(contentHash, "pending");

    if (batch.length >= INSERT_BATCH_SIZE) {
      await flushBatch(db, batch, report);
    }
  }

  await flushBatch(db, batch, report);
}
