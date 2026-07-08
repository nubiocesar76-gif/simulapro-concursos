import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";
import { projectRoot } from "../../core/env.ts";

export const PDF_IMPORTS_DIR = resolve(projectRoot(), "docs/imports/pdfs");
export const WORK_ROOT_DIR = resolve(projectRoot(), "docs/work");

export const WORK_FILES = {
  metadata: "metadata.json",
  questionsRaw: "questions.raw.json",
  review: "review.json",
  status: "status.json",
  sourcePdf: "source.pdf",
} as const;

export function slugFromPdfFilename(filename: string) {
  return basename(filename, ".pdf")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function resolveWorkDir(workId: string) {
  return resolve(WORK_ROOT_DIR, workId);
}

export function resolveWorkFile(workId: string, fileName: string) {
  return resolve(resolveWorkDir(workId), fileName);
}

export function workDirExists(workId: string) {
  return existsSync(resolveWorkDir(workId));
}

export function resolvePdfInput(inputPath: string) {
  const absolute = resolve(process.cwd(), inputPath);
  if (existsSync(absolute)) return absolute;

  const fromImports = resolve(PDF_IMPORTS_DIR, inputPath);
  if (existsSync(fromImports)) return fromImports;

  const withPdfExt = resolve(PDF_IMPORTS_DIR, `${inputPath}.pdf`);
  if (existsSync(withPdfExt)) return withPdfExt;

  return null;
}
