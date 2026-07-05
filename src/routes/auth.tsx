import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, fetchRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user, role, loading, error } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
    if (roleError) return toast.error(roleError.message);

    toast.success("Bem-vindo de volta!");
    navigate({ to: nextRole === "admin" ? "/admin" : "/app", replace: true });
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { data, error: signupError } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        data: { full_name: String(form.get("full_name") ?? "") },
      },
    });
    console.log({
      signupData: data,
      signupError: signupError,
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
        <div className="mb-8 flex items-center justify-center gap-2 font-bold text-xl">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          SimulaPro
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <Tabs defaultValue="login">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Criar conta</TabsTrigger>
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
                  <Input id="s-pw" name="password" type="password" required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
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
