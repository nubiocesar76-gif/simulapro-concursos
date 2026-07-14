import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { loadTaxonomyIndexFromExport } from "../../taxonomy-engine/src/export.ts";
import {
  DEFAULT_CLASSIFICATION_PATH,
  DEFAULT_EDITORIAL_DIR,
  DEFAULT_RAW_PATH,
  DEFAULT_REPORT_PATH,
  DEFAULT_TAXONOMY_INDEX_PATH,
  loadClassificationInput,
  loadEditorialRulesConfig,
} from "./loader.ts";
import { buildReport, formatReportSummary } from "./report.ts";
import type { ClassificationIssue, ClassificationReport } from "./types.ts";
import { validateClassification } from "./validator.ts";

export interface RunOptions {
  rawPath?: string;
  classificationPath?: string;
  taxonomyIndexPath?: string;
  editorialDir?: string;
  reportPath?: string;
}

export async function runClassificationEngine(options: RunOptions = {}): Promise<ClassificationReport> {
  const rawPath = options.rawPath ?? DEFAULT_RAW_PATH;
  const classificationPath = options.classificationPath ?? DEFAULT_CLASSIFICATION_PATH;
  const taxonomyIndexPath = options.taxonomyIndexPath ?? DEFAULT_TAXONOMY_INDEX_PATH;
  const editorialDir = options.editorialDir ?? DEFAULT_EDITORIAL_DIR;
  const reportPath = options.reportPath ?? DEFAULT_REPORT_PATH;

  const editorial = await loadEditorialRulesConfig(editorialDir);
  const issues: ClassificationIssue[] = [];

  const loaded = await loadClassificationInput(rawPath, classificationPath);
  if (loaded.error) {
    issues.push({
      question: null,
      severity: "ERROR",
      code: loaded.error,
      message: loaded.message ?? "Erro ao carregar entrada.",
      suggestion: "Corrija os arquivos JSON de entrada.",
    });
    const emptyReport = buildReport(
      {
        raw: [],
        classifications: [],
        rawPath,
        classificationPath,
      },
      issues,
      { taxonomyIndexPath, editorialRulesPath: editorialDir },
    );
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(reportPath, JSON.stringify(emptyReport, null, 2) + "\n", "utf-8");
    return emptyReport;
  }

  let index;
  try {
    index = await loadTaxonomyIndexFromExport(taxonomyIndexPath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    issues.push({
      question: null,
      severity: "ERROR",
      code: "JSON_INVÁLIDO",
      message: `Falha ao carregar taxonomy.index.json: ${message}`,
      suggestion: "Execute npx tsx tools/taxonomy-engine/src/export.ts para regenerar o índice.",
    });
    const failReport = buildReport(loaded.input!, issues, {
      taxonomyIndexPath,
      editorialRulesPath: editorialDir,
    });
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(reportPath, JSON.stringify(failReport, null, 2) + "\n", "utf-8");
    return failReport;
  }

  issues.push(...validateClassification(loaded.input!, index, editorial));

  const report = buildReport(loaded.input!, issues, {
    taxonomyIndexPath,
    editorialRulesPath: editorialDir,
  });

  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf-8");

  return report;
}

async function main() {
  const report = await runClassificationEngine();
  console.log(formatReportSummary(report));
  console.log(`\nRelatório: ${DEFAULT_REPORT_PATH}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
