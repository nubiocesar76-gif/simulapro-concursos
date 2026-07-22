import { Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { fetchStudentDashboard, type StudyFilterIndicators } from "@/lib/student-dashboard";
import {
  createStudySession,
  FILTER_MODE_EMPTY_MESSAGES,
  formatStudySessionError,
  StudySessionError,
  type FilterStudyMode,
} from "@/lib/study-session";
import { Page, Skeleton } from "@/components/design-system";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { ContinueStudyCard } from "@/components/app/dashboard/ContinueStudyCard";
import { DashboardStats } from "@/components/app/dashboard/DashboardStats";
import { DistributionCard } from "@/components/app/dashboard/DistributionCard";
import { RecentSessions } from "@/components/app/dashboard/RecentSessions";
import { StudyFilterIndicatorsBar } from "@/components/app/dashboard/StudyFilterIndicators";
import { SubjectPerformanceTable } from "@/components/app/dashboard/SubjectPerformanceTable";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { ActivatePlanCard } from "@/components/shared/ActivatePlanCard";
import { toast } from "sonner";
import { STUDENT_PAGE_SHELL } from "@/config/study";

const sectionTitleStyle: React.CSSProperties = {
  fontSize: dsFontSize.lg,
  fontWeight: dsFontWeight.semibold,
};
const sectionDescriptionStyle: React.CSSProperties = { fontSize: dsFontSize.sm };

const DASHBOARD_FILTER_EMPTY_MESSAGES: Record<FilterStudyMode, string> = {
  FAVORITES: "Você ainda não possui questões favoritas.",
  REVIEW: "Você ainda não possui questões marcadas para revisão.",
  WRONG_ONLY: "Você ainda não possui questões erradas para revisar.",
};

const FILTER_INDICATOR_COUNT_KEYS: Record<FilterStudyMode, keyof StudyFilterIndicators> = {
  FAVORITES: "favoritesCount",
  REVIEW: "reviewLaterCount",
  WRONG_ONLY: "pendingReviewCount",
};

const FILTER_SESSION_SETTINGS = {
  question_count: "all" as const,
  question_order: "random" as const,
  show_answers: "during" as const,
};

/**
 * `grid grid-cols-[minmax(0,1fr)]` (em vez de bloco comum) no shell da
 * página: sem isso, a largura mínima das tabelas internas (colunas com
 * `min-w` fixo) se propaga para cima através do AppShell real (fora do
 * escopo desta sprint) e força rolagem horizontal da página inteira em
 * telas estreitas — o `minmax(0, 1fr)` é o truque padrão para zerar essa
 * contribuição de largura mínima automática, resolvendo só a partir daqui,
 * sem tocar no AppShell. A rolagem interna de cada tabela (`overflow-x-auto`
 * já existente) continua funcionando normalmente.
 */
const pageShellClass = `${STUDENT_PAGE_SHELL} grid grid-cols-[minmax(0,1fr)]`;

const CHIP_HEIGHT = "calc(var(--ds-space-8) + var(--ds-space-1))";

function DashboardLoadingSkeleton() {
  return (
    <div className={pageShellClass} aria-busy="true" aria-label="Carregando dashboard">
      <div className="flex flex-col gap-[var(--ds-space-2)]">
        <Skeleton width="40%" height="var(--ds-space-8)" />
        <Skeleton width="60%" height="var(--ds-space-4)" />
      </div>

      <section className="flex flex-col gap-[var(--ds-space-6)]" aria-hidden="true">
        <div className="flex flex-col gap-[var(--ds-space-2)]">
          <Skeleton width="30%" height="var(--ds-space-6)" />
          <Skeleton width="50%" height="var(--ds-space-4)" />
        </div>
        <Skeleton width="100%" height="9rem" radius="lg" />
        <div className="flex flex-col gap-[var(--ds-space-4)]">
          <div className="flex flex-col gap-[var(--ds-space-2)]">
            <Skeleton width="28%" height="var(--ds-space-6)" />
            <Skeleton width="40%" height="var(--ds-space-4)" />
          </div>
          <div className="grid gap-[var(--ds-space-4)] md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} width="100%" height="13rem" radius="lg" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[var(--ds-space-4)]">
          <div className="flex flex-col gap-[var(--ds-space-2)]">
            <Skeleton width="25%" height="var(--ds-space-6)" />
            <Skeleton width="35%" height="var(--ds-space-4)" />
          </div>
          <div className="flex flex-wrap gap-[var(--ds-space-3)]">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} width="9rem" height={CHIP_HEIGHT} radius="lg" />
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-[var(--ds-space-6)]" aria-hidden="true">
        <div className="flex flex-col gap-[var(--ds-space-2)]">
          <Skeleton width="32%" height="var(--ds-space-6)" />
          <Skeleton width="50%" height="var(--ds-space-4)" />
        </div>
        <div className="grid items-stretch gap-[var(--ds-space-4)] sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} width="100%" height="7rem" radius="lg" />
          ))}
        </div>
        <div className="rounded-[var(--ds-radius-lg)] border border-[color:var(--ds-color-border)] p-[var(--ds-space-6)]">
          <div className="flex flex-col gap-[var(--ds-space-4)]">
            <Skeleton width="28%" height="var(--ds-space-6)" />
            <Skeleton width="40%" height="var(--ds-space-4)" />
            <div className="flex flex-col gap-[var(--ds-space-2)]">
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} width="100%" height="var(--ds-space-12)" radius="lg" />
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-[var(--ds-radius-lg)] border border-[color:var(--ds-color-border)] p-[var(--ds-space-6)]">
          <div className="flex flex-col gap-[var(--ds-space-4)]">
            <Skeleton width="32%" height="var(--ds-space-6)" />
            <Skeleton width="45%" height="var(--ds-space-4)" />
            <div className="flex flex-col gap-[var(--ds-space-2)]">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} width="100%" height="var(--ds-space-12)" radius="lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () =>
      (await supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle()).data,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["student-dashboard", user?.id],
    enabled: !!user,
    queryFn: () => fetchStudentDashboard(user!.id),
    retry: false,
  });

  const startFilterSession = useMutation({
    mutationFn: async (mode: FilterStudyMode) => {
      if (!data) throw new Error("Painel ainda não carregado.");

      const countKey = FILTER_INDICATOR_COUNT_KEYS[mode];
      if (data.filterIndicators[countKey] === 0) {
        throw new StudySessionError(DASHBOARD_FILTER_EMPTY_MESSAGES[mode]);
      }
      if (!data.distributions.length) {
        throw new StudySessionError(DASHBOARD_FILTER_EMPTY_MESSAGES[mode]);
      }

      for (const distribution of data.distributions) {
        try {
          return await createStudySession({
            distributionId: distribution.distribution_id,
            mode,
            settings: FILTER_SESSION_SETTINGS,
          });
        } catch (error) {
          if (
            error instanceof StudySessionError &&
            error.message === FILTER_MODE_EMPTY_MESSAGES[mode]
          ) {
            continue;
          }
          throw error;
        }
      }

      throw new StudySessionError(DASHBOARD_FILTER_EMPTY_MESSAGES[mode]);
    },
    onSuccess: (session) => {
      navigate({ to: "/app/study/$sessionId", params: { sessionId: session.id } });
    },
    onError: (error: unknown) => toast.error(formatStudySessionError(error)),
  });

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className={pageShellClass}>
        <Page title="Dashboard" />
        <PageErrorState
          title="Erro ao carregar dashboard"
          message="Não foi possível carregar seu painel. Tente novamente em instantes."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className={pageShellClass}>
      <Page
        title={`Olá, ${profile?.full_name ?? "estudante"}`}
        description="Seu resumo de estudos e ponto de entrada para continuar aprendendo."
      />

      <section className="flex flex-col gap-[var(--ds-space-6)]" aria-label="O que fazer agora">
        <div className="flex flex-col gap-[var(--ds-space-1)]">
          <h2 className="text-[color:var(--ds-color-text-primary)]" style={sectionTitleStyle}>
            O que fazer agora
          </h2>
          <p
            className="text-[color:var(--ds-color-text-secondary)]"
            style={sectionDescriptionStyle}
          >
            Retome uma sessão, escolha uma distribuição ou use um atalho filtrado.
          </p>
        </div>

        {data.continueStudy && <ContinueStudyCard session={data.continueStudy} />}

        <div className="flex flex-col gap-[var(--ds-space-4)]">
          <div className="flex flex-col gap-[var(--ds-space-1)]">
            <h2 className="text-[color:var(--ds-color-text-primary)]" style={sectionTitleStyle}>
              Seu Acervo
            </h2>
            <p
              className="text-[color:var(--ds-color-text-secondary)]"
              style={sectionDescriptionStyle}
            >
              O conteúdo disponível para você estudar.
            </p>
          </div>
          {data.distributions.length === 0 ? (
            <ActivatePlanCard />
          ) : (
            <div className="grid items-stretch gap-[var(--ds-space-4)] md:grid-cols-2 xl:grid-cols-3">
              {data.distributions.map((distribution) => (
                <DistributionCard key={distribution.distribution_id} distribution={distribution} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[var(--ds-space-4)]">
          <div className="flex flex-col gap-[var(--ds-space-1)]">
            <h2 className="text-[color:var(--ds-color-text-primary)]" style={sectionTitleStyle}>
              Atalhos de estudo
            </h2>
            <p
              className="text-[color:var(--ds-color-text-secondary)]"
              style={sectionDescriptionStyle}
            >
              Inicie uma sessão filtrada com um clique ou acesse a{" "}
              <Link
                to="/app/review"
                className="font-medium text-[color:var(--ds-color-action)] underline-offset-4 hover:underline"
              >
                Central de Revisão
              </Link>
              .
            </p>
          </div>
          <StudyFilterIndicatorsBar
            indicators={data.filterIndicators}
            onShortcutClick={(mode) => startFilterSession.mutate(mode)}
            loadingShortcut={startFilterSession.isPending ? startFilterSession.variables : null}
          />
        </div>
      </section>

      <section className="flex flex-col gap-[var(--ds-space-6)]" aria-label="Como você está indo">
        <div className="flex flex-col gap-[var(--ds-space-1)]">
          <h2 className="text-[color:var(--ds-color-text-primary)]" style={sectionTitleStyle}>
            Como você está indo
          </h2>
          <p
            className="text-[color:var(--ds-color-text-secondary)]"
            style={sectionDescriptionStyle}
          >
            Resumo do seu progresso e desempenho por disciplina.
          </p>
        </div>

        <DashboardStats stats={data.stats} />

        <RecentSessions sessions={data.recentSessions} />

        <SubjectPerformanceTable subjects={data.subjectPerformance} />
      </section>
    </div>
  );
}
