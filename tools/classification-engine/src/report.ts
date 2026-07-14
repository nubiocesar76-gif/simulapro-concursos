import type { ClassificationIssue, ClassificationReport, LoadedClassificationInput } from "./types.ts";
import {
  countQuestionStatuses,
  questionHasError,
  questionHasWarning,
} from "./validator.ts";

export function buildReport(
  loaded: LoadedClassificationInput,
  issues: ClassificationIssue[],
  paths: {
    taxonomyIndexPath: string;
    editorialRulesPath: string;
    reportPath?: string;
  },
): ClassificationReport {
  const { anuladas } = countQuestionStatuses(loaded.raw);
  const questionNumbers = new Set(loaded.classifications.map((c) => c.question));

  let approved = 0;
  let warnings = 0;
  let errors = 0;

  for (const q of questionNumbers) {
    const raw = loaded.raw.find((r) => r.number === q);
    if (raw?.status === "ANULADA") continue;

    const hasError = questionHasError(issues, q);
    const hasWarning = questionHasWarning(issues, q);

    if (hasError) errors++;
    else if (hasWarning) warnings++;
    else approved++;
  }

  const globalErrors = issues.filter((i) => i.question === null && i.severity === "ERROR").length;
  errors += globalErrors;

  return {
    generatedAt: new Date().toISOString(),
    inputs: {
      rawPath: loaded.rawPath,
      classificationPath: loaded.classificationPath,
      taxonomyIndexPath: paths.taxonomyIndexPath,
      editorialRulesPath: paths.editorialRulesPath,
    },
    summary: {
      questions: loaded.raw.length,
      approved,
      warnings,
      errors,
      skippedAnuladas: anuladas,
    },
    issues,
  };
}

export function formatReportSummary(report: ClassificationReport): string {
  const s = report.summary;
  return [
    "=== CLASSIFICATION REPORT ===",
    `Questões: ${s.questions}`,
    `Aprovadas: ${s.approved}`,
    `Warnings: ${s.warnings}`,
    `Erros: ${s.errors}`,
    `Anuladas (ignoradas): ${s.skippedAnuladas}`,
    `Total de issues: ${report.issues.length}`,
  ].join("\n");
}
