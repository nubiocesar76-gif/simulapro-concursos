import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { basename } from "node:path";
import { writeJsonFile } from "../../core/io.ts";
import { PDF_PIPELINE_ENGINE_NAME, PDF_PIPELINE_VERSION } from "./metadata.ts";
import {
  resolveWorkDir,
  resolveWorkFile,
  slugFromPdfFilename,
  WORK_FILES,
  workDirExists,
} from "./paths.ts";
import type {
  QuestionsRawFile,
  ReviewFile,
  StatusFile,
  WorkMetadata,
} from "./schema.ts";

export type InitWorkOptions = {
  pdfPath: string;
  workId?: string;
  organization?: string;
  contest?: string;
  board?: string;
  position?: string;
  year?: number;
  description?: string;
};

export type InitWorkResult = {
  workId: string;
  workDir: string;
  files: {
    metadata: string;
    questionsRaw: string;
    review: string;
    status: string;
    sourcePdf: string;
  };
};

function emptyAlternatives() {
  return ["A", "B", "C", "D", "E"].map((letter) => ({ letter, text: "" }));
}

export function initPdfWork(options: InitWorkOptions): InitWorkResult {
  const sourceFilename = basename(options.pdfPath);
  const workId = options.workId ?? slugFromPdfFilename(sourceFilename);

  if (!workId) {
    throw new Error("Não foi possível derivar workId a partir do PDF.");
  }

  if (workDirExists(workId)) {
    throw new Error(`Pasta de trabalho já existe: docs/work/${workId}`);
  }

  const workDir = resolveWorkDir(workId);
  mkdirSync(workDir, { recursive: true });

  const now = new Date().toISOString();
  const sourcePdfPath = resolveWorkFile(workId, WORK_FILES.sourcePdf);
  copyFileSync(options.pdfPath, sourcePdfPath);

  const metadataPath = resolveWorkFile(workId, WORK_FILES.metadata);
  const metadata: WorkMetadata = {
    version: PDF_PIPELINE_VERSION,
    workId,
    createdAt: now,
    createdBy: PDF_PIPELINE_ENGINE_NAME,
    sourcePdf: sourceFilename,
    description: options.description ?? `Processamento da prova ${workId}`,
    ...(options.organization ? { organization: options.organization } : {}),
    ...(options.contest ? { contest: options.contest } : {}),
    ...(options.board ? { board: options.board } : {}),
    ...(options.position ? { position: options.position } : {}),
    ...(options.year ? { year: options.year } : {}),
  };
  writeJsonFile(metadataPath, metadata);

  const questionsRawPath = resolveWorkFile(workId, WORK_FILES.questionsRaw);
  const questionsRaw: QuestionsRawFile = {
    version: PDF_PIPELINE_VERSION,
    generatedAt: "",
    generatedBy: "",
    questions: [],
  };
  writeJsonFile(questionsRawPath, questionsRaw);

  const reviewPath = resolveWorkFile(workId, WORK_FILES.review);
  const review: ReviewFile = {
    version: PDF_PIPELINE_VERSION,
    updatedAt: now,
    items: [],
  };
  writeJsonFile(reviewPath, review);

  const statusPath = resolveWorkFile(workId, WORK_FILES.status);
  const status: StatusFile = {
    version: PDF_PIPELINE_VERSION,
    workId,
    stage: "REGISTERED",
    history: [
      {
        stage: "REGISTERED",
        at: now,
        by: PDF_PIPELINE_ENGINE_NAME,
        note: "PDF recebido e pasta de trabalho criada.",
      },
    ],
    sourcePdf: sourceFilename,
    workDir: `docs/work/${workId}`,
  };
  writeJsonFile(statusPath, status);

  return {
    workId,
    workDir,
    files: {
      metadata: metadataPath,
      questionsRaw: questionsRawPath,
      review: reviewPath,
      status: statusPath,
      sourcePdf: sourcePdfPath,
    },
  };
}

export function assertPdfExists(pdfPath: string) {
  if (!existsSync(pdfPath)) {
    throw new Error(`PDF não encontrado: ${pdfPath}`);
  }
  if (!pdfPath.toLowerCase().endsWith(".pdf")) {
    throw new Error("Arquivo de entrada deve ser um PDF (.pdf).");
  }
}

export { emptyAlternatives };
