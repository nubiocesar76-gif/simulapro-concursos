import { z } from "zod";
import { computeContentHash } from "./hash.ts";
import {
  DEFAULT_QUESTIONS_DESCRIPTION,
  DEFAULT_QUESTIONS_VERSION,
} from "./metadata.ts";
import { seedEnvironmentSchema, seedStatusSchema } from "../taxonomy/schema.ts";

export const questionsMetadataSchema = z.object({
  version: z
    .string()
    .trim()
    .regex(/^\d+\.\d+\.\d+$/, "version deve seguir semver (ex.: 1.0.0)")
    .default(DEFAULT_QUESTIONS_VERSION),
  generatedAt: z.string().default(""),
  generatedBy: z.string().default(""),
  description: z.string().default(DEFAULT_QUESTIONS_DESCRIPTION),
  environment: seedEnvironmentSchema.default("production"),
});

const taxonomySlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug inválido");

const statementSchema = z.string().trim().min(10, "statement deve ter pelo menos 10 caracteres");

const packageVersionSchema = z
  .string()
  .trim()
  .regex(/^\d+\.\d+(?:\.\d+)?$/, "packageVersion deve seguir o padrão semântico (ex.: 1.0)");

export const questionAlternativeSchema = z.object({
  letter: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-E]$/, "letter deve ser A–E"),
  text: z.string().trim().min(1, "text da alternativa é obrigatório"),
});

export const questionSourceSchema = z.object({
  organization: z.string().trim().optional(),
  exam: z.string().trim().optional(),
  page: z.number().int().positive().optional(),
  question: z.number().int().positive().optional(),
});

const questionSeedItemBaseSchema = z.object({
  statement: statementSchema,
  alternatives: z.array(questionAlternativeSchema).min(2, "mínimo de 2 alternativas"),
  correctAnswer: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-E]$/, "correctAnswer deve ser A–E"),
  position: taxonomySlugSchema.optional(),
  board: taxonomySlugSchema.optional(),
  contest: taxonomySlugSchema.optional(),
  subject: taxonomySlugSchema.optional(),
  topic: taxonomySlugSchema.optional(),
  package: taxonomySlugSchema.optional(),
  packageVersion: packageVersionSchema.optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  explanation: z.string().optional().default(""),
  references: z.array(z.string().trim()).default([]),
  status: seedStatusSchema.default("ACTIVE"),
  keywords: z.array(z.string().trim()).default([]),
  source: questionSourceSchema.optional(),
  contentHash: z.string().trim().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const questionSeedItemSchema = questionSeedItemBaseSchema.superRefine((item, ctx) => {
  const letters = item.alternatives.map((a) => a.letter);
  if (!letters.includes(item.correctAnswer)) {
    ctx.addIssue({
      code: "custom",
      message: "correctAnswer deve corresponder a uma das alternativas",
      path: ["correctAnswer"],
    });
  }

  const computed = computeContentHash(item.statement, item.alternatives, item.correctAnswer);
  if (item.contentHash && item.contentHash !== computed) {
    ctx.addIssue({
      code: "custom",
      message: "contentHash não corresponde ao conteúdo da questão",
      path: ["contentHash"],
    });
  }
});

export const questionsSeedSchema = z.object({
  metadata: questionsMetadataSchema,
  questions: z.array(questionSeedItemSchema).default([]),
});

export type QuestionsMetadata = z.infer<typeof questionsMetadataSchema>;
export type QuestionSeedItem = z.infer<typeof questionSeedItemSchema>;
export type QuestionsSeedFile = z.infer<typeof questionsSeedSchema>;

export function withContentHash(item: QuestionSeedItem): QuestionSeedItem & { contentHash: string } {
  const hash = computeContentHash(item.statement, item.alternatives, item.correctAnswer);
  return { ...item, contentHash: item.contentHash ?? hash };
}
