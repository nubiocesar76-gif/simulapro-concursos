import type {
  EditorialAiBatch,
  EditorialAiBatchInsert,
  EditorialAiBatchUpdate,
  EditorialAiCycle,
  EditorialAiCycleInsert,
  EditorialAiCycleStatus,
} from "./types";

export type EditorialAiBatchFilters = {
  architectureId?: string;
};

export interface EditorialAiBatchRepository {
  create(input: EditorialAiBatchInsert): Promise<EditorialAiBatch>;
  get(id: string): Promise<EditorialAiBatch | null>;
  list(filters?: EditorialAiBatchFilters): Promise<EditorialAiBatch[]>;
  update(id: string, patch: EditorialAiBatchUpdate): Promise<EditorialAiBatch>;
}

export type EditorialAiCycleFilters = {
  batchId?: string;
  architectureId?: string;
  status?: EditorialAiCycleStatus;
};

export interface EditorialAiCycleRepository {
  create(input: EditorialAiCycleInsert): Promise<EditorialAiCycle>;
  get(id: string): Promise<EditorialAiCycle | null>;
  list(filters?: EditorialAiCycleFilters): Promise<EditorialAiCycle[]>;
  updateStatus(id: string, newStatus: EditorialAiCycleStatus): Promise<EditorialAiCycle>;
}
