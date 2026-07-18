import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  QUESTIONS_IMPORT_CSV_PATH,
  QUESTIONS_IMPORT_XLSX_PATH,
  QUESTIONS_SEED_PATH,
  readJsonFile,
  TAXONOMY_SEED_PATH,
  writeJsonFile,
} from "../../core/io.ts";
import { loadEnv, projectRoot } from "../../core/env.ts";
import { createSeedClient } from "../../core/client.ts";
import { computeContentHash } from "../hash.ts";
import {
  CONVERTER_ENGINE_NAME,
  DEFAULT_QUESTIONS_DESCRIPTION,
  DEFAULT_QUESTIONS_VERSION,
} from "../metadata.ts";
import { questionsSeedSchema, type QuestionSeedItem, type QuestionsSeedFile } from "../schema.ts";
import { loadTaxonomyMaps } from "../entities.ts";
import { taxonomySeedSchema } from "../../taxonomy/schema.ts";
import { resolvePackageVersion } from "../../taxonomy/entities.ts";
import { detectMissingColumns, readSpreadsheet } from "./parse.ts";
import { loadTaxonomySets } from "./taxonomy.ts";
import { printConvertReport, validateRows, type ConvertIssue } from "./validate.ts";

export type ConvertQuestionsResult =
  | { ok: true; outputPath: string; count: number }
  | { ok: false; issues: Array<{ line: number; field: string; error: string }> };

function resolveInputPath(explicitPath?: string) {
  if (explicitPath) return resolve(process.cwd(), explicitPath);
  if (existsSync(QUESTIONS_IMPORT_XLSX_PATH)) return QUESTIONS_IMPORT_XLSX_PATH;
  if (existsSync(QUESTIONS_IMPORT_CSV_PATH)) return QUESTIONS_IMPORT_CSV_PATH;
  return null;
}

function readPreservedMetadata() {
  if (!existsSync(QUESTIONS_SEED_PATH)) {
    return { version: DEFAULT_QUESTIONS_VERSION, description: DEFAULT_QUESTIONS_DESCRIPTION };
  }
  const parsed = questionsSeedSchema.safeParse(readJsonFile<unknown>(QUESTIONS_SEED_PATH));
  if (!parsed.success) {
    return { version: DEFAULT_QUESTIONS_VERSION, description: DEFAULT_QUESTIONS_DESCRIPTION };
  }
  return {
    version: parsed.data.metadata.version,
    description: parsed.data.metadata.description,
  };
}

function toSeedItem(row: ReturnType<typeof validateRows>["converted"][number]): QuestionSeedItem & {
  contentHash: string;
} {
  const contentHash = computeContentHash(row.statement, row.alternatives, row.correctAnswer);
  return {
    statement: row.statement,
    alternatives: row.alternatives,
    correctAnswer: row.correctAnswer,
    position: row.position,
    board: row.board,
    contest: row.contest,
    subject: row.subject,
    topic: row.topic,
    year: row.year,
    explanation: row.explanation,
    references: row.references,
    status: row.status,
    keywords: row.keywords,
    ...(row.source ? { source: row.source } : {}),
    ...(row.package ? { package: row.package } : {}),
    ...(row.packageVersion ? { packageVersion: row.packageVersion } : {}),
    contentHash,
  };
}

export function convertQuestions(inputPath?: string, outputPath = QUESTIONS_SEED_PATH): ConvertQuestionsResult {
  const resolvedInput = resolveInputPath(inputPath);
  if (!resolvedInput) {
    return {
      ok: false,
      issues: [
        {
          line: 0,
          field: "arquivo",
          error: `Nenhum arquivo encontrado em docs/imports/questions.xlsx ou docs/imports/questions.csv`,
        },
      ],
    };
  }

  if (!existsSync(TAXONOMY_SEED_PATH)) {
    return {
      ok: false,
      issues: [{ line: 0, field: "taxonomy", error: `Taxonomia não encontrada: ${TAXONOMY_SEED_PATH}` }],
    };
  }

  const taxonomyParsed = taxonomySeedSchema.safeParse(readJsonFile<unknown>(TAXONOMY_SEED_PATH));
  if (!taxonomyParsed.success) {
    return {
      ok: false,
      issues: [{ line: 0, field: "taxonomy", error: "docs/seeds/taxonomy.json inválido." }],
    };
  }

  const rows = readSpreadsheet(resolvedInput);
  const missingColumns = detectMissingColumns(rows);
  if (missingColumns.length) {
    return {
      ok: false,
      issues: missingColumns.map((column) => ({
        line: 1,
        field: column,
        error: "Coluna obrigatória ausente no arquivo.",
      })),
    };
  }

  const sets = loadTaxonomySets(taxonomyParsed.data);
  const { issues, converted } = validateRows(rows, sets);
  if (issues.length) return { ok: false, issues };

  const preserved = readPreservedMetadata();
  const questions = converted
    .map(toSeedItem)
    .sort((a, b) => a.contentHash.localeCompare(b.contentHash));

  const output: QuestionsSeedFile = {
    metadata: {
      version: preserved.version,
      generatedAt: "",
      generatedBy: CONVERTER_ENGINE_NAME,
      description: preserved.description,
      environment: "production",
    },
    questions,
  };

  const schemaCheck = questionsSeedSchema.safeParse(output);
  if (!schemaCheck.success) {
    return {
      ok: false,
      issues: [{ line: 0, field: "schema", error: "Falha ao validar questions.json gerado." }],
    };
  }

  writeJsonFile(outputPath, output);
  return { ok: true, outputPath, count: questions.length };
}

/**
 * Sprint G7.5A — Melhoria 3. Lacuna identificada na análise: `package`/`package_version`
 * não tinham validação antecipada de existência (só formato/regex, em validateRows) —
 * a existência real só era descoberta tarde, dentro de seed:questions.
 *
 * A fonte oficial de package/package_version é o banco (não há espelho em
 * taxonomy.json), então esta checagem precisa ser assíncrona — por isso fica isolada
 * aqui, fora de `convertQuestions()` (síncrona, usada também por
 * tools/question-pipeline/src/merge.ts e export.ts, que não devem mudar).
 *
 * Relê o mesmo arquivo já convertido com sucesso (mesma função `readSpreadsheet` usada
 * dentro de `convertQuestions`) só para recuperar position/package/package_version com
 * o número de linha original — nenhuma consulta nova é escrita: `loadTaxonomyMaps`
 * (position → course_id) e `resolvePackageVersion` são os mesmos resolvers que
 * seed:questions já usa.
 */
async function validatePackageReferences(
  inputPath: string,
  headerLine = 1,
): Promise<ConvertIssue[]> {
  const rows = readSpreadsheet(inputPath);
  const rowsWithPackage = rows
    .map((row, index) => ({ row, line: headerLine + 1 + index }))
    .filter(({ row }) => (row.package ?? "").trim());

  if (!rowsWithPackage.length) return [];

  loadEnv(projectRoot());
  const db = createSeedClient();
  const maps = await loadTaxonomyMaps(db);

  const issues: ConvertIssue[] = [];
  const packageVersionCache = new Map<string, boolean>();

  for (const { row, line } of rowsWithPackage) {
    const position = row.position ?? "";
    const packageSlug = row.package ?? "";
    const packageVersion = row.package_version
      ? /^\d+$/.test(row.package_version)
        ? `${row.package_version}.0`
        : row.package_version
      : "";

    const courseId = maps.positionSlugToCourseId.get(position);
    if (!courseId) {
      issues.push({
        line,
        field: "package",
        error: `Curso não resolvido para o cargo "${position}" (necessário para validar o package).`,
      });
      continue;
    }

    const cacheKey = `${courseId}/${packageSlug}/${packageVersion}`;
    let exists = packageVersionCache.get(cacheKey);
    if (exists === undefined) {
      const resolved = await resolvePackageVersion(db, courseId, packageSlug, packageVersion);
      exists = !!resolved;
      packageVersionCache.set(cacheKey, exists);
    }
    if (!exists) {
      issues.push({
        line,
        field: "package_version",
        error: `Pacote "${packageSlug}" versão "${packageVersion}" não encontrado no banco para o curso do cargo "${position}".`,
      });
    }
  }

  return issues;
}

export async function runConvertQuestions(
  inputPath?: string,
  outputPath?: string,
): Promise<number> {
  const result = convertQuestions(inputPath, outputPath);
  if (!result.ok) {
    printConvertReport(result.issues);
    return 1;
  }

  const resolvedInput = resolveInputPath(inputPath);
  const packageIssues = resolvedInput ? await validatePackageReferences(resolvedInput) : [];
  if (packageIssues.length) {
    printConvertReport(packageIssues);
    console.error(
      `\n${result.outputPath} foi escrito, mas contém referência de package/package_version inexistente no banco — não use este arquivo em "npm run seed:questions" antes de corrigir.`,
    );
    return 1;
  }

  console.log(`Conversão concluída: ${result.outputPath}`);
  console.log(`Questões convertidas: ${result.count}`);
  return 0;
}
