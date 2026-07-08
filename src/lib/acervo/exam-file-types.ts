import type { WorkFileKey } from "./types";

export const EXAM_FILE_TYPES = [
  "PROVA",
  "GABARITO",
  "EDITAL",
  "RAW",
  "QUESTIONS_RAW",
  "QUESTIONS",
  "METADATA",
  "STATUS",
  "REVIEW",
] as const;

export type ExamFileType = (typeof EXAM_FILE_TYPES)[number];

export const WORK_KEY_TO_EXAM_FILE_TYPE: Record<WorkFileKey, ExamFileType> = {
  prova: "PROVA",
  gabarito: "GABARITO",
  edital: "EDITAL",
  rawMd: "RAW",
  questionsRaw: "QUESTIONS_RAW",
  questionsJson: "QUESTIONS",
};

export const EXAM_FILE_TYPE_TO_WORK_KEY: Partial<Record<ExamFileType, WorkFileKey>> = {
  PROVA: "prova",
  GABARITO: "gabarito",
  EDITAL: "edital",
  RAW: "rawMd",
  QUESTIONS_RAW: "questionsRaw",
  QUESTIONS: "questionsJson",
};

export const EXAM_FILE_TYPE_MIME: Partial<Record<ExamFileType, string>> = {
  PROVA: "application/pdf",
  GABARITO: "application/pdf",
  EDITAL: "application/pdf",
  RAW: "text/markdown",
  QUESTIONS_RAW: "application/json",
  QUESTIONS: "application/json",
  METADATA: "application/json",
  STATUS: "application/json",
  REVIEW: "application/json",
};
