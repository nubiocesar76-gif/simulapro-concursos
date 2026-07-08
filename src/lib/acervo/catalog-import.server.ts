import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { parseCatalogCsv } from "./catalog-csv";
import type { CatalogExam, CatalogExamStatus } from "./types";
import type { ExamFileType } from "./exam-file-types";
import { EXAM_FILE_TYPE_MIME } from "./exam-file-types";

const DEFAULT_COURSE_SLUG = "enfermagem";

function projectRoot() {
  return resolve(import.meta.dirname, "../../..");
}

function catalogCsvPath() {
  return resolve(projectRoot(), "docs/catalog/enfermagem.csv");
}

function filenameFromPath(path: string) {
  const normalized = path.replace(/\\/g, "/");
  const parts = normalized.split("/");
  return parts[parts.length - 1] || path;
}

function inferStoragePath(csvPath: string, slug: string) {
  const trimmed = csvPath.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("acervo/")) return trimmed;
  const fileName = filenameFromPath(trimmed);
  return `acervo/${slug}/${fileName}`;
}

async function resolveBoardId(boardSlug: string): Promise<string | null> {
  const slug = boardSlug.trim().toLowerCase();
  const { data, error } = await supabaseAdmin
    .from("boards")
    .select("id, acronym, name")
    .limit(200);

  if (error) {
    throw new Error(`Falha ao resolver banca: ${error.message}`);
  }

  const match = (data ?? []).find((board) => {
    const acronym = (board.acronym ?? "").trim().toLowerCase();
    const name = (board.name ?? "").trim().toLowerCase();
    return acronym === slug || name === slug;
  });

  return match?.id ?? null;
}

async function resolvePositionId(positionSlug: string): Promise<string | null> {
  const slug = positionSlug.trim().toLowerCase();

  const { data: course, error: courseError } = await supabaseAdmin
    .from("courses")
    .select("id")
    .eq("slug", DEFAULT_COURSE_SLUG)
    .maybeSingle();

  if (courseError) {
    throw new Error(`Falha ao resolver curso: ${courseError.message}`);
  }
  if (!course) return null;

  const { data, error } = await supabaseAdmin
    .from("positions")
    .select("id, slug")
    .eq("course_id", course.id)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao resolver cargo: ${error.message}`);
  }

  return data?.id ?? null;
}

async function upsertExamFileRecord(
  examCatalogId: string,
  type: ExamFileType,
  storagePath: string,
) {
  if (!storagePath) return;

  const { error } = await supabaseAdmin.from("exam_files").upsert(
    {
      exam_catalog_id: examCatalogId,
      type,
      filename: filenameFromPath(storagePath),
      storage_path: storagePath,
      mime_type: EXAM_FILE_TYPE_MIME[type] ?? null,
      size: null,
    },
    { onConflict: "exam_catalog_id,type" },
  );

  if (error) {
    throw new Error(`Falha ao registrar arquivo ${type}: ${error.message}`);
  }
}

export type ImportCatalogResult = {
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
};

export async function importCatalogFromCsv(): Promise<ImportCatalogResult> {
  const content = readFileSync(catalogCsvPath(), "utf8");
  const exams = parseCatalogCsv(content);

  const result: ImportCatalogResult = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  for (const exam of exams) {
    try {
      const outcome = await importSingleExam(exam);
      if (outcome === "inserted") result.inserted += 1;
      else result.updated += 1;
    } catch (error) {
      result.skipped += 1;
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      result.errors.push(`${exam.id}: ${message}`);
    }
  }

  return result;
}

async function importSingleExam(exam: CatalogExam): Promise<"inserted" | "updated"> {
  const boardId = await resolveBoardId(exam.board);
  if (!boardId) {
    throw new Error(`Banca não encontrada: ${exam.board}`);
  }

  const positionId = await resolvePositionId(exam.position);
  if (!positionId) {
    throw new Error(`Cargo não encontrado: ${exam.position}`);
  }

  const payload = {
    slug: exam.id,
    organization: exam.organization,
    contest: exam.contest,
    year: exam.year || null,
    board_id: boardId,
    position_id: positionId,
    status: exam.status as CatalogExamStatus,
    verified: exam.verified,
    pdf_available: exam.pdfAvailable,
    answer_key_available: exam.answerKeyAvailable,
    imported_questions: exam.importedQuestions,
    approved_questions: exam.approvedQuestions,
    published_questions: exam.publishedQuestions,
    storage_folder: exam.storageFolder,
    notes: exam.notes || null,
  };

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("exam_catalog")
    .select("id")
    .eq("slug", exam.id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  let catalogId = existing?.id;
  let action: "inserted" | "updated" = existing ? "updated" : "inserted";

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("exam_catalog")
      .update(payload)
      .eq("id", existing.id)
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Falha ao atualizar registro");
    }
    catalogId = data.id;
  } else {
    const { data, error } = await supabaseAdmin
      .from("exam_catalog")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Falha ao inserir registro");
    }
    catalogId = data.id;
  }

  if (!catalogId) {
    throw new Error("ID do catálogo não retornado");
  }

  const provaPath = inferStoragePath(exam.pdf, exam.id);
  const gabaritoPath = inferStoragePath(exam.answerKey, exam.id);

  if (provaPath) {
    await upsertExamFileRecord(catalogId, "PROVA", provaPath);
  }
  if (gabaritoPath) {
    await upsertExamFileRecord(catalogId, "GABARITO", gabaritoPath);
  }

  return action;
}
