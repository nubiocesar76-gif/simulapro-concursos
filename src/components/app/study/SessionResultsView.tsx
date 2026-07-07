import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  XCircle,
} from "lucide-react";
import { SessionHeader } from "@/components/app/study/SessionHeader";
import { QuestionCard } from "@/components/app/study/QuestionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDashboardDate, formatStudyDuration } from "@/lib/student-dashboard";
import type { SessionResults, StudySessionDetail } from "@/lib/study-engine";
import {
  createStudySession,
  formatStudySessionError,
  STUDY_MODE_LABELS,
} from "@/lib/study-session";
import { toast } from "sonner";

const RESULTS_PAGE_SIZE = 25;
const pageShellClass = "mx-auto space-y-8 2xl:max-w-[1600px]";

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

  const { summary } = results;
  const subtitle = `${session.course_name} · ${session.package_name} · v${session.version_number}`;

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
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Resultado da sessão</h1>
        <p className="text-sm text-muted-foreground">
          Confira seu desempenho e revise as questões respondidas.
        </p>
      </header>

      <section className="space-y-4" aria-label="Resumo do desempenho">
        <div className="grid grid-cols-2 items-stretch gap-4 lg:grid-cols-[1fr_11rem_11rem]">
          <Card className="col-span-2 flex flex-col justify-center lg:col-span-1">
            <CardContent className="space-y-1 p-6">
              <p className="text-2xl font-semibold tabular-nums tracking-tight">
                {summary.percentage}%
              </p>
              <p className="text-lg font-semibold">Aproveitamento</p>
              <p className="text-sm text-muted-foreground tabular-nums">
                {summary.answeredCount} de {summary.totalQuestions} respondidas
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs text-muted-foreground">Acertos</p>
              <p className="text-2xl font-semibold tabular-nums tracking-tight">
                {summary.correctCount}
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs text-muted-foreground">Erros</p>
              <p className="text-2xl font-semibold tabular-nums tracking-tight">
                {summary.wrongCount}
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground tabular-nums">
          Tempo total de estudo: {formatStudyDuration(summary.totalTimeSeconds)} · Tempo médio/questão:{" "}
          {formatStudyDuration(summary.averageTimeSeconds)}
        </p>
      </section>

      <section className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" aria-label="Próximas ações">
        <Button asChild className="order-1 w-full sm:w-auto">
          <Link to="/app/study">Nova sessão</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="order-2 w-full sm:w-auto"
          onClick={() => retryWrongSession.mutate()}
          disabled={summary.wrongCount === 0 || retryWrongSession.isPending}
        >
          <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
          {retryWrongSession.isPending ? "Criando..." : "Refazer apenas erradas"}
        </Button>
        <Button variant="link" size="sm" className="order-3 h-9 px-0 sm:ml-auto" asChild>
          <Link to="/app">Voltar ao Dashboard</Link>
        </Button>
      </section>

      <Card className="text-sm">
        <SessionHeader
          title={session.distribution_name}
          subtitle={subtitle}
          mode={session.mode}
        />
        <CardContent className="grid gap-3 pb-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Curso</p>
            <p className="truncate font-medium">{session.course_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pacote</p>
            <p className="truncate font-medium">{session.package_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Versão</p>
            <p className="font-medium tabular-nums">v{session.version_number}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Distribuição</p>
            <p className="truncate font-medium">{session.distribution_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Modo</p>
            <p className="font-medium">{STUDY_MODE_LABELS[session.mode]}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data/Hora</p>
            <p className="font-medium tabular-nums">{formatDashboardDate(results.sessionDate)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <CardTitle>Questões respondidas</CardTitle>
            <CardDescription>
              Exibindo {filterLabel(listFilter)} ({filteredItems.length} de {summary.totalQuestions})
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
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
                      <TableHead className="min-w-[12rem]">Enunciado</TableHead>
                      <TableHead className="min-w-[5rem]">Sua resp.</TableHead>
                      <TableHead className="min-w-[5rem]">Gabarito</TableHead>
                      <TableHead className="min-w-[7rem]">Resultado</TableHead>
                      <TableHead className="min-w-[7rem] text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageItems.map((item) => (
                      <Fragment key={item.sessionQuestionId}>
                        <TableRow>
                          <TableCell className="font-medium tabular-nums">{item.order}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="line-clamp-2 text-sm">{item.statementSummary}</p>
                          </TableCell>
                          <TableCell className="tabular-nums">{item.selectedAnswer ?? "—"}</TableCell>
                          <TableCell className="tabular-nums">{item.correctAnswer ?? "—"}</TableCell>
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
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReviewQuestion(item.sessionQuestionId)}
                            >
                              {expandedId === item.sessionQuestionId ? "Ocultar" : "Revisar questão"}
                            </Button>
                          </TableCell>
                        </TableRow>

                        {expandedId === item.sessionQuestionId && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-muted/30 p-0">
                              <Collapsible open onOpenChange={(open) => !open && setExpandedId(null)}>
                                <CollapsibleContent className="space-y-0">
                                  <div className="p-4">
                                    <QuestionCard
                                      statement={item.statement}
                                      feedback={
                                        item.isAnswered && item.correctAnswer
                                          ? {
                                              isCorrect: item.isCorrect === true,
                                              correctAnswer: item.correctAnswer,
                                              explanation: item.explanation,
                                              bibliography: null,
                                              legalReference: null,
                                            }
                                          : null
                                      }
                                    />
                                    {item.explanation && !item.isAnswered && (
                                      <p className="mt-2 text-sm text-muted-foreground">
                                        {item.explanation}
                                      </p>
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
