import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  ListChecks,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import { SessionHeader } from "@/components/app/study/SessionHeader";
import { QuestionCard } from "@/components/app/study/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
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

type ListFilter = "all" | "correct" | "wrong";

type SessionResultsViewProps = {
  session: StudySessionDetail;
  results: SessionResults;
};

type SummaryStat = {
  key: string;
  label: string;
  value: string;
  icon: typeof HelpCircle;
};

function buildSummaryStats(results: SessionResults): SummaryStat[] {
  const { summary } = results;
  return [
    { key: "total", label: "Total de questões", value: String(summary.totalQuestions), icon: ListChecks },
    { key: "answered", label: "Respondidas", value: String(summary.answeredCount), icon: HelpCircle },
    { key: "correct", label: "Acertos", value: String(summary.correctCount), icon: CheckCircle2 },
    { key: "wrong", label: "Erros", value: String(summary.wrongCount), icon: XCircle },
    { key: "percentage", label: "Aproveitamento", value: `${summary.percentage}%`, icon: Target },
    {
      key: "totalTime",
      label: "Tempo total",
      value: formatStudyDuration(summary.totalTimeSeconds),
      icon: Clock,
    },
    {
      key: "avgTime",
      label: "Tempo médio/questão",
      value: formatStudyDuration(summary.averageTimeSeconds),
      icon: Clock,
    },
  ];
}

function filterLabel(filter: ListFilter): string {
  if (filter === "correct") return "questões corretas";
  if (filter === "wrong") return "questões erradas";
  return "todas as questões";
}

export function SessionResultsView({ session, results }: SessionResultsViewProps) {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const [listFilter, setListFilter] = useState<ListFilter>("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const subtitle = `${session.course_name} · ${session.package_name} · v${session.version_number}`;
  const summaryStats = useMemo(() => buildSummaryStats(results), [results]);

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

  function applyListFilter(filter: ListFilter) {
    setListFilter(filter);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleReviewQuestion(sessionQuestionId: string) {
    setExpandedId(sessionQuestionId);
    requestAnimationFrame(() => {
      document.getElementById(`result-question-${sessionQuestionId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Resultado da sessão</h1>
        <p className="text-sm text-muted-foreground">
          Confira seu desempenho e revise as questões respondidas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.key} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-semibold">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <Card>
        <SessionHeader
          title={session.distribution_name}
          subtitle={subtitle}
          mode={session.mode}
        />
        <CardContent className="grid gap-4 sm:grid-cols-2 text-sm pb-6">
          <div>
            <p className="text-muted-foreground">Curso</p>
            <p className="font-medium">{session.course_name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pacote</p>
            <p className="font-medium">{session.package_name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Versão</p>
            <p className="font-medium">v{session.version_number}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Distribuição</p>
            <p className="font-medium">{session.distribution_name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Modo</p>
            <p className="font-medium">{STUDY_MODE_LABELS[session.mode]}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Data/Hora</p>
            <p className="font-medium">{formatDashboardDate(results.sessionDate)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button variant="outline" asChild>
          <Link to="/app">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => applyListFilter("correct")}
          disabled={results.summary.correctCount === 0}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Ver questões corretas
        </Button>
        <Button
          variant="outline"
          onClick={() => applyListFilter("wrong")}
          disabled={results.summary.wrongCount === 0}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Ver questões erradas
        </Button>
        <Button
          variant="outline"
          onClick={() => retryWrongSession.mutate()}
          disabled={results.summary.wrongCount === 0 || retryWrongSession.isPending}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {retryWrongSession.isPending ? "Criando..." : "Refazer apenas erradas"}
        </Button>
        <Button asChild>
          <Link to="/app/study">
            Nova sessão
          </Link>
        </Button>
      </div>

      <Card ref={listRef}>
        <CardHeader>
          <CardTitle>Questões respondidas</CardTitle>
          <CardDescription>
            Exibindo {filterLabel(listFilter)} ({filteredItems.length} de{" "}
            {results.summary.totalQuestions})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {listFilter !== "all" && (
            <Button variant="ghost" size="sm" onClick={() => setListFilter("all")}>
              Mostrar todas
            </Button>
          )}

          {filteredItems.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhuma questão neste filtro.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Enunciado</TableHead>
                      <TableHead className="w-20">Sua resp.</TableHead>
                      <TableHead className="w-20">Gabarito</TableHead>
                      <TableHead className="w-28">Resultado</TableHead>
                      <TableHead className="text-right w-32">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageItems.map((item) => (
                      <TableRow key={item.sessionQuestionId}>
                        <TableCell className="font-medium">{item.order}</TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm line-clamp-2">{item.statementSummary}</p>
                        </TableCell>
                        <TableCell>{item.selectedAnswer ?? "—"}</TableCell>
                        <TableCell>{item.correctAnswer ?? "—"}</TableCell>
                        <TableCell>
                          {!item.isAnswered ? (
                            <Badge variant="outline">Não respondida</Badge>
                          ) : item.isCorrect ? (
                            <Badge className="bg-green-600 hover:bg-green-600">Correta</Badge>
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
                            Revisar questão
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <p className="text-muted-foreground">
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {pageItems.map((item) => (
                  <Collapsible
                    key={item.sessionQuestionId}
                    id={`result-question-${item.sessionQuestionId}`}
                    open={expandedId === item.sessionQuestionId}
                    onOpenChange={(open) =>
                      setExpandedId(open ? item.sessionQuestionId : null)
                    }
                  >
                    <CollapsibleContent>
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
                        <p className="text-sm text-muted-foreground mt-2">{item.explanation}</p>
                      )}
                    </CollapsibleContent>
                    <CollapsibleTrigger asChild>
                      <span className="sr-only">Revisar questão {item.order}</span>
                    </CollapsibleTrigger>
                  </Collapsible>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
