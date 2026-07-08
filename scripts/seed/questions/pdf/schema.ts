import { z } from "zod";
import {
  PDF_PIPELINE_VERSION,
  PIPELINE_STAGES,
  RAW_EXTRACTION_STATUSES,
  REVIEW_STATUSES,
} from "./metadata.ts";
import { seedStatusSchema } from "../../taxonomy/schema.ts";

const rawAlternativeSchema = z.object({
  letter: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-E]$/, "letter deve ser A–E"),
  text: z.string().default(""),
});

const taxonomySlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug inválido");

export const pipelineStageSchema = z.enum(PIPELINE_STAGES);
export const rawExtractionStatusSchema = z.enum(RAW_EXTRACTION_STATUSES);
export const reviewStatusSchema = z.enum(REVIEW_STATUSES);

export const workMetadataSchema = z.object({
  version: z.string().default(PDF_PIPELINE_VERSION),
  workId: z.string().trim().min(1),
  createdAt: z.string(),
  createdBy: z.string(),
  sourcePdf: z.string().trim().min(1),
  organization: z.string().optional(),
  contest: taxonomySlugSchema.optional(),
  board: taxonomySlugSchema.optional(),
  position: taxonomySlugSchema.optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  description: z.string().default(""),
});

export const rawQuestionItemSchema = z.object({
  draftId: z.string().trim().min(1),
  page: z.number().int().positive().optional(),
  questionNumber: z.number().int().positive().optional(),
  statement: z.string().default(""),
  alternatives: z
    .array(rawAlternativeSchema)
    .length(5, "questions.raw exige exatamente 5 alternativas (A–E)"),
  correctAnswer: z.string().default(""),
  subject: taxonomySlugSchema.optional(),
  topic: taxonomySlugSchema.optional(),
  explanation: z.string().default(""),
  references: z.array(z.string().trim()).default([]),
  keywords: z.array(z.string().trim()).default([]),
  status: seedStatusSchema.default("ACTIVE"),
  extractionStatus: rawExtractionStatusSchema.default("PENDING"),
  confidence: z.number().min(0).max(1).nullable().default(null),
});

export const questionsRawFileSchema = z.object({
  version: z.string().default(PDF_PIPELINE_VERSION),
  generatedAt: z.string().default(""),
  generatedBy: z.string().default(""),
  questions: z.array(rawQuestionItemSchema).default([]),
});

export const reviewItemSchema = z.object({
  draftId: z.string().trim().min(1),
  status: reviewStatusSchema.default("PENDING"),
  reviewer: z.string().default(""),
  notes: z.string().default(""),
  reviewedAt: z.string().default(""),
});

export const reviewFileSchema = z.object({
  version: z.string().default(PDF_PIPELINE_VERSION),
  updatedAt: z.string().default(""),
  items: z.array(reviewItemSchema).default([]),
});

export const statusHistoryEntrySchema = z.object({
  stage: pipelineStageSchema,
  at: z.string(),
  by: z.string(),
  note: z.string().optional(),
});

export const statusFileSchema = z.object({
  version: z.string().default(PDF_PIPELINE_VERSION),
  workId: z.string().trim().min(1),
  stage: pipelineStageSchema.default("REGISTERED"),
  history: z.array(statusHistoryEntrySchema).default([]),
  sourcePdf: z.string().trim().min(1),
  workDir: z.string().trim().min(1),
});

export type WorkMetadata = z.infer<typeof workMetadataSchema>;
export type QuestionsRawFile = z.infer<typeof questionsRawFileSchema>;
export type ReviewFile = z.infer<typeof reviewFileSchema>;
export type StatusFile = z.infer<typeof statusFileSchema>;
