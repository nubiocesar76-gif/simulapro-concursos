import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, PlayCircle } from "lucide-react";
import {
  finishStudySession,
  formatStudyEngineError,
  goToNextQuestion,
  goToPreviousQuestion,
  loadQuestion,
  openStudySession,
  saveAnswer,
  setQuestionFavorite,
  setQuestionReviewLater,
  startStudySession,
} from "@/lib/study-engine";
import { STUDY_MODE_LABELS } from "@/lib/study-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionCard } from "@/components/app/study/QuestionCard";
import { QuestionActions } from "@/components/app/study/QuestionActions";
import { QuestionFeedbackPanel } from "@/components/app/study/QuestionFeedbackPanel";
import { QuestionMetadataBadges } from "@/components/app/study/QuestionMetadataBadges";
import { QuestionNavigation } from "@/components/app/study/QuestionNavigation";
import { QuestionOptions } from "@/components/app/study/QuestionOptions";
import { SessionHeader } from "@/components/app/study/SessionHeader";
import { SessionResultsView } from "@/components/app/study/SessionResultsView";
import { SessionProgress } from "@/components/app/study/SessionProgress";
import { SessionSummaryPanel } from "@/components/app/study/SessionSummaryPanel";
import { StudyActiveHeader } from "@/components/app/study/StudyActiveHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { toast } from "sonner";
import { STUDENT_PAGE_SHELL, STUDENT_PAGE_SHELL_NARROW } from "@/config/study";

type StudySessionPageProps = {
  sessionId: string;
};

type Phase = "preview" | "active" | "completed";

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function StudySessionPage({ sessionId }: StudySessionPageProps) {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<Phase>("preview");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const questionStartedAt = useRef(Date.now());

  const { data: openData, isLoading, error } = useQuery({
    queryKey: ["study-session-open", sessionId],
    queryFn: () => openStudySession(sessionId),
    retry: false,
  });

  const { data: question, isLoading: isLoadingQuestion, isError: isQuestionError, error: questionError, refetch: refetchQuestion } = useQuery({
    queryKey: ["study-question", sessionId, currentIndex],
    queryFn: () => loadQuestion(sessionId, currentIndex),
    enabled: phase === "active",
    retry: false,
  });

  useEffect(() => {
    if (!question) return;
    setSelectedAnswer(question.savedAnswer);
    questionStartedAt.current = Date.now();
  }, [question?.sessionQuestionId, question?.savedAnswer]);

  const startSession = useMutation({
    mutationFn: () => startStudySession(sessionId),
    onSuccess: (result) => {
      setPhase("active");
      setCurrentIndex(result.resumeIndex);
      queryClient.invalidateQueries({ queryKey: ["study-session-open", sessionId] });
      toast.success("Sessão iniciada.");
    },
    onError: (e: unknown) => toast.error(formatStudyEngineError(e)),
  });

  const answerQuestion = useMutation({
    mutationFn: () =>
      saveAnswer({
        sessionId,
        sessionQuestionId: question!.sessionQuestionId,
        selectedAnswer: selectedAnswer!,
        responseTimeSeconds: (Date.now() - questionStartedAt.current) / 1000,
      }),
    onSuccess: (updated) => {
      setSelectedAnswer(updated.savedAnswer);
      queryClient.setQueryData(["study-question", sessionId, currentIndex], updated);
      queryClient.invalidateQueries({ queryKey: ["study-session-open", sessionId] });
    },
    onError: (e: unknown) => toast.error(formatStudyEngineError(e)),
  });

  const navigateNext = useMutation({
    mutationFn: () => goToNextQuestion(sessionId, currentIndex),
    onSuccess: (nextIndex) => setCurrentIndex(nextIndex),
    onError: (e: unknown) => toast.error(formatStudyEngineError(e)),
  });

  const navigatePrevious = useMutation({
    mutationFn: () => goToPreviousQuestion(sessionId, currentIndex),
    onSuccess: (prevIndex) => setCurrentIndex(prevIndex),
    onError: (e: unknown) => toast.error(formatStudyEngineError(e)),
  });

  const finishSession = useMutation({
    mutationFn: () => finishStudySession(sessionId),
    onSuccess: async () => {
      setPhase("completed");
      await queryClient.refetchQueries({ queryKey: ["study-session-open", sessionId] });
      toast.success("Sessão concluída com sucesso.");
    },
    onError: (e: unknown) => toast.error(formatStudyEngineError(e)),
  });

  const toggleFavorite = useMutation({
    mutationFn: (input: { sessionQuestionId: string; favorite: boolean }) =>
      setQuestionFavorite({
        sessionId,
        sessionQuestionId: input.sessionQuestionId,
        favorite: input.favorite,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-question", sessionId, currentIndex] });
    },
    onError: (e: unknown) => toast.error(formatStudyEngineError(e)),
  });

  const toggleReviewLater = useMutation({
    mutationFn: (input: { sessionQuestionId: string; reviewLater: boolean }) =>
      setQuestionReviewLater({
        sessionId,
        sessionQuestionId: input.sessionQuestionId,
        reviewLater: input.reviewLater,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-question", sessionId, currentIndex] });
    },
    onError: (e: unknown) => toast.error(formatStudyEngineError(e)),
  });

  const sessionStats = useMemo(() => {
    if (!openData) return { correctCount: 0, wrongCount: 0 };
    const correctCount = openData.sessionQuestions.filter((row) => row.is_correct === true).length;
    const wrongCount = openData.sessionQuestions.filter((row) => row.is_correct === false).length;
    return { correctCount, wrongCount };
  }, [openData?.sessionQuestions]);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!openData || phase !== "active") return;
    const startedAt = new Date(openData.session.started_at).getTime();
    const tick = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [openData?.session.started_at, phase, openData]);

  if (isLoading) {
    return (
      <div className={STUDENT_PAGE_SHELL_NARROW} aria-busy="true" aria-label="Carregando sessão">
        <Skeleton className="h-8 w-48" />
        <Card>
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !openData) {
    return (
      <div className={STUDENT_PAGE_SHELL_NARROW}>
        <PageErrorState
          title="Sessão não encontrada"
          message={
            error
              ? formatStudyEngineError(error)
              : "Não foi possível abrir esta sessão. Verifique o link ou tente novamente."
          }
          action={
            <Button variant="outline" asChild>
              <Link to="/app/study">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar ao estudo
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const { session, sequence, sessionQuestions, answeredCount, results } = openData;
  const subtitle = `${session.course_name} · ${session.package_name} · v${session.version_number}`;
  const quantityLabel =
    session.settings.question_count === "all"
      ? "Todas"
      : String(session.settings.question_count);
  const totalQuestions = sessionQuestions.length || sequence.length;
  const hasStarted = sessionQuestions.length > 0;

  if (session.status === "FINISHED" || phase === "completed") {
    if (!results) {
      return (
        <div className={STUDENT_PAGE_SHELL} aria-busy="true" aria-label="Carregando resultado">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_11rem_11rem]">
            <Skeleton className="h-32 rounded-lg sm:col-span-2 lg:col-span-1" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-44 rounded-lg" />
          </div>
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      );
    }

    return <SessionResultsView session={session} results={results} />;
  }

  if (sequence.length === 0) {
    return (
      <div className={STUDENT_PAGE_SHELL_NARROW}>
        <EmptyState
          title="Sessão sem questões"
          description="Não há questões elegíveis para esta distribuição com as configurações atuais."
          action={
            <Button variant="outline" asChild>
              <Link to="/app/study">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar ao estudo
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (phase === "preview") {
    return (
      <div className={STUDENT_PAGE_SHELL_NARROW}>
        <Button variant="ghost" size="sm" className="-ml-2 mb-2 w-fit" asChild>
          <Link to="/app/study">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>

        <Card>
          <SessionHeader
            title={session.distribution_name}
            subtitle={subtitle}
            mode={session.mode}
          />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Modo</p>
                <p className="font-medium">{STUDY_MODE_LABELS[session.mode]}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantidade</p>
                <p className="font-medium">{quantityLabel}</p>
              </div>
            </div>

            <SessionProgress
              current={answeredCount}
              total={totalQuestions}
            />

            <Button
              className="w-full"
              onClick={() => startSession.mutate()}
              disabled={startSession.isPending}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              {startSession.isPending
                ? "Iniciando..."
                : hasStarted
                  ? "Continuar resolução"
                  : "Iniciar resolução"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingQuestion) {
    return (
      <div className={STUDENT_PAGE_SHELL_NARROW} aria-busy="true" aria-label="Carregando questão">
        <Skeleton className="h-8 w-20" />
        <Card>
          <div className="p-6 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-2 w-full" />
          </div>
        </Card>
        <Card>
          <div className="p-6 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (isQuestionError || !question) {
    return (
      <div className={STUDENT_PAGE_SHELL_NARROW}>
        <PageErrorState
          title="Erro ao carregar questão"
          message={formatStudyEngineError(questionError)}
          onRetry={() => refetchQuestion()}
          action={
            <Button variant="outline" asChild>
              <Link to="/app/study">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar ao estudo
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isLastQuestion = question.index === question.total - 1;
  const canAnswer = !!selectedAnswer && !question.isAnswered;
  const canGoNext = question.isAnswered && !isLastQuestion;
  const canFinish = question.isAnswered && isLastQuestion;

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-[1400px] flex-col pb-24 sm:pb-28">
      <Button variant="ghost" size="sm" className="-ml-2 mb-2 w-fit text-muted-foreground" asChild>
        <Link to="/app/study">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>
      </Button>

      <div className="flex flex-1 flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
        <div className="min-w-0 flex-1 space-y-6 lg:max-w-4xl">
          <StudyActiveHeader
            mode={session.mode}
            currentQuestion={question.index + 1}
            totalQuestions={question.total}
            elapsedLabel={formatElapsed(elapsedSeconds)}
          />

          <QuestionMetadataBadges context={question.context} />

          <QuestionCard statement={question.statement} imageUrl={question.context.imageUrl} />

          <QuestionOptions
            alternatives={question.alternatives}
            value={selectedAnswer}
            onChange={setSelectedAnswer}
            disabled={question.isAnswered}
            feedback={question.feedback}
          />

          {question.feedback && (
            <div className="space-y-4 border-t border-border/50 pt-6">
              <QuestionFeedbackPanel feedback={question.feedback} />
              <QuestionActions
                favorite={question.favorite}
                reviewLater={question.reviewLater}
                isUpdating={toggleFavorite.isPending || toggleReviewLater.isPending}
                showNext={canGoNext}
                isNavigating={navigateNext.isPending}
                onToggleFavorite={() =>
                  toggleFavorite.mutate({
                    sessionQuestionId: question.sessionQuestionId,
                    favorite: !question.favorite,
                  })
                }
                onToggleReviewLater={() =>
                  toggleReviewLater.mutate({
                    sessionQuestionId: question.sessionQuestionId,
                    reviewLater: !question.reviewLater,
                  })
                }
                onNext={() => navigateNext.mutate()}
              />
            </div>
          )}
        </div>

        <SessionSummaryPanel
          className="w-full lg:w-64 xl:w-72 lg:shrink-0"
          answeredCount={answeredCount}
          correctCount={sessionStats.correctCount}
          wrongCount={sessionStats.wrongCount}
          totalQuestions={totalQuestions}
          mode={session.mode}
          packageName={session.package_name}
          questionContext={question.context}
        />
      </div>

      <QuestionNavigation
        canGoPrevious={question.index > 0}
        canGoNext={canGoNext}
        canAnswer={canAnswer}
        canFinish={canFinish}
        isAnswering={answerQuestion.isPending}
        isNavigating={navigateNext.isPending || navigatePrevious.isPending}
        isFinishing={finishSession.isPending}
        onPrevious={() => navigatePrevious.mutate()}
        onAnswer={() => answerQuestion.mutate()}
        onNext={() => navigateNext.mutate()}
        onFinish={() => finishSession.mutate()}
        className="mt-6"
      />
    </div>
  );
}
