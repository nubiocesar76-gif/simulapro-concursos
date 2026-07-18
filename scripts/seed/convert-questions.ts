/**
 * SimulaPro — Question Converter Runner
 *
 * Entrada:
 *   docs/imports/questions.xlsx  (prioridade)
 *   docs/imports/questions.csv
 *
 * Saída:
 *   docs/seeds/questions.json
 *
 * Fluxo oficial:
 *   CSV/XLSX → questions.json → npm run seed:questions
 */
import { runConvertQuestions } from "./questions/convert/convert.ts";

const inputArg = process.argv[2];
const outputArg = process.argv[3];

const exitCode = await runConvertQuestions(inputArg, outputArg);
process.exit(exitCode);
