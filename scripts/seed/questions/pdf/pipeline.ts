/**
 * SimulaPro — PDF Question Production Pipeline
 *
 * Fluxo futuro (não implementado nesta sprint):
 *   PDF → IA → questions.raw.json → Revisão → questions.json → Seed
 *
 * Esta sprint entrega apenas a infraestrutura de registro e pasta de trabalho.
 */
export {
  PDF_PIPELINE_ENGINE_NAME,
  PDF_PIPELINE_VERSION,
  PIPELINE_STAGES,
  type PipelineStage,
} from "./metadata.ts";
export {
  workMetadataSchema,
  questionsRawFileSchema,
  reviewFileSchema,
  statusFileSchema,
  type WorkMetadata,
  type QuestionsRawFile,
  type ReviewFile,
  type StatusFile,
} from "./schema.ts";
export {
  PDF_IMPORTS_DIR,
  WORK_ROOT_DIR,
  WORK_FILES,
  resolveWorkDir,
  resolvePdfInput,
  slugFromPdfFilename,
} from "./paths.ts";
export { initPdfWork, assertPdfExists, type InitWorkResult } from "./init.ts";
