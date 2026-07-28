import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/design-system";

export const Route = createFileRoute("/recuperar-senha")({
  component: RecuperarSenhaPage,
});

function RecuperarSenhaPage() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Link de recuperação enviado! Verifique seu e-mail.");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <Logo orientation="vertical" theme="light" className="h-24 w-auto" />
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold">Recuperação de senha</h1>
          {sent ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua
              senha em instantes.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
