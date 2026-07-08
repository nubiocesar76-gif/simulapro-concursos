export type SeedReport = {
  coursesCreated: number;
  positionsCreated: number;
  boardsCreated: number;
  subjectsCreated: number;
  topicsCreated: number;
  contestsCreated: number;
  ignored: number;
  errors: string[];
};

export function createReport(): SeedReport {
  return {
    coursesCreated: 0,
    positionsCreated: 0,
    boardsCreated: 0,
    subjectsCreated: 0,
    topicsCreated: 0,
    contestsCreated: 0,
    ignored: 0,
    errors: [],
  };
}

export function printReport(report: SeedReport) {
  console.log(`Cursos criados: ${report.coursesCreated}`);
  console.log(`Cargos criados: ${report.positionsCreated}`);
  console.log(`Bancas criadas: ${report.boardsCreated}`);
  console.log(`Disciplinas criadas: ${report.subjectsCreated}`);
  console.log(`Assuntos criados: ${report.topicsCreated}`);
  console.log(`Concursos criados: ${report.contestsCreated}`);
  console.log(`Ignorados: ${report.ignored}`);
  console.log(`Erros: ${report.errors.length}`);
  if (report.errors.length > 0) {
    for (const err of report.errors) console.error(`  - ${err}`);
  }
}
