import { z } from "zod";
import { DEFAULT_TAXONOMY_DESCRIPTION, DEFAULT_TAXONOMY_VERSION } from "./metadata.ts";

export const seedStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const seedEnvironmentSchema = z.enum(["production", "homolog", "development"]);

export const taxonomyMetadataSchema = z.object({
  version: z
    .string()
    .trim()
    .regex(/^\d+\.\d+\.\d+$/, "version deve seguir semver (ex.: 1.0.0)")
    .default(DEFAULT_TAXONOMY_VERSION),
  generatedAt: z.string().default(""),
  generatedBy: z.string().default(""),
  description: z.string().default(DEFAULT_TAXONOMY_DESCRIPTION),
  environment: seedEnvironmentSchema.default("production"),
});

const slugSchema = z
  .string()
  .trim()
  .min(1, "slug é obrigatório")
  .max(120, "slug deve ter no máximo 120 caracteres")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug deve conter apenas letras minúsculas, números e hífens");

const nameSchema = z.string().trim().min(2).max(200);

export const taxonomyTopicSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  status: seedStatusSchema.default("ACTIVE"),
  order: z.number().int().positive(),
});

export const taxonomySubjectSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  status: seedStatusSchema.default("ACTIVE"),
  order: z.number().int().positive(),
  topics: z.array(taxonomyTopicSchema).default([]),
});

export const taxonomyPositionSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  status: seedStatusSchema.default("ACTIVE"),
  order: z.number().int().positive(),
  description: z.string().nullable().optional(),
});

export const taxonomyCourseSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  status: seedStatusSchema.default("ACTIVE"),
  order: z.number().int().positive(),
  description: z.string().nullable().optional(),
  positions: z.array(taxonomyPositionSchema).default([]),
  subjects: z.array(taxonomySubjectSchema).default([]),
});

export const taxonomyBoardSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  status: seedStatusSchema.default("ACTIVE"),
  order: z.number().int().positive(),
  acronym: z.string().trim().max(20).nullable().optional(),
});

export const taxonomyContestSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  status: seedStatusSchema.default("ACTIVE"),
  order: z.number().int().positive(),
  boardSlug: slugSchema,
  year: z.number().int().min(1900).max(2100).nullable().optional(),
});

export const taxonomySeedSchema = z.object({
  metadata: taxonomyMetadataSchema,
  courses: z.array(taxonomyCourseSchema).default([]),
  boards: z.array(taxonomyBoardSchema).default([]),
  contests: z.array(taxonomyContestSchema).default([]),
});

export type TaxonomyMetadata = z.infer<typeof taxonomyMetadataSchema>;
export type TaxonomySeedFile = z.infer<typeof taxonomySeedSchema>;
export type TaxonomyCourseSeed = z.infer<typeof taxonomyCourseSchema>;
export type TaxonomyBoardSeed = z.infer<typeof taxonomyBoardSchema>;
export type TaxonomyContestSeed = z.infer<typeof taxonomyContestSchema>;
