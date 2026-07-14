import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  History,
  MoreHorizontal,
  PlayCircle,
  RotateCcw,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { fetchHistorySummaryStats, formatDashboardDate, formatStudyDuration } from "@/lib/student-dashboard";
import { HistorySummaryStats } from "@/components/app/history/HistorySummaryStats";
import {
  fetchHistoryFilterOptions,
  fetchStudyHistory,
  HISTORY_MODE_OPTIONS,
  HISTORY_PAGE_SIZE,
  HISTORY_PERIOD_OPTIONS,
  HISTORY_STATUS_OPTIONS,
  SESSION_STATUS_LABELS,
  type StudyHistoryFilters,
  type StudyHistoryRow,
} from "@/lib/study-history";
import {
  createStudySession,
  formatStudySessionError,
  STUDY_MODE_LABELS,
} from "@/lib/study-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { STUDENT_PAGE_SHELL } from "@/config/study";

const pageShellClass = STUDENT_PAGE_SHELL;

const DEFAULT_STUDY_SETTINGS = {
  question_count: 10 as const,
  question_order: "random" as const,
  show_answers: "during" as const,
};

function statusBadgeVariant(status: StudyHistoryRow["status"]) {
  if (status === "FINISHED") return "default" as const;
  if (status === "IN_PROGRESS") return "secondary" as const;
  return "outline" as const;
}

function formatResultCell(row: StudyHistoryRow): string {
  if (row.totalAnswered <= 0) return "—";
  return `${row.correctCount}/${row.totalAnswered} (${row.accuracyPercent}%)`;
}

function HistoryTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell colSpan={10}>
            <Skeleton className="h-5 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function StudyHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [distributionId, setDistributionId] = useState("all");
  const [courseName, setCourseName] = useState("all");
  const [mode, setMode] = useState<StudyHistoryFilters["mode"]>("all");
  const [status, setStatus] = useState<StudyHistoryFilters["status"]>("all");
  const [periodDays, setPeriodDays] = useState<StudyHistoryFilters["periodDays"]>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filters = useMemo<StudyHistoryFilters>(
    () => ({
      page,
      pageSize: HISTORY_PAGE_SIZE,
      distributionId: distributionId === "all" ? undefined : distributionId,
      courseName: courseName === "all" ? undefined : courseName,
      mode,
      status,
      periodDays,
      search: debouncedSearch || undefined,
    }),
    [page, distributionId, courseName, mode, status, periodDays, debouncedSearch],
  );

  const { data: filterOptions } = useQuery({
    queryKey: ["study-history-filters", user?.id],
    enabled: !!user,
    queryFn: () => fetchHistoryFilterOptions(user!.id),
  });

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["student-session-stats", user?.id],
    enabled: !!user,
    queryFn: () => fetchHistorySummaryStats(user!.id),
    staleTime: 60_000,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["study-history", user?.id, filters],
    enabled: !!user,
    queryFn: () => fetchStudyHistory(user!.id, filters),
    retry: false,
  });

  const createSession = useMutation({
    mutationFn: (input: {
      distributionId: string;
      mode: "STUDY" | "WRONG_ONLY";
    }) =>
      createStudySession({
        distributionId: input.distributionId,
        mode: input.mode,
        settings:
          input.mode === "WRONG_ONLY"
            ? { question_count: "all", question_order: "random", show_answers: "during" }
            : DEFAULT_STUDY_SETTINGS,
      }),
    onSuccess: (session) => {
      navigate({ to: "/app/study/$sessionId", params: { sessionId: session.id } });
    },
    onError: (err: unknown) => toast.error(formatStudySessionError(err)),
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / HISTORY_PAGE_SIZE));
  const pageLabel =
    total === 0
      ? "Nenhum registro"
      : `${page * HISTORY_PAGE_SIZE + 1}–${Math.min((page + 1) * HISTORY_PAGE_SIZE, total)} de ${total}`;

  function resetFilters() {
    setSearch("");
    setDebouncedSearch("");
    setDistributionId("all");
    setCourseName("all");
    setMode("all");
    setStatus("all");
    setPeriodDays("all");
    setPage(0);
  }

  const hasActiveFilters =
    debouncedSearch ||
    distributionId !== "all" ||
    courseName !== "all" ||
    mode !== "all" ||
    status !== "all" ||
    periodDays !== "all";

  return (
    <div className={pageShellClass}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold tracking-tight">Histórico de sessões</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulte todas as suas sessões de estudo com filtros e paginação.
          </p>
        </div>
        <Button variant="outline" asChild className="shrink-0">
          <Link to="/app">
            <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </header>

      {isSummaryLoading ? (
        <Skeleton className="h-11 w-full rounded-lg" />
      ) : summary ? (
        <HistorySummaryStats stats={summary} />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Filtros e sessões</CardTitle>
          <CardDescription>Refine a lista e encontre a sessão desejada.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                className="pl-9"
                placeholder="Pesquisar distribuição, curso ou pacote..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Pesquisar sessões"
              />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="shrink-0" onClick={resetFilters}>
                Limpar filtros
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              label="Curso"
              value={courseName}
              onValueChange={(value) => {
                setCourseName(value);
                setPage(0);
              }}
              options={[
                { value: "all", label: "Todos" },
                ...(filterOptions?.courses.map((name) => ({ value: name, label: name })) ?? []),
              ]}
            />
            <FilterSelect
              label="Distribuição"
              value={distributionId}
              onValueChange={(value) => {
                setDistributionId(value);
                setPage(0);
              }}
              options={[
                { value: "all", label: "Todas" },
                ...(filterOptions?.distributions.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) ?? []),
              ]}
            />
            <FilterSelect
              label="Modo"
              value={mode ?? "all"}
              onValueChange={(value) => {
                setMode(value as StudyHistoryFilters["mode"]);
                setPage(0);
              }}
              options={HISTORY_MODE_OPTIONS.map((item) => ({
                value: item,
                label: item === "all" ? "Todos" : STUDY_MODE_LABELS[item],
              }))}
            />
            <FilterSelect
              label="Período"
              value={String(periodDays)}
              onValueChange={(value) => {
                setPeriodDays(value === "all" ? "all" : Number(value));
                setPage(0);
              }}
              options={HISTORY_PERIOD_OPTIONS.map((item) => ({
                value: String(item.value),
                label: item.label,
              }))}
            />
            <FilterSelect
              label="Status"
              value={status ?? "all"}
              onValueChange={(value) => {
                setStatus(value as StudyHistoryFilters["status"]);
                setPage(0);
              }}
              options={HISTORY_STATUS_OPTIONS.map((item) => ({
                value: item,
                label: item === "all" ? "Todos" : SESSION_STATUS_LABELS[item],
              }))}
            />
          </div>

          {isError ? (
            <PageErrorState
              title="Erro ao carregar histórico"
              message={error instanceof Error ? error.message : "Erro desconhecido."}
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <div
                className="overflow-x-auto rounded-lg border"
                aria-busy={isLoading}
                aria-label={isLoading ? "Carregando histórico de sessões" : undefined}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 z-10 min-w-[7rem] bg-card">
                        Data
                      </TableHead>
                      <TableHead className="min-w-[10rem]">Distribuição</TableHead>
                      <TableHead className="min-w-[7rem]">Resultado</TableHead>
                      <TableHead className="min-w-[6rem]">Status</TableHead>
                      <TableHead className="sticky right-0 z-10 min-w-[4.5rem] bg-card text-right">
                        Ação
                      </TableHead>
                      <TableHead className="min-w-[8rem]">Curso</TableHead>
                      <TableHead className="min-w-[8rem]">Pacote</TableHead>
                      <TableHead className="min-w-[6rem]">Modo</TableHead>
                      <TableHead className="min-w-[5rem]">Questões</TableHead>
                      <TableHead className="min-w-[5rem]">Tempo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <HistoryTableSkeleton />
                    ) : !data?.rows.length ? (
                      <TableRow>
                        <TableCell colSpan={10} className="py-10">
                          <EmptyState
                            title={
                              hasActiveFilters
                                ? "Nenhuma sessão encontrada"
                                : "Nenhuma sessão registrada"
                            }
                            description={
                              hasActiveFilters
                                ? "Tente ajustar os filtros ou a pesquisa."
                                : "Suas sessões aparecerão aqui após você começar a estudar."
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="sticky left-0 z-10 bg-card whitespace-nowrap tabular-nums">
                            {formatDashboardDate(row.date)}
                          </TableCell>
                          <TableCell className="max-w-[14rem] truncate font-medium">
                            {row.distributionName}
                          </TableCell>
                          <TableCell className="whitespace-nowrap tabular-nums">
                            {formatResultCell(row)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusBadgeVariant(row.status)}>
                              {SESSION_STATUS_LABELS[row.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="sticky right-0 z-10 bg-card text-right">
                            <RowActions
                              row={row}
                              isCreating={createSession.isPending}
                              onRetryWrong={() =>
                                createSession.mutate({
                                  distributionId: row.distributionId,
                                  mode: "WRONG_ONLY",
                                })
                              }
                              onQuickStudy={() =>
                                createSession.mutate({
                                  distributionId: row.distributionId,
                                  mode: "STUDY",
                                })
                              }
                            />
                          </TableCell>
                          <TableCell className="max-w-[10rem] truncate">{row.courseName}</TableCell>
                          <TableCell className="max-w-[10rem] truncate">{row.packageName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{STUDY_MODE_LABELS[row.mode]}</Badge>
                          </TableCell>
                          <TableCell className="tabular-nums">
                            {row.totalQuestions || "—"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap tabular-nums">
                            {formatStudyDuration(row.durationSeconds)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground tabular-nums">{pageLabel}</p>
                {totalPages > 1 && !isLoading && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.max(0, current - 1))}
                      disabled={page <= 0}
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
};

function FilterSelect({ label, value, onValueChange, options }: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type RowActionsProps = {
  row: StudyHistoryRow;
  isCreating: boolean;
  onRetryWrong: () => void;
  onQuickStudy: () => void;
};

function RowActions({ row, isCreating, onRetryWrong, onQuickStudy }: RowActionsProps) {
  const resultLabel = row.status === "IN_PROGRESS" ? "Continuar sessão" : "Ver resultado";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isCreating}>
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Ações da sessão</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/app/study/$sessionId" params={{ sessionId: row.id }}>
            {resultLabel}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={row.wrongCount === 0 || isCreating} onClick={onRetryWrong}>
          <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
          Refazer apenas erradas
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isCreating} onClick={onQuickStudy}>
          <PlayCircle className="h-4 w-4 mr-2" aria-hidden="true" />
          Estudar novamente
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
