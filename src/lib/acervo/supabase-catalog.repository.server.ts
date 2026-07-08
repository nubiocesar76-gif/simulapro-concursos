import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";
import type { CatalogExam, CatalogExamStatus } from "./types";
import type { CatalogRepository } from "./repository";
import { computeAcervoStats } from "./catalog-csv";
import type { ExamFileType } from "./exam-file-types";

type ExamCatalogRow = Tables<"exam_catalog"> & {
  boards: Pick<Tables<"boards">, "id" | "acronym" | "name"> | null;
  positions: Pick<Tables<"positions">, "id" | "slug" | "name"> | null;
};

type ExamFileRow = Tables<"exam_files">;

const CATALOG_SELECT = `
  *,
  boards ( id, acronym, name ),
  positions ( id, slug, name )
`;

function boardDisplaySlug(board: ExamCatalogRow["boards"], fallback: string) {
  if (!board) return fallback;
  return (board.acronym ?? board.name ?? fallback).trim().toLowerCase();
}

function mapRowToExam(row: ExamCatalogRow, files: ExamFileRow[] = []): CatalogExam {
  const prova = files.find((file) => file.type === "PROVA");
  const gabarito = files.find((file) => file.type === "GABARITO");
  const notes = row.notes ?? "";

  return {
    catalogId: row.id,
    id: row.slug,
    status: row.status as CatalogExamStatus,
    organization: row.organization,
    contest: row.contest,
    year: row.year ?? 0,
    board: boardDisplaySlug(row.boards, ""),
    boardId: row.board_id,
    position: row.positions?.slug ?? row.positions?.name ?? "",
    positionId: row.position_id,
    questions: row.imported_questions,
    importedQuestions: row.imported_questions,
    approvedQuestions: row.approved_questions,
    publishedQuestions: row.published_questions,
    pdf: prova?.storage_path ?? "",
    answerKey: gabarito?.storage_path ?? "",
    storageFolder: row.storage_folder,
    notes,
    verified: row.verified,
    pdfAvailable: row.pdf_available,
    answerKeyAvailable: row.answer_key_available,
    imported: row.imported_questions > 0,
    reviewed: row.approved_questions > 0,
    approved: row.approved_questions > 0,
    package: "",
    observations: notes,
  };
}

async function fetchFilesByCatalogIds(catalogIds: string[]) {
  if (catalogIds.length === 0) return new Map<string, ExamFileRow[]>();

  const { data, error } = await supabaseAdmin
    .from("exam_files")
    .select("*")
    .in("exam_catalog_id", catalogIds);

  if (error) {
    throw new Error(`Falha ao carregar arquivos do catálogo: ${error.message}`);
  }

  const map = new Map<string, ExamFileRow[]>();
  for (const file of data ?? []) {
    const current = map.get(file.exam_catalog_id) ?? [];
    current.push(file);
    map.set(file.exam_catalog_id, current);
  }
  return map;
}

export class SupabaseCatalogRepository implements CatalogRepository {
  async list(): Promise<CatalogExam[]> {
    const { data, error } = await supabaseAdmin
      .from("exam_catalog")
      .select(CATALOG_SELECT)
      .order("organization", { ascending: true })
      .order("year", { ascending: false });

    if (error) {
      throw new Error(`Falha ao listar catálogo: ${error.message}`);
    }

    const rows = (data ?? []) as ExamCatalogRow[];
    const filesMap = await fetchFilesByCatalogIds(rows.map((row) => row.id));
    return rows.map((row) => mapRowToExam(row, filesMap.get(row.id) ?? []));
  }

  async getBySlug(slug: string): Promise<CatalogExam | null> {
    const { data, error } = await supabaseAdmin
      .from("exam_catalog")
      .select(CATALOG_SELECT)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Falha ao buscar prova: ${error.message}`);
    }
    if (!data) return null;

    const row = data as ExamCatalogRow;
    const filesMap = await fetchFilesByCatalogIds([row.id]);
    return mapRowToExam(row, filesMap.get(row.id) ?? []);
  }

  async stats(exams?: CatalogExam[]) {
    if (exams) return computeAcervoStats(exams);
    return computeAcervoStats(await this.list());
  }
}

export const supabaseCatalogRepository = new SupabaseCatalogRepository();

export async function updateExamCatalogBySlug(
  slug: string,
  patch: Partial<
    Pick<
      Tables<"exam_catalog">,
      | "status"
      | "verified"
      | "pdf_available"
      | "answer_key_available"
      | "imported_questions"
      | "approved_questions"
      | "published_questions"
      | "notes"
    >
  >,
): Promise<CatalogExam> {
  const { data, error } = await supabaseAdmin
    .from("exam_catalog")
    .update(patch)
    .eq("slug", slug)
    .select(CATALOG_SELECT)
    .single();

  if (error || !data) {
    throw new Error(`Falha ao atualizar catálogo: ${error?.message ?? "registro não encontrado"}`);
  }

  const row = data as ExamCatalogRow;
  const filesMap = await fetchFilesByCatalogIds([row.id]);
  return mapRowToExam(row, filesMap.get(row.id) ?? []);
}

export async function upsertExamFile(input: {
  examCatalogId: string;
  type: ExamFileType;
  filename: string;
  storagePath: string;
  mimeType?: string;
  size?: number;
}) {
  const { error } = await supabaseAdmin.from("exam_files").upsert(
    {
      exam_catalog_id: input.examCatalogId,
      type: input.type,
      filename: input.filename,
      storage_path: input.storagePath,
      mime_type: input.mimeType ?? null,
      size: input.size ?? null,
    },
    { onConflict: "exam_catalog_id,type" },
  );

  if (error) {
    throw new Error(`Falha ao registrar arquivo no catálogo: ${error.message}`);
  }
}

export async function listExamFilesBySlug(slug: string): Promise<ExamFileRow[]> {
  const exam = await supabaseCatalogRepository.getBySlug(slug);
  if (!exam) return [];

  const { data, error } = await supabaseAdmin
    .from("exam_files")
    .select("*")
    .eq("exam_catalog_id", exam.catalogId);

  if (error) {
    throw new Error(`Falha ao listar arquivos da prova: ${error.message}`);
  }

  return data ?? [];
}

export async function getExamCatalogIdBySlug(slug: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("exam_catalog")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao resolver prova: ${error.message}`);
  }

  return data?.id ?? null;
}
