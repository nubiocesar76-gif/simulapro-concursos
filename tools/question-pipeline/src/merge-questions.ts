import type { ClassificationEntry, RawQuestion, ValidationIssue } from "./types.ts";
import { CSV_HEADER } from "./export-csv.ts";
import { buildCsv } from "./csv.ts";
import {
  validateRawClassificationAlignment,
  validateRequiredClassificationFields,
} from "./validate-classification.ts";

export interface MergeSummary {
  totalRaw: number;
  totalClassification: number;
  skippedAnuladas: number;
  exported: number;
  reviewRequiredExported: number;
}

function formatKeywords(entry: ClassificationEntry, needsReview: boolean): string {
  const parts = [...entry.keywords.filter((k) => k.trim() !== "")];
  if (entry.difficulty.trim()) {
    parts.push(`difficulty:${entry.difficulty.trim()}`);
  }
  if (needsReview) {
    parts.push("pipeline:REVIEW_REQUIRED");
  }
  return parts.join("; ");
}

/**
 * Une questions.raw.json + classification.template.json em linhas CSV.
 * Nenhum dado extraído ou classificado é descartado (exceto ANULADA, mesma regra do projeto).
 */
export function mergeQuestionsToCsv(
  raw: RawQuestion[],
  classifications: ClassificationEntry[],
  options: { requireFilledFields?: boolean } = {},
): { csv: string; summary: MergeSummary; issues: ValidationIssue[] } {
  const requireFilledFields = options.requireFilledFields ?? true;
  const issues: ValidationIssue[] = [];

  issues.push(...validateRawClassificationAlignment(raw, classifications));

  const rawByNumber = new Map(raw.map((q) => [q.number, q]));
  const classByNumber = new Map(classifications.map((c) => [c.question, c]));

  if (requireFilledFields) {
    issues.push(...validateRequiredClassificationFields(classifications, rawByNumber));
  }

  const blockingChecks = new Set([
    "json_invalido",
    "numero_repetido",
    "questao_duplicada",
    "numero_ausente",
    "classificacao_ausente",
  ]);
  const hasBlocking = issues.some((i) => blockingChecks.has(i.check));
  const hasEmptyRequired = issues.some((i) => i.check === "campo_obrigatorio_vazio");

  if (hasBlocking || (requireFilledFields && hasEmptyRequired)) {
    return {
      csv: "",
      summary: {
        totalRaw: raw.length,
        totalClassification: classifications.length,
        skippedAnuladas: 0,
        exported: 0,
        reviewRequiredExported: 0,
      },
      issues,
    };
  }

  const rows: Array<Array<string | number | null>> = [];
  let skippedAnuladas = 0;
  let reviewRequiredExported = 0;

  const sortedRaw = [...raw].sort((a, b) => a.number - b.number);

  for (const q of sortedRaw) {
    if (q.status === "ANULADA") {
      skippedAnuladas++;
      continue;
    }

    const classification = classByNumber.get(q.number);
    if (!classification) continue;

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
      classification.position,
      classification.board,
      classification.contest,
      classification.subject,
      classification.topic,
      classification.year,
      classification.explanation,
      "", // organization
      "", // exam
      q.page ?? "",
      q.number,
      "", // references
      formatKeywords(classification, needsReview),
      needsReview ? "INACTIVE" : "ACTIVE",
      "", // package
      "", // package_version
    ]);
  }

  return {
    csv: buildCsv([...CSV_HEADER], rows),
    summary: {
      totalRaw: raw.length,
      totalClassification: classifications.length,
      skippedAnuladas,
      exported: rows.length,
      reviewRequiredExported,
    },
    issues,
  };
}
