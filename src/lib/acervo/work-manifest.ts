import type { WorkFileKey } from "@/lib/acervo/types";

export const ACERVO_BUCKET = "acervo";

export const WORK_FILE_LABELS: Record<WorkFileKey, string> = {
  prova: "Prova",
  gabarito: "Gabarito",
  edital: "Edital",
  rawMd: "Raw.md",
  questionsRaw: "Questions.raw.json",
  questionsJson: "Questions.json",
};

export const WORK_FILE_PATHS: Record<WorkFileKey, string> = {
  prova: "prova.pdf",
  gabarito: "gabarito.pdf",
  edital: "edital.pdf",
  rawMd: "raw.md",
  questionsRaw: "questions.raw.json",
  questionsJson: "questions.json",
};

export function formatAcervoDisplayPath(examId: string, fileName: string) {
  return `${ACERVO_BUCKET}/${examId}/${fileName}`;
}
