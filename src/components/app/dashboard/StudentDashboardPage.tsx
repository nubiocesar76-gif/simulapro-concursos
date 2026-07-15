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
import { Skeleton } from "@/components/ui/skeleton";
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

const pageShellClass = STUDENT_PAGE_SHELL;

function DashboardLoadingSkeleton() {
  return (
    <div className={pageShellClass} aria-busy="true" aria-label="Carregando dashboard">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <section className="space-y-6" aria-hidden="true">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-36 rounded-lg" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-52 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-9 w-36 rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6" aria-hidden="true">
        <div className="space-y-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28 rounded-lg" />
          ))}
        </div>
        <div className="rounded-lg border p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border p-6 space-y-4">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-64" />
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-12 w-full rounded-lg" />
            ))}
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
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
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Olá, {profile?.full_name ?? "estudante"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Seu resumo de estudos e ponto de entrada para continuar aprendendo.
        </p>
      </header>

      <section className="space-y-6" aria-label="O que fazer agora">
        <div>
          <h2 className="text-lg font-semibold">O que fazer agora</h2>
          <p className="text-sm text-muted-foreground">
            Retome uma sessão, escolha uma distribuição ou use um atalho filtrado.
          </p>
        </div>

        {data.continueStudy && <ContinueStudyCard session={data.continueStudy} />}

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Seu Acervo</h2>
            <p className="text-sm text-muted-foreground">
              O conteúdo disponível para você estudar.
            </p>
          </div>
          {data.distributions.length === 0 ? (
            <ActivatePlanCard />
          ) : (
            <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.distributions.map((distribution) => (
                <DistributionCard key={distribution.distribution_id} distribution={distribution} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Atalhos de estudo</h2>
            <p className="text-sm text-muted-foreground">
              Inicie uma sessão filtrada com um clique ou acesse a{" "}
              <Link to="/app/review" className="font-medium text-primary underline-offset-4 hover:underline">
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

      <section className="space-y-6" aria-label="Como você está indo">
        <div>
          <h2 className="text-lg font-semibold">Como você está indo</h2>
          <p className="text-sm text-muted-foreground">
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
