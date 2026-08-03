import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  BadgeCheck,
  BookOpen,
  ExternalLink,
  Headphones,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchMySubscriptions,
  resolveDisplayStatus,
  formatBillingType,
  formatDueDate,
  type MySubscriptionRow,
} from "@/lib/student-subscription";
import { getAsaasLiveStatus, type AsaasLiveStatus } from "@/lib/student-subscription.functions";
import { FREE_PLAN_DISTRIBUTION_ID } from "@/config/free-plan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { STUDENT_PAGE_SHELL } from "@/config/study";
import { SubscriptionOnboardingFlow } from "@/components/app/subscription/SubscriptionOnboardingFlow";
import { ActivePlanIllustration } from "@/components/app/subscription/SubscriptionIllustrations";

// Mesmo critério de vigência usado no backend (Bug G4/G4.1) — só decide o que
// mostrar na tela, não decide acesso de verdade (isso continua sendo feito pelo
// servidor em cada server function).
function isCurrentlyActive(subscription: MySubscriptionRow): boolean {
  if (subscription.status !== "ACTIVE") return false;
  const now = Date.now();
  if (new Date(subscription.starts_at).getTime() > now) return false;
  if (subscription.expires_at && new Date(subscription.expires_at).getTime() < now) return false;
  return true;
}

// Painel de métricas do cabeçalho — números reais, os mesmos já auditados e usados
// na Landing (`STATS` em src/routes/index.tsx), não valores de exemplo inventados.
// "+60 Concursos disponíveis" foi removido daqui por não corresponder a nenhum dado
// real (a tabela `exams` tem 22 registros) — substituído por "100% Oficiais", que é
// um dos 4 valores da STATS original da Landing, não usado nesta tela até então.
const HEADER_METRICS = [
  { icon: BookOpen, value: "1.100+", label: "Questões atualizadas" },
  { icon: BadgeCheck, value: "100%", label: "Questões oficiais" },
  { icon: Award, value: "22", label: "Bancas organizadoras" },
] as const;

const FOOTER_BENEFITS = [
  { icon: ShieldCheck, title: "Ambiente 100% seguro", description: "Seus dados protegidos" },
  { icon: Lock, title: "Cancelamento fácil", description: "A qualquer momento" },
  { icon: Headphones, title: "Suporte humanizado", description: "Estamos aqui para ajudar" },
  { icon: Award, title: "Conteúdo de qualidade", description: "Questões atualizadas sempre" },
] as const;

export function SubscriptionPage() {
  const { user } = useAuth();

  const {
    data: subscriptions,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-subscriptions", user?.id],
    enabled: !!user,
    queryFn: () => fetchMySubscriptions(user!.id),
  });

  if (isLoading) {
    return (
      <div className={STUDENT_PAGE_SHELL} aria-busy="true" aria-label="Carregando assinatura">
        <Skeleton className="h-40 rounded-[28px]" />
        <Skeleton className="h-56 rounded-[28px]" />
      </div>
    );
  }

  if (isError || !subscriptions) {
    return (
      <div className={STUDENT_PAGE_SHELL}>
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Minha assinatura</h1>
        </header>
        <PageErrorState
          title="Erro ao carregar assinatura"
          message={
            error instanceof Error ? error.message : "Não foi possível carregar sua assinatura."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className={STUDENT_PAGE_SHELL}>
      <SubscriptionHero />

      {subscriptions.length > 0 && (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      )}

      {/* O catálogo (Área → Cargo → Concursos → Free/planos pagos) some quando já existe
          assinatura paga vigente — não faz sentido oferecer upgrade ou o plano free para
          quem já tem acesso completo. Continua visível para quem só tem (ou não tem
          nenhuma) assinatura free, para permitir o upgrade descrito na validação da G6.0. */}
      {!subscriptions.some(
        (s) => s.distribution_id !== FREE_PLAN_DISTRIBUTION_ID && isCurrentlyActive(s),
      ) && <SubscriptionOnboardingFlow />}

      <SubscriptionFooterBenefits />
    </div>
  );
}

function SubscriptionHero() {
  return (
    <header
      className="overflow-hidden rounded-[28px] px-6 py-8 sm:px-10 sm:py-10"
      style={{
        background: "linear-gradient(135deg, #0A1633 0%, #0F1E45 55%, #12245A 100%)",
      }}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Minha assinatura
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">
            Acompanhe seu plano, gerencie sua assinatura e escolha a melhor forma de acelerar sua
            aprovação.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:w-auto lg:min-w-[420px] lg:grid-cols-3">
          {HEADER_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#60A5FA]">
                <metric.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-base font-bold leading-tight text-white">{metric.value}</p>
                <p className="truncate text-[11px] leading-tight text-white/60">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function SubscriptionFooterBenefits() {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-[24px] border border-[color:var(--ds-color-border)] bg-white p-6 sm:grid-cols-4">
      {FOOTER_BENEFITS.map((benefit) => (
        <div key={benefit.title} className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
            <benefit.icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: "#0A1633" }}>
              {benefit.title}
            </p>
            <p className="truncate text-xs text-[#64748B]">{benefit.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SubscriptionCard({ subscription }: { subscription: MySubscriptionRow }) {
  const qc = useQueryClient();
  const live = useQuery({
    queryKey: ["asaas-live-status", subscription.distribution_id],
    queryFn: () => getAsaasLiveStatus({ data: { distributionId: subscription.distribution_id } }),
  });

  const liveData: AsaasLiveStatus | undefined = live.data;
  const status = resolveDisplayStatus(subscription.status, subscription.expires_at, liveData);
  const isActive = status === "Ativa";

  return (
    <div className="overflow-hidden rounded-[28px] border border-[color:var(--ds-color-border)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid gap-8 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-[#DBEAFE] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#1D4ED8] hover:bg-[#DBEAFE]">
              Plano atual
            </Badge>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                isActive ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#F1F5F9] text-[#64748B]"
              }`}
            >
              {status}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "#0A1633" }}>
              {subscription.distribution_name}
            </h2>
            <p className="text-sm text-[#64748B]">
              {subscription.course_name} · {subscription.package_name}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-xs font-medium text-[#64748B]">Próxima cobrança</p>
              <p className="mt-0.5 font-semibold" style={{ color: "#0A1633" }}>
                {formatDueDate(liveData?.nextDueDate ?? null)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#64748B]">Vencimento da assinatura</p>
              <p className="mt-0.5 font-semibold" style={{ color: "#0A1633" }}>
                {formatDueDate(subscription.expires_at)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#64748B]">Método de pagamento</p>
              <p className="mt-0.5 font-semibold" style={{ color: "#0A1633" }}>
                {formatBillingType(liveData?.billingType ?? null)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {liveData?.invoiceUrl && (
              <Button asChild className="rounded-xl">
                <a href={liveData.invoiceUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Gerenciar pagamento
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                qc.invalidateQueries({
                  queryKey: ["asaas-live-status", subscription.distribution_id],
                })
              }
              disabled={live.isFetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${live.isFetching ? "animate-spin" : ""}`} />
              {live.isFetching ? "Atualizando..." : "Atualizar assinatura"}
            </Button>
          </div>
        </div>

        <ActivePlanIllustration className="hidden h-36 w-36 sm:block" />
      </div>
    </div>
  );
}
