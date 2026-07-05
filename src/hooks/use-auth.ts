import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "student";

export async function fetchRole(userId: string): Promise<{ role: AppRole | null; error: string | null }> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (error) return { role: null, error: error.message };
  if (data?.some((r) => r.role === "admin")) return { role: "admin", error: null };
  return { role: "student", error: null };
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRole(userId: string) {
      const { role: nextRole, error: roleError } = await fetchRole(userId);
      if (cancelled) return;
      setRole(nextRole);
      setError(roleError);
      setLoading(false);
    }

    async function applySession(s: Session | null, fromAuthListener = false) {
      setSession(s);
      setUser(s?.user ?? null);

      if (!s?.user) {
        setRole(null);
        setError(null);
        setLoading(false);
        return;
      }

      if (fromAuthListener) {
        // Evita deadlock: não chamar Supabase dentro do callback de onAuthStateChange.
        window.setTimeout(() => void loadRole(s.user!.id), 0);
        return;
      }

      await loadRole(s.user.id);
    }

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (cancelled) return;

      if (sessionError) {
        setSession(null);
        setUser(null);
        setRole(null);
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      void applySession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (cancelled) return;
      setLoading(true);
      void applySession(s, true);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user, role, loading, error };
}
