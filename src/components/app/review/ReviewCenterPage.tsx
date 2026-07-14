import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BookOpenCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ReviewCenterFilters } from "@/components/app/review/ReviewCenterFilters";
import { ReviewCenterQuestionTable } from "@/components/app/review/ReviewCenterQuestionTable";
import { ReviewCenterStatsCards } from "@/components/app/review/ReviewCenterStatsCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_STUDY_BUILDER_FILTERS } from "@/lib/study-builder";
import {
  clearQuestionFavorite,
  clearQuestionReviewLater,
  fetchReviewCenterSnapshot,
  formatReviewCenterError,
  paginateReviewCenter,
  REVIEW_PAGE_SIZE,
  type ReviewCenterFilters as ReviewFilters,
  type ReviewTab,
} from "@/lib/review-center";
import {
  createStudySession,
  formatStudySessionError,
  type FilterStudyMode,
} from "@/lib/study-session";
import { toast } from "sonner";
import { STUDENT_PAGE_SHELL } from "@/config/study";

const pageShellClass = STUDENT_PAGE_SHELL;

const TAB_LABELS: Record<ReviewTab, string> = {
  favorites: "Favoritas",
  review: "Revisar",
  wrong: "Erradas",
  unanswered: "Não Respondidas",
};

const TAB_SESSION_MODE: Partial<Record<ReviewTab, FilterStudyMode>> = {
  favorites: "FAVORITES",
  review: "REVIEW",
  wrong: "WRONG_ONLY",
};

export function ReviewCenterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<ReviewTab>("favorites");
  const [page, setPage] = useState(0);
  const [taxonomyFilters, setTaxonomyFilters] = useState(DEFAULT_STUDY_BUILDER_FILTERS);

  const filters = useMemo<ReviewFilters>(
    () => ({ ...taxonomyFilters, tab, page }),
    [taxonomyFilters, tab, page],
  );

  const { data: snapshot, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["review-center-snapshot", user?.id],
    enabled: !!user,
    queryFn: () => fetchReviewCenterSnapshot(user!.id),
    staleTime: 60_000,
  });

  const pageData = useMemo(
    () => (snapshot ? paginateReviewCenter(snapshot, filters) : null),
    [snapshot, filters],
  );

  useEffect(() => {
    setPage(0);
  }, [tab, taxonomyFilters.boardId, taxonomyFilters.subjectId, taxonomyFilters.topicId, taxonomyFilters.year]);

  const respondMutation = useMutation({
    mutationFn: async (input: { distributionId: string; tab: ReviewTab }) => {
      const mode = TAB_SESSION_MODE[input.tab];
      if (mode) {
        return createStudySession({
          distributionId: input.distributionId,
          mode,
          settings: {
            question_count: "all",
            question_order: "random",
            show_answers: "during",
          },
        });
      }
      return createStudySession({
        distributionId: input.distributionId,
        mode: "STUDY",
        settings: {
          question_count: 10,
          question_order: "random",
          show_answers: "during",
        },
      });
    },
    onSuccess: (session) => {
      navigate({ to: "/app/study/$sessionId", params: { sessionId: session.id } });
    },
    onError: (e: unknown) => toast.error(formatStudySessionError(e)),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (questionId: string) => clearQuestionFavorite(user!.id, questionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["review-center-snapshot", user?.id] });
      toast.success("Removida dos favoritos.");
    },
    onError: (e: unknown) => toast.error(formatReviewCenterError(e)),
  });

  const removeReviewMutation = useMutation({
    mutationFn: (questionId: string) => clearQuestionReviewLater(user!.id, questionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["review-center-snapshot", user?.id] });
      toast.success("Removida da revisão.");
    },
    onError: (e: unknown) => toast.error(formatReviewCenterError(e)),
  });

  const isUpdating =
    respondMutation.isPending ||
    removeFavoriteMutation.isPending ||
    removeReviewMutation.isPending;

  if (isLoading) {
    return (
      <div
        className={pageShellClass}
        aria-busy="true"
        aria-label="Carregando central de revisão"
      >
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (isError || !snapshot || !pageData) {
    return (
      <div className={pageShellClass}>
        <PageErrorState
          title="Erro ao carregar central de revisão"
          message={formatReviewCenterError(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const hasAnyContent =
    snapshot.stats.favorites +
      snapshot.stats.review +
      snapshot.stats.wrong +
      snapshot.stats.unanswered >
    0;

  return (
    <div className={pageShellClass}>
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Central de Revisão</h1>
        <p className="text-sm text-muted-foreground">
          Favoritas, revisão, erradas e nunca respondidas — tudo em um único lugar.
        </p>
      </header>

      <ReviewCenterStatsCards stats={pageData.stats} />

      {!hasAnyContent ? (
        <EmptyState
          title="Nada para revisar ainda"
          description="Resolva questões, favorite ou marque para revisão para popular sua central."
          icon={BookOpenCheck}
        />
      ) : (
        <>
          <Tabs value={tab} onValueChange={(value) => setTab(value as ReviewTab)}>
            <TabsList
              className="grid h-auto w-full grid-cols-2 gap-1 lg:grid-cols-4"
              aria-label="Filtrar por tipo de revisão"
            >
              {(Object.keys(TAB_LABELS) as ReviewTab[]).map((key) => (
                <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
                  {TAB_LABELS[key]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <ReviewCenterFilters
            filters={taxonomyFilters}
            boardOptions={pageData.boardOptions}
            subjectOptions={pageData.subjectOptions}
            topicOptions={pageData.topicOptions}
            yearOptions={pageData.yearOptions}
            onChange={setTaxonomyFilters}
            disabled={isUpdating}
          />

          <ReviewCenterQuestionTable
            tab={tab}
            items={pageData.items}
            total={pageData.total}
            page={page}
            pageSize={REVIEW_PAGE_SIZE}
            isUpdating={isUpdating}
            onPageChange={setPage}
            onRespond={(item) => respondMutation.mutate({ distributionId: item.distributionId, tab })}
            onRemoveFavorite={(item) => removeFavoriteMutation.mutate(item.questionId)}
            onRemoveReview={(item) => removeReviewMutation.mutate(item.questionId)}
          />
        </>
      )}
    </div>
  );
}
