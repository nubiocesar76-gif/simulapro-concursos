import {
  ACERVO_PIPELINE_STAGES,
  type AcervoPipelineStage,
  type CatalogExam,
  type WorkFileKey,
  type WorkManifest,
} from "./types";
import {
  acervoObjectPath,
  assertValidExamId,
  ensureAcervoBucket,
  formatAcervoStoragePath,
  readStorageJson,
  storageFileExists,
  uploadStorageBuffer,
  uploadStorageText,
  ACERVO_BUCKET,
} from "./acervo-storage.server";
import { WORK_FILE_PATHS } from "./work-manifest";
import {
  listExamFilesBySlug,
  supabaseCatalogRepository,
  updateExamCatalogBySlug,
  upsertExamFile,
} from "./supabase-catalog.repository.server";
import { EXAM_FILE_TYPE_MIME, WORK_KEY_TO_EXAM_FILE_TYPE } from "./exam-file-types";
import { listExamFileNames } from "./acervo-storage.server";

const ACERVO_ENGINE_NAME = "SimulaPro Acervo";
const PIPELINE_VERSION = "1.0.0";
const MAX_PDF_BYTES = 80 * 1024 * 1024;

const STORAGE_FILES = {
  metadata: "metadata.json",
  questionsRaw: "questions.raw.json",
  review: "review.json",
  status: "status.json",
  prova: "prova.pdf",
  gabarito: "gabarito.pdf",
  edital: "edital.pdf",
} as const;

function decodeBase64Pdf(data: string, label: string): Buffer {
  const base64 = data.includes(",") ? data.split(",")[1]! : data;
  const buffer = Buffer.from(base64, "base64");
  if (buffer.length === 0) {
    throw new Error(`${label}: arquivo vazio.`);
  }
  if (buffer.length > MAX_PDF_BYTES) {
    throw new Error(`${label}: arquivo excede o limite de 80 MB.`);
  }
  if (buffer.subarray(0, 4).toString() !== "%PDF") {
    throw new Error(`${label}: o arquivo não é um PDF válido.`);
  }
  return buffer;
}

export async function getAcervoCatalogSnapshot() {
  const exams = await supabaseCatalogRepository.list();
  const stats = await supabaseCatalogRepository.stats(exams);
  return { exams, stats };
}

async function resolvePipelineStage(
  storageFolder: string,
  catalogStatus: CatalogExam["status"],
): Promise<AcervoPipelineStage> {
  const status = await readStorageJson<{ stage?: string }>(storageFolder, STORAGE_FILES.status);
  const stage = status?.stage;
  if (stage && (ACERVO_PIPELINE_STAGES as readonly string[]).includes(stage)) {
    return stage as AcervoPipelineStage;
  }
  if (stage === "REGISTERED") return "DOWNLOADED";
  if (await storageFileExists(storageFolder, STORAGE_FILES.prova)) return "DOWNLOADED";
  if (catalogStatus === "PUBLISHED") return "PUBLISHED";
  if (catalogStatus === "IMPORTED") return "IMPORTED";
  if (catalogStatus === "APPROVED") return "APPROVED";
  if (catalogStatus === "REVIEW") return "REVIEW";
  if (catalogStatus === "PROCESSING") return "QUESTIONS_GENERATED";
  if (catalogStatus === "DOWNLOADED") return "DOWNLOADED";
  return "PLANNED";
}

export async function getWorkManifestForExam(exam: CatalogExam): Promise<WorkManifest | null> {
  assertValidExamId(exam.storageFolder);
  await ensureAcervoBucket();

  const dbFiles = await listExamFilesBySlug(exam.id);
  const files = {} as Record<WorkFileKey, boolean>;

  for (const key of Object.keys(WORK_FILE_PATHS) as WorkFileKey[]) {
    const fileType = WORK_KEY_TO_EXAM_FILE_TYPE[key];
    files[key] = dbFiles.some((file) => file.type === fileType);
  }

  if (dbFiles.length === 0) {
    const storageNames = await listExamFileNames(exam.storageFolder);
    if (storageNames.length === 0) return null;
    for (const [key, fileName] of Object.entries(WORK_FILE_PATHS)) {
      files[key as WorkFileKey] = storageNames.includes(fileName);
    }
  }

  return {
    pipelineStage: await resolvePipelineStage(exam.storageFolder, exam.status),
    files,
  };
}

export type UploadedPdf = {
  name: string;
  data: string;
};

export type RegisterAcervoFilesInput = {
  examId: string;
  prova: UploadedPdf;
  gabarito?: UploadedPdf;
  edital?: UploadedPdf;
};

export type RegisterAcervoFilesResult = {
  exam: CatalogExam;
  manifest: WorkManifest;
  storagePrefix: string;
};

async function ensureWorkScaffold(exam: CatalogExam, now: string) {
  const folder = exam.storageFolder;
  const existingMetadata = await readStorageJson<Record<string, unknown>>(
    folder,
    STORAGE_FILES.metadata,
  );
  if (!existingMetadata) {
    await uploadStorageText(
      folder,
      STORAGE_FILES.metadata,
      `${JSON.stringify(
        {
          version: PIPELINE_VERSION,
          workId: exam.id,
          createdAt: now,
          createdBy: ACERVO_ENGINE_NAME,
          sourcePdf: STORAGE_FILES.prova,
          storageBucket: ACERVO_BUCKET,
          storagePrefix: acervoObjectPath(folder, ""),
          organization: exam.organization,
          contest: exam.contest,
          board: exam.board,
          position: exam.position,
          year: exam.year || undefined,
          description: `${exam.organization} ${exam.year} — ${exam.position}`,
        },
        null,
        2,
      )}\n`,
      "application/json",
    );
    await upsertExamFile({
      examCatalogId: exam.catalogId,
      type: "METADATA",
      filename: STORAGE_FILES.metadata,
      storagePath: formatAcervoStoragePath(folder, STORAGE_FILES.metadata),
      mimeType: EXAM_FILE_TYPE_MIME.METADATA,
    });
  }

  if (!(await storageFileExists(folder, STORAGE_FILES.questionsRaw))) {
    await uploadStorageText(
      folder,
      STORAGE_FILES.questionsRaw,
      `${JSON.stringify(
        {
          version: PIPELINE_VERSION,
          generatedAt: "",
          generatedBy: "",
          questions: [],
        },
        null,
        2,
      )}\n`,
      "application/json",
    );
    await upsertExamFile({
      examCatalogId: exam.catalogId,
      type: "QUESTIONS_RAW",
      filename: STORAGE_FILES.questionsRaw,
      storagePath: formatAcervoStoragePath(folder, STORAGE_FILES.questionsRaw),
      mimeType: EXAM_FILE_TYPE_MIME.QUESTIONS_RAW,
    });
  }

  if (!(await storageFileExists(folder, STORAGE_FILES.review))) {
    await uploadStorageText(
      folder,
      STORAGE_FILES.review,
      `${JSON.stringify(
        {
          version: PIPELINE_VERSION,
          updatedAt: now,
          items: [],
        },
        null,
        2,
      )}\n`,
      "application/json",
    );
    await upsertExamFile({
      examCatalogId: exam.catalogId,
      type: "REVIEW",
      filename: STORAGE_FILES.review,
      storagePath: formatAcervoStoragePath(folder, STORAGE_FILES.review),
      mimeType: EXAM_FILE_TYPE_MIME.REVIEW,
    });
  }
}

async function updateWorkStatus(exam: CatalogExam, now: string) {
  const folder = exam.storageFolder;
  const existing = await readStorageJson<{
    version?: string;
    workId?: string;
    history?: Array<{ stage: string; at: string; by: string; note: string }>;
  }>(folder, STORAGE_FILES.status);

  const history = existing?.history ?? [];
  history.push({
    stage: "DOWNLOADED",
    at: now,
    by: ACERVO_ENGINE_NAME,
    note: "Arquivos registrados via Acervo (prova, gabarito e/ou edital).",
  });

  await uploadStorageText(
    folder,
    STORAGE_FILES.status,
    `${JSON.stringify(
      {
        version: existing?.version ?? PIPELINE_VERSION,
        workId: exam.id,
        stage: "DOWNLOADED",
        history,
        sourcePdf: STORAGE_FILES.prova,
        storageBucket: ACERVO_BUCKET,
        workDir: `${ACERVO_BUCKET}/${folder}`,
      },
      null,
      2,
    )}\n`,
    "application/json",
  );

  await upsertExamFile({
    examCatalogId: exam.catalogId,
    type: "STATUS",
    filename: STORAGE_FILES.status,
    storagePath: formatAcervoStoragePath(folder, STORAGE_FILES.status),
    mimeType: EXAM_FILE_TYPE_MIME.STATUS,
  });
}

async function updateWorkMetadata(exam: CatalogExam, now: string) {
  const folder = exam.storageFolder;
  const existing =
    (await readStorageJson<Record<string, unknown>>(folder, STORAGE_FILES.metadata)) ?? {};

  await uploadStorageText(
    folder,
    STORAGE_FILES.metadata,
    `${JSON.stringify(
      {
        ...existing,
        version: existing.version ?? PIPELINE_VERSION,
        workId: exam.id,
        createdAt: existing.createdAt ?? now,
        createdBy: existing.createdBy ?? ACERVO_ENGINE_NAME,
        sourcePdf: STORAGE_FILES.prova,
        storageBucket: ACERVO_BUCKET,
        storagePrefix: `${folder}/`,
        organization: exam.organization,
        contest: exam.contest,
        board: exam.board,
        position: exam.position,
        year: exam.year || undefined,
        updatedAt: now,
        updatedBy: ACERVO_ENGINE_NAME,
      },
      null,
      2,
    )}\n`,
    "application/json",
  );

  await upsertExamFile({
    examCatalogId: exam.catalogId,
    type: "METADATA",
    filename: STORAGE_FILES.metadata,
    storagePath: formatAcervoStoragePath(folder, STORAGE_FILES.metadata),
    mimeType: EXAM_FILE_TYPE_MIME.METADATA,
  });
}

export async function registerAcervoFiles(
  input: RegisterAcervoFilesInput,
): Promise<RegisterAcervoFilesResult> {
  const { examId } = input;
  assertValidExamId(examId);
  await ensureAcervoBucket();

  const exam = await supabaseCatalogRepository.getBySlug(examId);
  if (!exam) {
    throw new Error("Prova não encontrada no catálogo.");
  }

  const folder = exam.storageFolder;
  const provaBuffer = decodeBase64Pdf(input.prova.data, "Prova");
  const gabaritoBuffer = input.gabarito
    ? decodeBase64Pdf(input.gabarito.data, "Gabarito")
    : null;
  const editalBuffer = input.edital ? decodeBase64Pdf(input.edital.data, "Edital") : null;

  await uploadStorageBuffer(folder, STORAGE_FILES.prova, provaBuffer, "application/pdf");
  await upsertExamFile({
    examCatalogId: exam.catalogId,
    type: "PROVA",
    filename: STORAGE_FILES.prova,
    storagePath: formatAcervoStoragePath(folder, STORAGE_FILES.prova),
    mimeType: EXAM_FILE_TYPE_MIME.PROVA,
    size: provaBuffer.length,
  });

  if (gabaritoBuffer) {
    await uploadStorageBuffer(folder, STORAGE_FILES.gabarito, gabaritoBuffer, "application/pdf");
    await upsertExamFile({
      examCatalogId: exam.catalogId,
      type: "GABARITO",
      filename: STORAGE_FILES.gabarito,
      storagePath: formatAcervoStoragePath(folder, STORAGE_FILES.gabarito),
      mimeType: EXAM_FILE_TYPE_MIME.GABARITO,
      size: gabaritoBuffer.length,
    });
  }

  if (editalBuffer) {
    await uploadStorageBuffer(folder, STORAGE_FILES.edital, editalBuffer, "application/pdf");
    await upsertExamFile({
      examCatalogId: exam.catalogId,
      type: "EDITAL",
      filename: STORAGE_FILES.edital,
      storagePath: formatAcervoStoragePath(folder, STORAGE_FILES.edital),
      mimeType: EXAM_FILE_TYPE_MIME.EDITAL,
      size: editalBuffer.length,
    });
  }

  const now = new Date().toISOString();
  await ensureWorkScaffold(exam, now);
  await updateWorkMetadata(exam, now);
  await updateWorkStatus(exam, now);

  const updatedExam = await updateExamCatalogBySlug(examId, {
    status: "DOWNLOADED",
    verified: true,
    pdf_available: true,
    answer_key_available: Boolean(gabaritoBuffer),
  });

  const manifest = await getWorkManifestForExam(updatedExam);
  if (!manifest) {
    throw new Error("Falha ao ler manifesto após registro.");
  }

  return {
    exam: updatedExam,
    manifest,
    storagePrefix: `${ACERVO_BUCKET}/${folder}`,
  };
}

export { importCatalogFromCsv } from "./catalog-import.server";
export type { ImportCatalogResult } from "./catalog-import.server";
