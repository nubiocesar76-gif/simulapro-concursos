import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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
import { QuestionNavigation } from "@/components/app/study/QuestionNavigation";
import { QuestionOptions } from "@/components/app/study/QuestionOptions";
import { SessionHeader } from "@/components/app/study/SessionHeader";
import { SessionProgress } from "@/components/app/study/SessionProgress";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { toast } from "sonner";

type StudySessionPageProps = {
  sessionId: string;
};

type Phase = "preview" | "active" | "completed";

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
    onSuccess: () => {
      setPhase("completed");
      queryClient.invalidateQueries({ queryKey: ["study-session-open", sessionId] });
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

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
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
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Sessão não encontrada</h1>
          <p className="text-sm text-muted-foreground">{formatStudyEngineError(error)}</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/app/study">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar ao estudo
          </Link>
        </Button>
      </div>
    );
  }

  const { session, sequence, sessionQuestions, answeredCount } = openData;
  const subtitle = `${session.course_name} · ${session.package_name} · v${session.version_number}`;
  const quantityLabel =
    session.settings.question_count === "all"
      ? "Todas"
      : String(session.settings.question_count);
  const totalQuestions = sessionQuestions.length || sequence.length;
  const hasStarted = sessionQuestions.length > 0;

  if (session.status === "FINISHED" || phase === "completed") {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Sessão concluída com sucesso</h1>
          <p className="text-sm text-muted-foreground">
            Você concluiu esta sessão de estudo.
          </p>
        </div>
        <Card>
          <SessionHeader
            title={session.distribution_name}
            subtitle={subtitle}
            mode={session.mode}
          />
        </Card>
        <Button variant="outline" asChild>
          <Link to="/app/study">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar ao estudo
          </Link>
        </Button>
      </div>
    );
  }

  if (sequence.length === 0) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Sessão sem questões</h1>
          <p className="text-sm text-muted-foreground">
            Não há questões elegíveis para esta distribuição com as configurações atuais.
          </p>
        </div>
        <Card>
          <SessionHeader
            title={session.distribution_name}
            subtitle={subtitle}
            mode={session.mode}
          />
        </Card>
        <Button variant="outline" asChild>
          <Link to="/app/study">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar ao estudo
          </Link>
        </Button>
      </div>
    );
  }

  if (phase === "preview") {
    return (
      <div className="space-y-6 max-w-2xl">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
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
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-2 w-full" />
        <Card>
          <div className="p-6 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (isQuestionError || !question) {
    return (
      <div className="space-y-6 max-w-2xl">
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
    <div className="space-y-6 max-w-2xl">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
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
      </Card>

      <SessionProgress
        current={question.index + 1}
        total={question.total}
        label="Questão"
      />

      <SessionProgress
        current={answeredCount}
        total={question.total}
        label="Respondidas"
      />

      <QuestionCard
        statement={question.statement}
        feedback={question.feedback}
      />

      <QuestionOptions
        alternatives={question.alternatives}
        value={selectedAnswer}
        onChange={setSelectedAnswer}
        disabled={question.isAnswered}
      />

      <QuestionActions
        favorite={question.favorite}
        reviewLater={question.reviewLater}
        isUpdating={toggleFavorite.isPending || toggleReviewLater.isPending}
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
      />

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
      />
    </div>
  );
}
