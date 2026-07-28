import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/design-system";

export const Route = createFileRoute("/redefinir-senha")({
  component: RedefinirSenhaPage,
});

function parseUrlError(): string | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const search = new URLSearchParams(window.location.search);
  const description = hash.get("error_description") ?? search.get("error_description");
  const code = hash.get("error_code") ?? search.get("error_code");
  if (!description && !code) return null;
  if (code === "otp_expired") return "Este link de redefinição expirou. Solicite um novo.";
  return description
    ? decodeURIComponent(description.replace(/\+/g, " "))
    : "Link de redefinição inválido. Solicite um novo.";
}

function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    setLinkError(parseUrlError());
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Preencha os dois campos de senha.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(
        error.message.toLowerCase().includes("session")
          ? "Link de redefinição inválido ou expirado. Solicite um novo."
          : error.message,
      );
      return;
    }
    toast.success("Senha redefinida com sucesso! Faça login com a nova senha.");
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <Logo orientation="vertical" theme="light" className="h-24 w-auto" />
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold">Redefinir senha</h1>
          {linkError ? (
            <>
              <p className="mt-4 text-sm text-destructive">{linkError}</p>
              <div className="mt-4 text-center">
                <Link to="/recuperar-senha" className="text-sm text-primary hover:underline">
                  Solicitar novo link
                </Link>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-4">
              <div>
                <Label htmlFor="new-pw">Nova senha</Label>
                <PasswordInput
                  id="new-pw"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="new-pw-confirm">Confirmar nova senha</Label>
                <PasswordInput
                  id="new-pw-confirm"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {mismatch && (
                  <p className="mt-1 text-sm text-destructive">As senhas não coincidem.</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={busy || mismatch}>
                {busy ? "Salvando..." : "Redefinir senha"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
