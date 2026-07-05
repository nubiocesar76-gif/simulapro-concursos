import { supabase } from "@/integrations/supabase/client";

// Registra um evento na tabela `logs`. Nunca lança erro para não quebrar o fluxo principal.
export async function logEvent(
  action: string,
  entity: string | null,
  entity_id: string | null = null,
  metadata: Record<string, any> = {},
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("logs").insert({
      user_id: user?.id ?? null,
      action,
      entity,
      entity_id,
      metadata,
    });
  } catch {
    // silencioso
  }
}
