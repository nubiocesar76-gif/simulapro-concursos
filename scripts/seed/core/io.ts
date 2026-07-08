import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { projectRoot } from "./env.ts";

export const TAXONOMY_SEED_PATH = resolve(projectRoot(), "docs/seeds/taxonomy.json");
export const QUESTIONS_SEED_PATH = resolve(projectRoot(), "docs/seeds/questions.json");
export const QUESTIONS_IMPORT_CSV_PATH = resolve(projectRoot(), "docs/imports/questions.csv");
export const QUESTIONS_IMPORT_XLSX_PATH = resolve(projectRoot(), "docs/imports/questions.xlsx");
export const PDF_IMPORTS_DIR = resolve(projectRoot(), "docs/imports/pdfs");
export const WORK_ROOT_DIR = resolve(projectRoot(), "docs/work");

export function readJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function writeJsonFile(path: string, data: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
