import type { AcervoPipelineStage, CatalogExam } from "./types";

export function catalogStatusToPipelineStage(
  exam: CatalogExam,
  workStage?: AcervoPipelineStage,
): AcervoPipelineStage {
  if (workStage) return workStage;
  if (exam.status === "PUBLISHED") return "PUBLISHED";
  if (exam.status === "IMPORTED") return "IMPORTED";
  if (exam.status === "APPROVED") return "APPROVED";
  if (exam.status === "REVIEW") return "REVIEW";
  if (exam.status === "PROCESSING") return "QUESTIONS_GENERATED";
  if (exam.status === "DOWNLOADED") {
    return exam.verified ? "VERIFIED" : "DOWNLOADED";
  }
  return "PLANNED";
}
