import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, X, XCircle } from "lucide-react";
import { QuestionCard } from "@/components/app/study/QuestionCard";
import { QuestionFeedbackPanel } from "@/components/app/study/QuestionFeedbackPanel";
import { SessionResultsActions } from "@/components/app/study/SessionResultsActions";
import { SessionResultsPerformanceTable } from "@/components/app/study/SessionResultsPerformanceTable";
import { SessionResultsRecommendations } from "@/components/app/study/SessionResultsRecommendations";
import { SessionResultsSummaryCards } from "@/components/app/study/SessionResultsSummaryCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDashboardDate, formatStudyDuration } from "@/lib/student-dashboard";
import { buildSessionResultsAnalytics } from "@/lib/session-results-analytics";
import type { SessionResults, StudySessionDetail } from "@/lib/study-engine";
import {
  createStudySession,
  formatStudySessionError,
  STUDY_MODE_LABELS,
} from "@/lib/study-session";
import { toast } from "sonner";
import { STUDENT_PAGE_SHELL } from "@/config/study";

const RESULTS_PAGE_SIZE = 25;
const pageShellClass = STUDENT_PAGE_SHELL;

type ListFilter = "all" | "correct" | "wrong";

type SessionResultsViewProps = {
  session: StudySessionDetail;
  results: SessionResults;
};

function filterLabel(filter: ListFilter): string {
  if (filter === "correct") return "questões corretas";
  if (filter === "wrong") return "questões erradas";
  return "todas as questões";
}

export function SessionResultsView({ session, results }: SessionResultsViewProps) {
  const navigate = useNavigate();
  const [listFilter, setListFilter] = useState<ListFilter>("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const analytics = useMemo(() => buildSessionResultsAnalytics(results), [results]);
  const { summary } = analytics;

  const filteredItems = useMemo(() => {
    if (listFilter === "correct") {
      return results.items.filter((item) => item.isCorrect === true);
    }
    if (listFilter === "wrong") {
      return results.items.filter((item) => item.isCorrect === false);
    }
    return results.items;
  }, [listFilter, results.items]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / RESULTS_PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * RESULTS_PAGE_SIZE;
    return filteredItems.slice(start, start + RESULTS_PAGE_SIZE);
  }, [filteredItems, page]);

  useEffect(() => {
    setPage(1);
    setExpandedId(null);
  }, [listFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const retryWrongSession = useMutation({
    mutationFn: () =>
      createStudySession({
        distributionId: session.distribution_id,
        mode: "WRONG_ONLY",
        settings: {
          question_count: "all",
          question_order: "random",
          show_answers: "during",
        },
      }),
    onSuccess: (created) => {
      navigate({ to: "/app/study/$sessionId", params: { sessionId: created.id } });
    },
    onError: (error: unknown) => toast.error(formatStudySessionError(error)),
  });

  function handleReviewQuestion(sessionQuestionId: string) {
    setExpandedId((current) => (current === sessionQuestionId ? null : sessionQuestionId));
  }

  return (
    <div className={pageShellClass}>
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Resultado da sessão</h1>
        <p className="text-sm text-muted-foreground">
          Diagnóstico completo — entenda onde foi bem, onde errou e o que revisar em seguida.
        </p>
        <p className="text-xs text-muted-foreground">
          {session.distribution_name} · {STUDY_MODE_LABELS[session.mode]} ·{" "}
          {formatDashboardDate(results.sessionDate)}
        </p>
      </header>

      <SessionResultsSummaryCards summary={summary} />

      <div className="grid gap-6 xl:grid-cols-2">
        <SessionResultsPerformanceTable
          title="Desempenho por disciplina"
          description="Ordenado do menor para o maior aproveitamento."
          groups={analytics.subjects}
          nameColumnLabel="Disciplina"
          emptyMessage="Nenhuma disciplina identificada nas questões respondidas."
        />
        <SessionResultsPerformanceTable
          title="Desempenho por assunto"
          description="Somente assuntos com questões respondidas nesta sessão."
          groups={analytics.topics}
          nameColumnLabel="Assunto"
          emptyMessage="Nenhum assunto identificado nas questões respondidas."
        />
      </div>

      <SessionResultsPerformanceTable
        title="Desempenho por banca"
        description="Comparativo de acertos por banca examinadora."
        groups={analytics.boards}
        nameColumnLabel="Banca"
        emptyMessage="Nenhuma banca identificada nas questões respondidas."
        formatValue={(group) => `${group.correct}/${group.total}`}
      />

      <SessionResultsRecommendations recommendations={analytics.recommendations} />

      <SessionResultsActions
        wrongCount={summary.wrongCount}
        isCreatingReview={retryWrongSession.isPending}
        onReviewErrors={() => retryWrongSession.mutate()}
      />

      <Card className="border-border/60 shadow-none">
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <CardTitle>Questões da sessão</CardTitle>
            <CardDescription>
              Exibindo {filterLabel(listFilter)} ({filteredItems.length} de {summary.totalQuestions})
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar questões">
            <Button
              type="button"
              size="sm"
              variant={listFilter === "all" ? "default" : "outline"}
              onClick={() => setListFilter("all")}
            >
              Todas
            </Button>
            <Button
              type="button"
              size="sm"
              variant={listFilter === "correct" ? "default" : "outline"}
              onClick={() => setListFilter("correct")}
              disabled={summary.correctCount === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Corretas
            </Button>
            <Button
              type="button"
              size="sm"
              variant={listFilter === "wrong" ? "default" : "outline"}
              onClick={() => setListFilter("wrong")}
              disabled={summary.wrongCount === 0}
            >
              <XCircle className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Erradas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredItems.length === 0 ? (
            <EmptyState
              title="Nenhuma questão neste filtro"
              description="Tente outro filtro ou volte para ver todas as questões respondidas."
              action={
                listFilter !== "all" ? (
                  <Button variant="outline" size="sm" onClick={() => setListFilter("all")}>
                    Mostrar todas
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[3rem]">#</TableHead>
                      <TableHead className="min-w-[10rem]">Questão</TableHead>
                      <TableHead className="min-w-[8rem]">Disciplina</TableHead>
                      <TableHead className="min-w-[8rem]">Assunto</TableHead>
                      <TableHead className="min-w-[6rem]">Status</TableHead>
                      <TableHead className="min-w-[5rem]">Tempo</TableHead>
                      <TableHead className="min-w-[6rem] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageItems.map((item) => (
                      <Fragment key={item.sessionQuestionId}>
                        <TableRow>
                          <TableCell className="font-medium tabular-nums">{item.order}</TableCell>
                          <TableCell className="max-w-xs">
                            <p className="line-clamp-2 text-sm">{item.statementSummary}</p>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.subjectName ?? "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.topicName ?? "—"}
                          </TableCell>
                          <TableCell>
                            {!item.isAnswered ? (
                              <Badge variant="outline">Não respondida</Badge>
                            ) : item.isCorrect ? (
                              <Badge className="border-success/50 bg-success/5 font-medium text-success hover:bg-success/5">
                                Correta
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Incorreta</Badge>
                            )}
                          </TableCell>
                          <TableCell className="tabular-nums text-sm text-muted-foreground">
                            {item.responseTimeSeconds != null
                              ? formatStudyDuration(item.responseTimeSeconds)
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReviewQuestion(item.sessionQuestionId)}
                            >
                              {expandedId === item.sessionQuestionId ? "Fechar" : "Abrir questão"}
                            </Button>
                          </TableCell>
                        </TableRow>

                        {expandedId === item.sessionQuestionId && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-muted/30 p-0">
                              <Collapsible open onOpenChange={(open) => !open && setExpandedId(null)}>
                                <CollapsibleContent className="space-y-0">
                                  <div className="space-y-4 p-4">
                                    <QuestionCard statement={item.statement} />
                                    {item.isAnswered && item.correctAnswer && (
                                      <QuestionFeedbackPanel
                                        feedback={{
                                          isCorrect: item.isCorrect === true,
                                          correctAnswer: item.correctAnswer,
                                          explanation: item.explanation,
                                          bibliography: null,
                                          legalReference: null,
                                        }}
                                      />
                                    )}
                                  </div>
                                  <div className="flex justify-end border-t border-border px-4 py-2">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setExpandedId(null)}
                                    >
                                      <X className="h-4 w-4 mr-1.5" aria-hidden="true" />
                                      Fechar
                                    </Button>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <p className="text-muted-foreground tabular-nums">
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      disabled={page >= totalPages}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
