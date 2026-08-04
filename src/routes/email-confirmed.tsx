import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button, Logo } from "@/components/design-system";
import { useAuth } from "@/hooks/use-auth";
import { fetchMySubscriptions } from "@/lib/student-subscription";

export const Route = createFileRoute("/email-confirmed")({
  component: EmailConfirmedPage,
});

/**
 * Mesmo padrão de leitura de erro de link já usado em redefinir-senha.tsx —
 * um link de confirmação expirado/inválido chega aqui com error_description
 * na URL (hash ou query), nunca como sessão válida.
 */
function parseUrlError(): string | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const search = new URLSearchParams(window.location.search);
  const description = hash.get("error_description") ?? search.get("error_description");
  const code = hash.get("error_code") ?? search.get("error_code");
  if (!description && !code) return null;
  if (code === "otp_expired")
    return "Este link de confirmação expirou. Faça login para receber um novo.";
  return description
    ? decodeURIComponent(description.replace(/\+/g, " "))
    : "Link de confirmação inválido.";
}

function EmailConfirmedPage() {
  const { user, role } = useAuth();
  const [linkError, setLinkError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setLinkError(parseUrlError());
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { data: subscriptions } = useQuery({
    queryKey: ["my-subscriptions", user?.id],
    enabled: !!user,
    queryFn: () => fetchMySubscriptions(user!.id),
  });

  const primaryTo = user && role ? (role === "admin" ? "/admin" : "/app") : "/auth";
  const showPlansCta = !user || (subscriptions && subscriptions.length === 0);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(180deg, #EEF2F6 0%, #F7F9FB 100%)",
        fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        className="w-full max-w-lg transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.98)",
        }}
      >
        <div className="mb-8 flex justify-center">
          <Logo orientation="vertical" theme="light" className="h-16 w-auto" />
        </div>

        <div
          className="rounded-[20px] border bg-white px-8 py-10 text-center sm:px-12 sm:py-12"
          style={{ borderColor: "#E3E8EF", boxShadow: "0 20px 60px -20px rgba(10,22,51,0.18)" }}
        >
          {linkError ? (
            <>
              <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "#FEF2F2" }}
              >
                <XCircle className="h-9 w-9" style={{ color: "#DC2626" }} aria-hidden="true" />
              </div>
              <h1 className="text-xl font-extrabold sm:text-2xl" style={{ color: "#0A1633" }}>
                Não foi possível confirmar seu e-mail
              </h1>
              <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: "#64748B" }}>
                {linkError}
              </p>
              <div className="mt-8">
                <Button asChild size="lg" variant="primary">
                  <Link to="/auth">Ir para o login</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "#ECFDF5" }}
              >
                <CheckCircle2 className="h-9 w-9" style={{ color: "#16A34A" }} aria-hidden="true" />
              </div>

              <h1 className="text-xl font-extrabold sm:text-2xl" style={{ color: "#0A1633" }}>
                Conta confirmada com sucesso!
              </h1>
              <p className="mt-2 text-[15px] font-semibold" style={{ color: "#334155" }}>
                Seu e-mail foi confirmado e sua conta está pronta para uso.
              </p>
              <p
                className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed"
                style={{ color: "#64748B" }}
              >
                Obrigado por confirmar seu cadastro. Agora você já pode começar sua preparação para
                concursos públicos.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg" variant="primary" fullWidth className="sm:w-auto">
                  <Link to={primaryTo}>Entrar no SimulaPro</Link>
                </Button>
                {showPlansCta && (
                  <Button asChild size="lg" variant="outline" fullWidth className="sm:w-auto">
                    <a href="/#planos">Conhecer os planos</a>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
