import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, fetchRole } from "@/hooks/use-auth";
import { Logo } from "@/components/design-system";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user, role, loading, error } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const passwordMismatch =
    signupConfirmPassword.length > 0 && signupPassword !== signupConfirmPassword;

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Logo orientation="vertical" theme="light" className="h-20 w-auto" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (user && role) {
    return <Navigate to={role === "admin" ? "/admin" : "/app"} replace />;
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setBusy(false);
    if (loginError) return toast.error(loginError.message);
    if (!data.session?.user) return toast.error("Sessão não criada. Tente novamente.");

    const { role: nextRole, error: roleError } = await fetchRole(data.session.user.id);
    if (roleError) return toast.error(roleError);

    toast.success("Bem-vindo de volta!");
    navigate({ to: nextRole === "admin" ? "/admin" : "/app", replace: true });
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { data, error: signupError } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        data: { full_name: String(form.get("full_name") ?? "") },
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      },
    });
    setBusy(false);
    if (signupError) return toast.error(signupError.message);
    if (data.session) {
      toast.success("Conta criada! Redirecionando...");
      return;
    }
    toast.success("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <Logo orientation="vertical" theme="light" className="h-24 w-auto" />
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <Tabs defaultValue="login">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">
                Criar conta
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-3 pt-4">
                <div>
                  <Label htmlFor="l-email">Email</Label>
                  <Input id="l-email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="l-pw">Senha</Label>
                  <Input id="l-pw" name="password" type="password" required />
                  <div className="mt-1 text-right">
                    <Link
                      to="/recuperar-senha"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Esqueci minha senha?
                    </Link>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-3 pt-4">
                <div>
                  <Label htmlFor="s-name">Nome completo</Label>
                  <Input id="s-name" name="full_name" required />
                </div>
                <div>
                  <Label htmlFor="s-email">Email</Label>
                  <Input id="s-email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="s-pw">Senha</Label>
                  <PasswordInput
                    id="s-pw"
                    name="password"
                    required
                    minLength={6}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="s-pw-confirm">Repetir senha</Label>
                  <PasswordInput
                    id="s-pw-confirm"
                    name="confirm_password"
                    required
                    minLength={6}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  />
                  {passwordMismatch && (
                    <p className="mt-1 text-sm text-destructive">As senhas não coincidem.</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={busy || passwordMismatch}>
                  {busy ? "Criando..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
