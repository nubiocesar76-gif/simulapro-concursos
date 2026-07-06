import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  History,
  MoreHorizontal,
  PlayCircle,
  RotateCcw,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatDashboardDate, formatStudyDuration } from "@/lib/student-dashboard";
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

function HistoryTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell colSpan={11}>
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Histórico de sessões</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Consulte todas as suas sessões de estudo com filtros e paginação.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/app">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
          <CardDescription>Refine por distribuição, curso, período, modo ou status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Pesquisar distribuição, curso ou pacote..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Limpar filtros
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessões</CardTitle>
          <CardDescription>{pageLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          {isError ? (
            <PageErrorState
              title="Erro ao carregar histórico"
              message={error instanceof Error ? error.message : "Erro desconhecido."}
              onRetry={() => refetch()}
            />
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Distribuição</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Pacote</TableHead>
                    <TableHead>Modo</TableHead>
                    <TableHead>Questões</TableHead>
                    <TableHead>Acertos</TableHead>
                    <TableHead>Aproveitamento</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <HistoryTableSkeleton />
                  ) : !data?.rows.length ? (
                    <TableRow>
                      <TableCell colSpan={11} className="py-10">
                        <EmptyState
                          title={hasActiveFilters ? "Nenhuma sessão encontrada" : "Nenhuma sessão registrada"}
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
                        <TableCell className="whitespace-nowrap">
                          {formatDashboardDate(row.date)}
                        </TableCell>
                        <TableCell>{row.distributionName}</TableCell>
                        <TableCell>{row.courseName}</TableCell>
                        <TableCell>{row.packageName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{STUDY_MODE_LABELS[row.mode]}</Badge>
                        </TableCell>
                        <TableCell>{row.totalQuestions || "—"}</TableCell>
                        <TableCell>
                          {row.totalAnswered > 0
                            ? `${row.correctCount}/${row.totalAnswered}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {row.totalAnswered > 0 ? `${row.accuracyPercent}%` : "—"}
                        </TableCell>
                        <TableCell>{formatStudyDuration(row.durationSeconds)}</TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(row.status)}>
                            {SESSION_STATUS_LABELS[row.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <RowActions
                            row={row}
                            isCreating={createSession.isPending}
                            onRetryWrong={() =>
                              createSession.mutate({
                                distributionId: row.distributionId,
                                mode: "WRONG_ONLY",
                              })
                            }
                            onNewSession={() =>
                              createSession.mutate({
                                distributionId: row.distributionId,
                                mode: "STUDY",
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && !isLoading && !isError && (
            <div className="flex items-center justify-between gap-2 mt-4 text-sm">
              <p className="text-muted-foreground">{pageLabel}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                  disabled={page <= 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Próxima
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
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
  onNewSession: () => void;
};

function RowActions({ row, isCreating, onRetryWrong, onNewSession }: RowActionsProps) {
  const resultLabel = row.status === "IN_PROGRESS" ? "Continuar sessão" : "Ver resultado";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isCreating}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações da sessão</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/app/study/$sessionId" params={{ sessionId: row.id }}>
            {resultLabel}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={row.wrongCount === 0 || isCreating}
          onClick={onRetryWrong}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Refazer apenas erradas
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isCreating} onClick={onNewSession}>
          <PlayCircle className="h-4 w-4 mr-2" />
          Nova sessão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
