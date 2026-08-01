import type { EditorialAiBatchFilters, EditorialAiCycleFilters } from "./repository";
import type {
  EditorialAiBatch,
  EditorialAiBatchInsert,
  EditorialAiBatchUpdate,
  EditorialAiCycle,
  EditorialAiCycleInsert,
  EditorialAiCycleStatus,
} from "./types";

/**
 * Camada de aplicação (IT-007): apenas orquestra os repositórios homologados
 * na IT-006 (repository.ts/repository.server.ts/satellites.server.ts).
 * Não acessa Supabase, não conhece nomes de tabela, não valida workflow,
 * não decide transições, não monta prompts, não publica.
 */

export interface EditorialAiBatchService {
  createBatch(input: EditorialAiBatchInsert): Promise<EditorialAiBatch>;
  getBatch(id: string): Promise<EditorialAiBatch | null>;
  listBatches(filters?: EditorialAiBatchFilters): Promise<EditorialAiBatch[]>;
  updateBatch(id: string, patch: EditorialAiBatchUpdate): Promise<EditorialAiBatch>;
}

export interface EditorialAiCycleService {
  createCycle(input: EditorialAiCycleInsert): Promise<EditorialAiCycle>;
  getCycle(id: string): Promise<EditorialAiCycle | null>;
  listCycles(filters?: EditorialAiCycleFilters): Promise<EditorialAiCycle[]>;
  updateCycleStatus(id: string, newStatus: EditorialAiCycleStatus): Promise<EditorialAiCycle>;
}
