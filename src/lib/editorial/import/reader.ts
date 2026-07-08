import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type {
  EditorialPackage,
  EditorialPackageManifest,
  EditorialPackageSummary,
  SourceDiscipline,
  SourceKeyword,
  SourceRule,
  SourceSubtopic,
  SourceTopic,
} from "./types";

const EDITORIAL_ROOT = "docs/editorial";

function projectRoot() {
  return resolve(import.meta.dirname, "../../../..");
}

function editorialRootPath() {
  return resolve(projectRoot(), EDITORIAL_ROOT);
}

function readJsonFile<T>(filePath: string): T {
  const raw = readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
}

function readArrayFile<T>(dir: string, filename: string): T[] {
  const filePath = join(dir, filename);
  if (!existsSync(filePath)) return [];
  const data = readJsonFile<unknown>(filePath);
  if (!Array.isArray(data)) {
    throw new Error(`Arquivo inválido (esperado array): ${filename}`);
  }
  return data as T[];
}

export function listEditorialPackages(): EditorialPackageSummary[] {
  const root = editorialRootPath();
  if (!existsSync(root)) return [];

  const packages: EditorialPackageSummary[] = [];

  const scanDir = (relativePath: string) => {
    const abs = join(root, relativePath);
    const manifestPath = join(abs, "manifest.json");
    if (!existsSync(manifestPath)) return;

    const manifest = readJsonFile<EditorialPackageManifest>(manifestPath);
    packages.push({
      path: relativePath.replace(/\\/g, "/"),
      label: manifest.architecture_name || relativePath,
      manifest,
    });
  };

  scanDir("normalized");

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "normalized" || entry.name === "engine-v2") {
      continue;
    }
    scanDir(entry.name);
  }

  return packages.sort((a, b) => a.path.localeCompare(b.path));
}

export function readEditorialPackage(packagePath: string): EditorialPackage {
  const normalizedPath = packagePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const absDir = resolve(editorialRootPath(), normalizedPath);

  if (!absDir.startsWith(editorialRootPath())) {
    throw new Error("Caminho de pacote inválido.");
  }
  if (!existsSync(absDir)) {
    throw new Error(`Pacote não encontrado: ${normalizedPath}`);
  }

  const manifestPath = join(absDir, "manifest.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`manifest.json ausente em ${normalizedPath}`);
  }

  const manifest = readJsonFile<EditorialPackageManifest>(manifestPath);
  const filesRead: string[] = ["manifest.json"];

  for (const file of manifest.required_files ?? []) {
    const filePath = join(absDir, file);
    if (!existsSync(filePath)) {
      throw new Error(`Arquivo obrigatório ausente: ${file}`);
    }
    filesRead.push(file);
  }

  for (const file of manifest.optional_files ?? []) {
    if (existsSync(join(absDir, file))) {
      filesRead.push(file);
    }
  }

  return {
    path: normalizedPath,
    manifest,
    filesRead,
    disciplines: readArrayFile<SourceDiscipline>(absDir, "01-disciplinas.json"),
    topics: readArrayFile<SourceTopic>(absDir, "02-assuntos.json"),
    subtopics: readArrayFile<SourceSubtopic>(absDir, "03-subassuntos.json"),
    keywords: readArrayFile<SourceKeyword>(absDir, "04-palavras-chave.json"),
    rules: readArrayFile<SourceRule>(absDir, "11-regras-classificacao.json"),
  };
}
