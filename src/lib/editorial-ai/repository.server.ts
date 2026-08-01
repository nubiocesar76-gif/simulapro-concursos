import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  EditorialAiBatchFilters,
  EditorialAiBatchRepository,
  EditorialAiCycleFilters,
  EditorialAiCycleRepository,
} from "./repository";
import type {
  EditorialAiBatch,
  EditorialAiBatchInsert,
  EditorialAiBatchUpdate,
  EditorialAiCycle,
  EditorialAiCycleInsert,
  EditorialAiCycleStatus,
} from "./types";

const BATCHES_TABLE = "editorial_ai_batches";
const CYCLES_TABLE = "editorial_ai_cycles";

export class SupabaseEditorialAiBatchRepository implements EditorialAiBatchRepository {
  async create(input: EditorialAiBatchInsert): Promise<EditorialAiBatch> {
    const { data, error } = await supabaseAdmin
      .from(BATCHES_TABLE)
      .insert(input)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(
        `Falha ao criar lote editorial: ${error?.message ?? "registro não retornado"}`,
      );
    }

    return data as unknown as EditorialAiBatch;
  }

  async get(id: string): Promise<EditorialAiBatch | null> {
    const { data, error } = await supabaseAdmin
      .from(BATCHES_TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Falha ao buscar lote editorial: ${error.message}`);
    }

    return (data as unknown as EditorialAiBatch | null) ?? null;
  }

  async list(filters?: EditorialAiBatchFilters): Promise<EditorialAiBatch[]> {
    let query = supabaseAdmin.from(BATCHES_TABLE).select("*");

    if (filters?.architectureId) {
      query = query.eq("architecture_id", filters.architectureId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Falha ao listar lotes editoriais: ${error.message}`);
    }

    return (data ?? []) as unknown as EditorialAiBatch[];
  }

  async update(id: string, patch: EditorialAiBatchUpdate): Promise<EditorialAiBatch> {
    const { data, error } = await supabaseAdmin
      .from(BATCHES_TABLE)
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(
        `Falha ao atualizar lote editorial: ${error?.message ?? "registro não encontrado"}`,
      );
    }

    return data as unknown as EditorialAiBatch;
  }
}

export class SupabaseEditorialAiCycleRepository implements EditorialAiCycleRepository {
  async create(input: EditorialAiCycleInsert): Promise<EditorialAiCycle> {
    const { data, error } = await supabaseAdmin
      .from(CYCLES_TABLE)
      .insert(input)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(
        `Falha ao criar ciclo editorial: ${error?.message ?? "registro não retornado"}`,
      );
    }

    return data as unknown as EditorialAiCycle;
  }

  async get(id: string): Promise<EditorialAiCycle | null> {
    const { data, error } = await supabaseAdmin
      .from(CYCLES_TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Falha ao buscar ciclo editorial: ${error.message}`);
    }

    return (data as unknown as EditorialAiCycle | null) ?? null;
  }

  async list(filters?: EditorialAiCycleFilters): Promise<EditorialAiCycle[]> {
    let query = supabaseAdmin.from(CYCLES_TABLE).select("*");

    if (filters?.batchId) {
      query = query.eq("batch_id", filters.batchId);
    }
    if (filters?.architectureId) {
      query = query.eq("architecture_id", filters.architectureId);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Falha ao listar ciclos editoriais: ${error.message}`);
    }

    return (data ?? []) as unknown as EditorialAiCycle[];
  }

  async updateStatus(id: string, newStatus: EditorialAiCycleStatus): Promise<EditorialAiCycle> {
    const { data, error } = await supabaseAdmin
      .from(CYCLES_TABLE)
      .update({ status: newStatus })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(
        `Falha ao atualizar status do ciclo editorial: ${error?.message ?? "registro não encontrado"}`,
      );
    }

    return data as unknown as EditorialAiCycle;
  }
}

export const supabaseEditorialAiBatchRepository = new SupabaseEditorialAiBatchRepository();
export const supabaseEditorialAiCycleRepository = new SupabaseEditorialAiCycleRepository();
