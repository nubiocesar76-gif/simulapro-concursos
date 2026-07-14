import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ClassificationEntry,
  EditorialRulesConfig,
  LoadedClassificationInput,
  RawQuestionRef,
} from "./types.ts";
import type { IssueCode } from "./types.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
export const ENGINE_ROOT = resolve(HERE, "..");
export const DEFAULT_RAW_PATH = resolve(ENGINE_ROOT, "../question-pipeline/output/questions.raw.json");
export const DEFAULT_CLASSIFICATION_PATH = resolve(ENGINE_ROOT, "../question-pipeline/output/classification.json");
export const DEFAULT_TAXONOMY_INDEX_PATH = resolve(ENGINE_ROOT, "../taxonomy-engine/taxonomy.index.json");
export const DEFAULT_EDITORIAL_DIR = resolve(ENGINE_ROOT, "../../docs/editorial/classification");
export const DEFAULT_REPORT_PATH = resolve(ENGINE_ROOT, "output/classification.report.json");

export function parseJsonFile<T>(content: string, label: string): { data?: T; error?: IssueCode; message?: string } {
  try {
    return { data: JSON.parse(content) as T };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: "JSON_INVÁLIDO", message: `${label}: JSON inválido — ${message}.` };
  }
}

function assertClassificationArray(value: unknown): { entries?: ClassificationEntry[]; message?: string } {
  if (!Array.isArray(value)) {
    return { message: "classification.json: esperado um array JSON." };
  }

  const entries: ClassificationEntry[] = [];
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    if (typeof item !== "object" || item === null) {
      return { message: `classification.json: entrada ${i} não é um objeto.` };
    }
    const record = item as Record<string, unknown>;
    if (typeof record.question !== "number" || !Number.isFinite(record.question)) {
      return { message: `classification.json: entrada ${i} sem campo "question" numérico.` };
    }
    entries.push({
      question: record.question,
      board: typeof record.board === "string" ? record.board : "",
      contest: typeof record.contest === "string" ? record.contest : "",
      position: typeof record.position === "string" ? record.position : "",
      subject: typeof record.subject === "string" ? record.subject : "",
      topic: typeof record.topic === "string" ? record.topic : "",
      year: typeof record.year === "string" ? record.year : String(record.year ?? ""),
      difficulty: typeof record.difficulty === "string" ? record.difficulty : "",
      keywords: Array.isArray(record.keywords)
        ? record.keywords.filter((k): k is string => typeof k === "string")
        : [],
      explanation: typeof record.explanation === "string" ? record.explanation : "",
    });
  }
  return { entries };
}

function assertRawArray(value: unknown): { entries?: RawQuestionRef[]; message?: string } {
  if (!Array.isArray(value)) {
    return { message: "questions.raw.json: esperado um array JSON." };
  }
  const entries: RawQuestionRef[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) continue;
    const record = item as Record<string, unknown>;
    if (typeof record.number !== "number") continue;
    const status = record.status;
    entries.push({
      number: record.number,
      status: status === "ANULADA" || status === "REVIEW_REQUIRED" ? status : "VALID",
    });
  }
  return { entries };
}

export async function loadEditorialRulesConfig(
  editorialDir: string = DEFAULT_EDITORIAL_DIR,
): Promise<EditorialRulesConfig> {
  return {
    editorialDir,
    loaded: existsSync(editorialDir),
    difficultyValues: ["Muito Fácil", "Fácil", "Média", "Difícil", "Muito Difícil"],
    yearMin: 1900,
    yearMax: 2100,
    keywordsMin: 3,
    keywordsMax: 8,
    keywordMaxLength: 80,
    legacySubjectSlugs: [
      "controle-de-infeccao-hospitalar",
      "imunizacao",
      "politicas-publicas-de-saude",
      "saude-do-adulto",
      "anatomia-fisiologia",
    ],
    allowedKeywordPrefixes: ["difficulty:", "pipeline:", "secundaria:", "board:", "classificacao:", "norma:"],
  };
}

export async function loadClassificationInput(
  rawPath: string = DEFAULT_RAW_PATH,
  classificationPath: string = DEFAULT_CLASSIFICATION_PATH,
): Promise<{ input?: LoadedClassificationInput; error?: IssueCode; message?: string }> {
  let rawContent: string;
  let classContent: string;
  try {
    rawContent = await readFile(rawPath, "utf-8");
    classContent = await readFile(classificationPath, "utf-8");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: "JSON_INVÁLIDO", message: `Falha ao ler arquivos de entrada: ${message}` };
  }

  const rawParsed = parseJsonFile<unknown>(rawContent, "questions.raw.json");
  if (rawParsed.error) return { error: rawParsed.error, message: rawParsed.message };

  const classParsed = parseJsonFile<unknown>(classContent, "classification.json");
  if (classParsed.error) return { error: classParsed.error, message: classParsed.message };

  const rawAssert = assertRawArray(rawParsed.data);
  if (!rawAssert.entries) return { error: "JSON_INVÁLIDO", message: rawAssert.message };

  const classAssert = assertClassificationArray(classParsed.data);
  if (!classAssert.entries) return { error: "JSON_INVÁLIDO", message: classAssert.message };

  return {
    input: {
      raw: rawAssert.entries,
      classifications: classAssert.entries,
      rawPath,
      classificationPath,
    },
  };
}
