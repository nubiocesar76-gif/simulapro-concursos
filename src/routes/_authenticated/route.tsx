import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/design-system";

function AuthenticatedLayout() {
  const { user, loading } = useAuth();

  // Só bloqueia com a tela cheia no carregamento inicial real (sem `user` ainda).
  // Revalidações em segundo plano (ex.: onAuthStateChange ao voltar o foco da aba)
  // também setam `loading=true` momentaneamente — bloquear o <Outlet/> nesse caso
  // desmonta toda a árvore autenticada e apaga estado local dos componentes filhos
  // (ex.: seletor "Trocar Cargo" do Dashboard) sem necessidade, já que a sessão
  // já está estabelecida.
  if (loading && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Logo orientation="vertical" theme="light" className="h-20 w-auto" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});
