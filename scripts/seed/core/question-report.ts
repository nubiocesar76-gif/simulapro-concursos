export type QuestionSeedReport = {
  questionsCreated: number;
  ignored: number;
  errors: string[];
};

export function createQuestionReport(): QuestionSeedReport {
  return { questionsCreated: 0, ignored: 0, errors: [] };
}

export function printQuestionReport(report: QuestionSeedReport) {
  console.log(`Questões criadas: ${report.questionsCreated}`);
  console.log(`Ignoradas: ${report.ignored}`);
  console.log(`Erros: ${report.errors.length}`);
  if (report.errors.length > 0) {
    for (const err of report.errors) console.error(`  - ${err}`);
  }
}

function ignore(report: QuestionSeedReport, label: string) {
  report.ignored += 1;
  if (process.env.SEED_VERBOSE === "1") console.log(`Ignorada: ${label}`);
}

export { ignore as ignoreQuestion };
