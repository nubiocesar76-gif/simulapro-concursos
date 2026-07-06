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
import { EmptyState } from "@/components/shared/EmptyState";
import { toast } from "sonner";

const DASHBOARD_FILTER_EMPTY_MESSAGES: Record<FilterStudyMode, string> = {
  FAVORITES: "Você ainda não possui questões favoritas.",
  REVIEW: "Você ainda não possui questões marcadas para revisão.",
  WRONG_ONLY: "Você ainda não possui questões pendentes de revisão.",
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
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-40 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <PageErrorState
          message="Não foi possível carregar seu painel. Tente novamente em instantes."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {profile?.full_name ?? "estudante"}</h1>
        <p className="text-sm text-muted-foreground">
          Seu resumo de estudos e ponto de entrada para continuar aprendendo.
        </p>
      </div>

      <DashboardStats stats={data.stats} />

      <StudyFilterIndicatorsBar
        indicators={data.filterIndicators}
        onShortcutClick={(mode) => startFilterSession.mutate(mode)}
        loadingShortcut={startFilterSession.isPending ? startFilterSession.variables : null}
      />

      {data.continueStudy && <ContinueStudyCard session={data.continueStudy} />}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Minhas distribuições</h2>
          <p className="text-sm text-muted-foreground">
            Conteúdos liberados pela sua assinatura.
          </p>
        </div>
        {data.distributions.length === 0 ? (
          <EmptyState
            title="Nenhuma distribuição liberada"
            description="Fale com o administrador para ativar sua assinatura."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.distributions.map((distribution) => (
              <DistributionCard key={distribution.distribution_id} distribution={distribution} />
            ))}
          </div>
        )}
      </section>

      <RecentSessions sessions={data.recentSessions} />

      <SubjectPerformanceTable subjects={data.subjectPerformance} />
    </div>
  );
}
