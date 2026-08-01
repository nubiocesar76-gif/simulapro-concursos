import {
  supabaseEditorialAiBatchRepository,
  supabaseEditorialAiCycleRepository,
} from "./repository.server";
import type { EditorialAiBatchFilters, EditorialAiCycleFilters } from "./repository";
import type { EditorialAiBatchService, EditorialAiCycleService } from "./service";
import type { EditorialReview } from "./generation";
import {
  createEditorialAiAnnotation as persistCreateEditorialAiAnnotation,
  createEditorialAiContent as persistCreateEditorialAiContent,
  createEditorialAiDecision as persistCreateEditorialAiDecision,
  createEditorialAiInput as persistCreateEditorialAiInput,
  createEditorialAiPublication as persistCreateEditorialAiPublication,
  createEditorialAiRequest as persistCreateEditorialAiRequest,
  createEditorialAiResponse as persistCreateEditorialAiResponse,
  getEditorialAiInputByCycleId as persistGetEditorialAiInputByCycleId,
  getEditorialAiRequestByCycleId as persistGetEditorialAiRequestByCycleId,
  getEditorialAiResponseByCycleId as persistGetEditorialAiResponseByCycleId,
  getLatestEditorialAiContentByCycleId as persistGetLatestEditorialAiContentByCycleId,
  listEditorialAiAnnotationsByCycleId as persistListEditorialAiAnnotationsByCycleId,
  listEditorialAiContentsByCycleId as persistListEditorialAiContentsByCycleId,
  listEditorialAiDecisionsByCycleId as persistListEditorialAiDecisionsByCycleId,
  listEditorialAiPublicationsByCycleId as persistListEditorialAiPublicationsByCycleId,
} from "./satellites.server";
import type {
  EditorialAiAnnotation,
  EditorialAiAnnotationInsert,
  EditorialAiBatch,
  EditorialAiBatchInsert,
  EditorialAiBatchUpdate,
  EditorialAiContent,
  EditorialAiContentInsert,
  EditorialAiCycle,
  EditorialAiCycleInsert,
  EditorialAiCycleStatus,
  EditorialAiDecision,
  EditorialAiDecisionInsert,
  EditorialAiInput,
  EditorialAiInputInsert,
  EditorialAiPublication,
  EditorialAiPublicationInsert,
  EditorialAiRequest,
  EditorialAiRequestInsert,
  EditorialAiResponse,
  EditorialAiResponseInsert,
} from "./types";

function requireId(id: string, label: string): void {
  if (!id) {
    throw new Error(`${label} é obrigatório.`);
  }
}

// ==================================================
// batch
// ==================================================

class DefaultEditorialAiBatchService implements EditorialAiBatchService {
  async createBatch(input: EditorialAiBatchInsert): Promise<EditorialAiBatch> {
    return supabaseEditorialAiBatchRepository.create(input);
  }

  async getBatch(id: string): Promise<EditorialAiBatch | null> {
    requireId(id, "id");
    return supabaseEditorialAiBatchRepository.get(id);
  }

  async listBatches(filters?: EditorialAiBatchFilters): Promise<EditorialAiBatch[]> {
    return supabaseEditorialAiBatchRepository.list(filters);
  }

  async updateBatch(id: string, patch: EditorialAiBatchUpdate): Promise<EditorialAiBatch> {
    requireId(id, "id");
    return supabaseEditorialAiBatchRepository.update(id, patch);
  }
}

export const editorialAiBatchService: EditorialAiBatchService =
  new DefaultEditorialAiBatchService();

// ==================================================
// cycle
// ==================================================

class DefaultEditorialAiCycleService implements EditorialAiCycleService {
  async createCycle(input: EditorialAiCycleInsert): Promise<EditorialAiCycle> {
    return supabaseEditorialAiCycleRepository.create(input);
  }

  async getCycle(id: string): Promise<EditorialAiCycle | null> {
    requireId(id, "id");
    return supabaseEditorialAiCycleRepository.get(id);
  }

  async listCycles(filters?: EditorialAiCycleFilters): Promise<EditorialAiCycle[]> {
    return supabaseEditorialAiCycleRepository.list(filters);
  }

  async updateCycleStatus(
    id: string,
    newStatus: EditorialAiCycleStatus,
  ): Promise<EditorialAiCycle> {
    requireId(id, "id");
    return supabaseEditorialAiCycleRepository.updateStatus(id, newStatus);
  }
}

export const editorialAiCycleService: EditorialAiCycleService =
  new DefaultEditorialAiCycleService();

// ==================================================
// inputs
// ==================================================

export async function createEditorialAiInput(
  input: EditorialAiInputInsert,
): Promise<EditorialAiInput> {
  requireId(input.cycle_id, "cycle_id");
  return persistCreateEditorialAiInput(input);
}

export async function getEditorialAiInputByCycleId(
  cycleId: string,
): Promise<EditorialAiInput | null> {
  requireId(cycleId, "cycleId");
  return persistGetEditorialAiInputByCycleId(cycleId);
}

// ==================================================
// requests
// ==================================================

export async function createEditorialAiRequest(
  input: EditorialAiRequestInsert,
): Promise<EditorialAiRequest> {
  requireId(input.cycle_id, "cycle_id");
  return persistCreateEditorialAiRequest(input);
}

export async function getEditorialAiRequestByCycleId(
  cycleId: string,
): Promise<EditorialAiRequest | null> {
  requireId(cycleId, "cycleId");
  return persistGetEditorialAiRequestByCycleId(cycleId);
}

// ==================================================
// responses
// ==================================================

export async function createEditorialAiResponse(
  input: EditorialAiResponseInsert,
): Promise<EditorialAiResponse> {
  requireId(input.cycle_id, "cycle_id");
  return persistCreateEditorialAiResponse(input);
}

export async function getEditorialAiResponseByCycleId(
  cycleId: string,
): Promise<EditorialAiResponse | null> {
  requireId(cycleId, "cycleId");
  return persistGetEditorialAiResponseByCycleId(cycleId);
}

// ==================================================
// contents
// ==================================================

export async function createEditorialAiContent(
  input: EditorialAiContentInsert,
): Promise<EditorialAiContent> {
  requireId(input.cycle_id, "cycle_id");
  return persistCreateEditorialAiContent(input);
}

export async function listEditorialAiContentsByCycleId(
  cycleId: string,
): Promise<EditorialAiContent[]> {
  requireId(cycleId, "cycleId");
  return persistListEditorialAiContentsByCycleId(cycleId);
}

export async function getLatestEditorialAiContentByCycleId(
  cycleId: string,
): Promise<EditorialAiContent | null> {
  requireId(cycleId, "cycleId");
  return persistGetLatestEditorialAiContentByCycleId(cycleId);
}

// ==================================================
// annotations
// ==================================================

export async function createEditorialAiAnnotation(
  input: EditorialAiAnnotationInsert,
): Promise<EditorialAiAnnotation> {
  requireId(input.cycle_id, "cycle_id");
  return persistCreateEditorialAiAnnotation(input);
}

export async function listEditorialAiAnnotationsByCycleId(
  cycleId: string,
): Promise<EditorialAiAnnotation[]> {
  requireId(cycleId, "cycleId");
  return persistListEditorialAiAnnotationsByCycleId(cycleId);
}

// ==================================================
// decisions
// ==================================================

export async function createEditorialAiDecision(
  input: EditorialAiDecisionInsert,
): Promise<EditorialAiDecision> {
  requireId(input.cycle_id, "cycle_id");
  return persistCreateEditorialAiDecision(input);
}

export async function listEditorialAiDecisionsByCycleId(
  cycleId: string,
): Promise<EditorialAiDecision[]> {
  requireId(cycleId, "cycleId");
  return persistListEditorialAiDecisionsByCycleId(cycleId);
}

// ==================================================
// publications
// ==================================================

export async function createEditorialAiPublication(
  input: EditorialAiPublicationInsert,
): Promise<EditorialAiPublication> {
  requireId(input.cycle_id, "cycle_id");
  return persistCreateEditorialAiPublication(input);
}

export async function listEditorialAiPublicationsByCycleId(
  cycleId: string,
): Promise<EditorialAiPublication[]> {
  requireId(cycleId, "cycleId");
  return persistListEditorialAiPublicationsByCycleId(cycleId);
}

// ==================================================
// editorial review (ER-002 — apenas instanciação do contrato,
// sem persistência, sem consulta a banco/Supabase)
// ==================================================

export function startEditorialReview(input: {
  contentId: string;
  reviewerId: string;
}): EditorialReview {
  requireId(input.contentId, "contentId");
  requireId(input.reviewerId, "reviewerId");

  return {
    reviewId: crypto.randomUUID(),
    contentId: input.contentId,
    reviewerId: input.reviewerId,
    startedAt: new Date().toISOString(),
  };
}
