import { Link, useNavigate } from "@tanstack/react-router";
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
import {
  Badge,
  Button,
  Card,
  CardContent,
  Section,
  Skeleton,
  EmptyState,
} from "@/components/design-system";
import { dsFontSize } from "@/styles/design-system/tokens";
import { QuestionCard } from "@/components/app/study/QuestionCard";
import { QuestionActions } from "@/components/app/study/QuestionActions";
import { QuestionFeedbackPanel } from "@/components/app/study/QuestionFeedbackPanel";
import { QuestionMetadataBadges } from "@/components/app/study/QuestionMetadataBadges";
import { QuestionNavigation } from "@/components/app/study/QuestionNavigation";
import { QuestionOptions } from "@/components/app/study/QuestionOptions";
import { SessionResultsView } from "@/components/app/study/SessionResultsView";
import { SessionProgress } from "@/components/app/study/SessionProgress";
import { SessionSummaryPanel } from "@/components/app/study/SessionSummaryPanel";
import { StudyActiveHeader } from "@/components/app/study/StudyActiveHeader";
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

const narrowShellClass = `${STUDENT_PAGE_SHELL_NARROW} grid grid-cols-[minmax(0,1fr)]`;
const wideShellClass = `${STUDENT_PAGE_SHELL} grid grid-cols-[minmax(0,1fr)]`;
const iconSizeStyle = { width: dsFontSize.base, height: dsFontSize.base };

function BackToStudyButton() {
  return (
    <Button variant="outline" asChild>
      <Link to="/app/study">
        <ChevronLeft aria-hidden="true" style={iconSizeStyle} />
        Voltar ao estudo
      </Link>
    </Button>
  );
}

export function StudySessionPage({ sessionId }: StudySessionPageProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("preview");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const questionStartedAt = useRef(Date.now());

  const {
    data: openData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["study-session-open", sessionId],
    queryFn: () => openStudySession(sessionId),
    retry: false,
  });

  const {
    data: question,
    isLoading: isLoadingQuestion,
    isError: isQuestionError,
    error: questionError,
    refetch: refetchQuestion,
  } = useQuery({
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
      <div className={narrowShellClass} aria-busy="true" aria-label="Carregando sessão">
        <Skeleton width="60%" height="var(--ds-space-8)" />
        <Card>
          <CardContent className="flex flex-col gap-[var(--ds-space-4)] p-[var(--ds-space-6)]">
            <Skeleton width="75%" height="var(--ds-space-6)" />
            <Skeleton width="50%" height="var(--ds-space-4)" />
            <Skeleton width="100%" height="var(--ds-space-2)" />
            <Skeleton width="100%" height="var(--ds-space-10)" radius="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !openData) {
    return (
      <div className={narrowShellClass}>
        <PageErrorState
          title="Sessão não encontrada"
          message={
            error
              ? formatStudyEngineError(error)
              : "Não foi possível abrir esta sessão. Verifique o link ou tente novamente."
          }
          action={<BackToStudyButton />}
        />
      </div>
    );
  }

  const { session, sequence, sessionQuestions, answeredCount, results } = openData;
  const subtitle = `${session.course_name} · ${session.package_name} · v${session.version_number}`;
  const quantityLabel =
    session.settings.question_count === "all" ? "Todas" : String(session.settings.question_count);
  const totalQuestions = sessionQuestions.length || sequence.length;
  const hasStarted = sessionQuestions.length > 0;

  if (session.status === "FINISHED" || phase === "completed") {
    if (!results) {
      return (
        <div className={wideShellClass} aria-busy="true" aria-label="Carregando resultado">
          <div className="flex flex-col gap-[var(--ds-space-2)]">
            <Skeleton width="45%" height="var(--ds-space-8)" />
            <Skeleton width="60%" height="var(--ds-space-4)" />
          </div>
          <div className="grid items-stretch gap-[var(--ds-space-4)] sm:grid-cols-2 lg:grid-cols-[1fr_11rem_11rem]">
            <Skeleton
              width="100%"
              height="8rem"
              radius="lg"
              className="sm:col-span-2 lg:col-span-1"
            />
            <Skeleton width="100%" height="6rem" radius="lg" />
            <Skeleton width="100%" height="6rem" radius="lg" />
          </div>
          <div className="flex flex-wrap gap-[var(--ds-space-3)]">
            <Skeleton width="8rem" height="var(--ds-space-9)" radius="lg" />
            <Skeleton width="11rem" height="var(--ds-space-9)" radius="lg" />
          </div>
          <Skeleton width="100%" height="10rem" radius="lg" />
          <Skeleton width="100%" height="16rem" radius="lg" />
        </div>
      );
    }

    return <SessionResultsView session={session} results={results} />;
  }

  if (sequence.length === 0) {
    return (
      <div className={narrowShellClass}>
        <EmptyState
          title="Sessão sem questões"
          description="Não há questões elegíveis para esta distribuição com as configurações atuais."
          action={{
            label: "Voltar ao estudo",
            icon: <ChevronLeft style={iconSizeStyle} />,
            variant: "outline",
            onClick: () => navigate({ to: "/app/study" }),
          }}
        />
      </div>
    );
  }

  if (phase === "preview") {
    return (
      <div className={narrowShellClass}>
        <Button variant="ghost" size="sm" className="-ml-2 mb-1 w-fit" asChild>
          <Link to="/app/study">
            <ChevronLeft aria-hidden="true" style={iconSizeStyle} />
            Voltar
          </Link>
        </Button>

        <Section
          title={session.distribution_name}
          description={subtitle}
          actions={<Badge variant="secondary">{STUDY_MODE_LABELS[session.mode]}</Badge>}
        >
          <div className="flex flex-col gap-[var(--ds-space-6)]">
            <div
              className="grid grid-cols-2 gap-[var(--ds-space-4)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              <div>
                <p className="text-[color:var(--ds-color-text-secondary)]">Modo</p>
                <p className="font-medium text-[color:var(--ds-color-text-primary)]">
                  {STUDY_MODE_LABELS[session.mode]}
                </p>
              </div>
              <div>
                <p className="text-[color:var(--ds-color-text-secondary)]">Quantidade</p>
                <p className="font-medium text-[color:var(--ds-color-text-primary)]">
                  {quantityLabel}
                </p>
              </div>
            </div>

            <SessionProgress current={answeredCount} total={totalQuestions} />

            <Button
              fullWidth
              leftIcon={<PlayCircle style={iconSizeStyle} />}
              onClick={() => startSession.mutate()}
              disabled={startSession.isPending}
            >
              {startSession.isPending
                ? "Iniciando..."
                : hasStarted
                  ? "Continuar resolução"
                  : "Iniciar resolução"}
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  if (isLoadingQuestion) {
    return (
      <div className={narrowShellClass} aria-busy="true" aria-label="Carregando questão">
        <Skeleton width="20%" height="var(--ds-space-8)" />
        <Card>
          <CardContent className="flex flex-col gap-[var(--ds-space-3)] p-[var(--ds-space-6)]">
            <Skeleton width="75%" height="var(--ds-space-6)" />
            <Skeleton width="50%" height="var(--ds-space-4)" />
            <Skeleton width="100%" height="var(--ds-space-2)" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-[var(--ds-space-4)] p-[var(--ds-space-6)]">
            <Skeleton width="100%" height="6rem" />
            <Skeleton width="100%" height="3rem" />
            <Skeleton width="100%" height="3rem" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isQuestionError || !question) {
    return (
      <div className={narrowShellClass}>
        <PageErrorState
          title="Erro ao carregar questão"
          message={formatStudyEngineError(questionError)}
          onRetry={() => refetchQuestion()}
          action={<BackToStudyButton />}
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
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-2 w-fit text-[color:var(--ds-color-text-secondary)]"
        asChild
      >
        <Link to="/app/study">
          <ChevronLeft aria-hidden="true" style={iconSizeStyle} />
          Voltar
        </Link>
      </Button>

      <div className="flex flex-1 flex-col gap-[var(--ds-space-5)] lg:flex-row lg:items-start lg:gap-[var(--ds-space-8)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--ds-space-6)] lg:max-w-4xl">
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
            <div
              className="flex flex-col gap-[var(--ds-space-4)] border-t pt-[var(--ds-space-6)]"
              style={{ borderColor: "var(--ds-color-border)" }}
            >
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
        className="mt-[var(--ds-space-6)]"
      />
    </div>
  );
}
