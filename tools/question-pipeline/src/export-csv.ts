import type { RawQuestion } from "./types.ts";
import { buildCsv } from "./csv.ts";

export const CSV_HEADER = [
  "statement",
  "alternative_a",
  "alternative_b",
  "alternative_c",
  "alternative_d",
  "alternative_e",
  "correct_answer",
  "position",
  "board",
  "contest",
  "subject",
  "topic",
  "year",
  "explanation",
  "organization",
  "exam",
  "page",
  "question",
  "references",
  "keywords",
  "status",
  "package",
  "package_version",
] as const;

export interface ExportSummary {
  totalInput: number;
  exported: number;
  skippedAnuladas: number;
  reviewRequiredExported: number;
}

/**
 * Converts questions.raw.json into rows compatible with the CSV schema
 * expected by scripts/seed/questions/convert (docs/imports/questions.csv).
 *
 * Only fields that are actually present in the raw extraction are filled
 * in (statement, alternatives, correctAnswer, page, question). Fields that
 * require domain classification — position, board, contest, subject,
 * topic, year, explanation, organization, exam — are NOT derivable from a
 * mechanical PDF extraction and are intentionally left blank rather than
 * guessed; filling them in remains a human step before the CSV can be fed
 * to `npm run convert:questions`.
 *
 * ANULADA questions are excluded entirely, matching the project-wide rule
 * that anuladas never enter docs/imports/questions.csv. REVIEW_REQUIRED
 * questions are kept (never discarded) and flagged via the `keywords`
 * column so they're easy to find and are exported with a status of
 * "INACTIVE" so they can never be seeded into the bank until a human
 * confirms and completes them.
 */
export function exportQuestionsToCsv(questions: RawQuestion[]): { csv: string; summary: ExportSummary } {
  const rows: Array<Array<string | number | null>> = [];
  let skippedAnuladas = 0;
  let reviewRequiredExported = 0;

  for (const q of questions) {
    if (q.status === "ANULADA") {
      skippedAnuladas++;
      continue;
    }

    const needsReview = q.status === "REVIEW_REQUIRED";
    if (needsReview) reviewRequiredExported++;

    rows.push([
      q.statement,
      q.alternatives.A ?? "",
      q.alternatives.B ?? "",
      q.alternatives.C ?? "",
      q.alternatives.D ?? "",
      q.alternatives.E ?? "",
      q.correctAnswer ?? "",
      "", // position — requer classificação humana
      "", // board — requer classificação humana
      "", // contest — requer classificação humana
      "", // subject — requer classificação humana
      "", // topic — requer classificação humana
      "", // year — requer classificação humana
      "", // explanation — requer autoria humana
      "", // organization
      "", // exam
      q.page ?? "",
      q.number,
      "", // references
      needsReview ? "pipeline:REVIEW_REQUIRED" : "",
      needsReview ? "INACTIVE" : "ACTIVE",
      "", // package
      "", // package_version
    ]);
  }

  return {
    csv: buildCsv([...CSV_HEADER], rows),
    summary: {
      totalInput: questions.length,
      exported: rows.length,
      skippedAnuladas,
      reviewRequiredExported,
    },
  };
}
