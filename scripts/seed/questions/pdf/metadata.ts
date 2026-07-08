export const PDF_PIPELINE_ENGINE_NAME = "SimulaPro PDF Pipeline";
export const PDF_PIPELINE_VERSION = "1.0.0";

export const PIPELINE_STAGES = [
  "REGISTERED",
  "EXTRACTING",
  "REVIEW",
  "APPROVED",
  "CONVERTED",
  "SEEDED",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const RAW_EXTRACTION_STATUSES = [
  "PENDING",
  "EXTRACTED",
  "NEEDS_REVIEW",
] as const;

export type RawExtractionStatus = (typeof RAW_EXTRACTION_STATUSES)[number];

export const REVIEW_STATUSES = ["PENDING", "APPROVED", "REJECTED", "EDITED"] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
