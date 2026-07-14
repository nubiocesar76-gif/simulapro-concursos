import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BookOpen, PlayCircle, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  createStudySession,
  fetchAvailableDistributions,
  formatStudySessionError,
  isFilterStudyMode,
  SESSION_QUANTITY_OPTIONS,
  STUDY_MODE_LABELS,
  STUDY_MODES_SELECTABLE,
  type AvailableDistribution,
  type QuestionOrder,
  type SessionQuantity,
  type ShowAnswersTiming,
  type StudyModeSelectable,
  type StudySessionSettings,
} from "@/lib/study-session";
import {
  ALL_FILTER,
  buildBoardOptions,
  buildSubjectOptions,
  buildTopicOptions,
  buildYearOptions,
  countMatchingQuestions,
  DEFAULT_STUDY_BUILDER_FILTERS,
  fetchStudyBuilderCatalog,
  getFilterLabel,
  resolveSelectedQuantityLabel,
  toSessionFilters,
  type StudyBuilderFilters,
} from "@/lib/study-builder";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { StudyBuilderFiltersPanel } from "@/components/app/study/StudyBuilderFiltersPanel";
import { StudyBuilderSummary } from "@/components/app/study/StudyBuilderSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { toast } from "sonner";
import { STUDENT_PAGE_SHELL, STUDENT_PAGE_SHELL_NARROW } from "@/config/study";

type Step = "list" | "configure" | "created";

export function StudyPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("list");
  const [selected, setSelected] = useState<AvailableDistribution | null>(null);
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);

  const [mode, setMode] = useState<StudyModeSelectable>("STUDY");
  const [quantity, setQuantity] = useState<SessionQuantity>(10);
  const [order, setOrder] = useState<QuestionOrder>("random");
  const [showAnswers, setShowAnswers] = useState<ShowAnswersTiming>("during");
  const [builderFilters, setBuilderFilters] = useState<StudyBuilderFilters>(
    DEFAULT_STUDY_BUILDER_FILTERS,
  );

  const { data: distributions = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["available-distributions", user?.id],
    enabled: !!user,
    queryFn: () => fetchAvailableDistributions(user!.id),
  });

  const {
    data: catalog,
    isLoading: isLoadingCatalog,
    isError: isCatalogError,
    error: catalogError,
  } = useQuery({
    queryKey: ["study-builder-catalog", selected?.distribution_id, mode, user?.id],
    enabled: step === "configure" && !!selected && !!user,
    queryFn: () => fetchStudyBuilderCatalog(selected!.distribution_id, user!.id, mode),
    staleTime: 60_000,
  });

  const boardOptions = useMemo(
    () => (catalog ? buildBoardOptions(catalog.questions, builderFilters) : []),
    [catalog, builderFilters],
  );
  const subjectOptions = useMemo(
    () => (catalog ? buildSubjectOptions(catalog.questions, builderFilters) : []),
    [catalog, builderFilters],
  );
  const topicOptions = useMemo(
    () => (catalog ? buildTopicOptions(catalog.questions, builderFilters) : []),
    [catalog, builderFilters],
  );
  const yearOptions = useMemo(
    () => (catalog ? buildYearOptions(catalog.questions, builderFilters) : []),
    [catalog, builderFilters],
  );

  const matchingCount = useMemo(
    () => (catalog ? countMatchingQuestions(catalog.questions, builderFilters) : 0),
    [catalog, builderFilters],
  );

  const questionCountSetting = useMemo(
    () => (isFilterStudyMode(mode) ? "all" : quantity === "all" ? "all" : quantity),
    [mode, quantity],
  );

  const selectedQuantityLabel = useMemo(
    () => resolveSelectedQuantityLabel(matchingCount, questionCountSetting),
    [matchingCount, questionCountSetting],
  );

  const createSession = useMutation({
    mutationFn: () => {
      if (!selected) throw new Error("Selecione uma distribuição.");
      const settings: StudySessionSettings = {
        question_count: questionCountSetting,
        question_order: isFilterStudyMode(mode) ? "random" : order,
        show_answers: mode === "EXAM" ? "final" : showAnswers,
        filters: toSessionFilters(builderFilters),
      };
      return createStudySession({
        distributionId: selected.distribution_id,
        mode,
        settings,
      });
    },
    onSuccess: (session) => {
      setCreatedSessionId(session.id);
      setStep("created");
      toast.success("Sessão de estudo criada.");
    },
    onError: (e: unknown) => toast.error(formatStudySessionError(e)),
  });

  function openConfigure(dist: AvailableDistribution) {
    setSelected(dist);
    setMode("STUDY");
    setQuantity(10);
    setOrder("random");
    setShowAnswers("during");
    setBuilderFilters(DEFAULT_STUDY_BUILDER_FILTERS);
    setCreatedSessionId(null);
    setStep("configure");
  }

  function resetFlow() {
    setStep("list");
    setSelected(null);
    setCreatedSessionId(null);
  }

  if (isLoading) {
    return (
      <div className={STUDENT_PAGE_SHELL} aria-busy="true" aria-label="Carregando estudo">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-3 h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={STUDENT_PAGE_SHELL}>
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Estudo</h1>
        </header>
        <PageErrorState
          title="Erro ao carregar estudo"
          message={formatStudySessionError(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (step === "created" && selected && createdSessionId) {
    return (
      <div className={STUDENT_PAGE_SHELL_NARROW}>
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Sessão criada</h1>
          <p className="text-sm text-muted-foreground">
            Sua sessão está pronta. Inicie a resolução quando quiser.
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>{selected.distribution_name}</CardTitle>
            <CardDescription>
              {selected.course_name} · {selected.package_name} · v{selected.version_number}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Modo:</span> {STUDY_MODE_LABELS[mode]}</p>
            <p><span className="text-muted-foreground">Questões:</span> {selectedQuantityLabel}</p>
            <Badge>Em andamento</Badge>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <Link to="/app/study/$sessionId" params={{ sessionId: createdSessionId }}>
              <PlayCircle className="h-4 w-4 mr-2" /> Iniciar sessão
            </Link>
          </Button>
          <Button variant="outline" onClick={resetFlow}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
      </div>
    );
  }

  if (step === "configure" && selected) {
    const isExamMode = mode === "EXAM";
    const isFilterMode = isFilterStudyMode(mode);
    const canCreate = matchingCount > 0 && !isLoadingCatalog && !createSession.isPending;

    return (
      <div className={`${STUDENT_PAGE_SHELL} max-w-5xl`}>
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => setStep("list")}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Configurar sessão</h1>
          <p className="text-sm text-muted-foreground">{selected.distribution_name}</p>
        </div>

        {isCatalogError ? (
          <PageErrorState
            title="Erro ao carregar filtros"
            message={formatStudySessionError(catalogError)}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_18rem] xl:grid-cols-[1fr_20rem]">
            <Card>
              <CardContent className="space-y-8 pt-6">
                <ConfigGroup label="Modo">
                  <RadioGroup
                    value={mode}
                    onValueChange={(value) => {
                      setMode(value as StudyModeSelectable);
                      setBuilderFilters(DEFAULT_STUDY_BUILDER_FILTERS);
                    }}
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    {STUDY_MODES_SELECTABLE.map((item) => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value={item} />
                        <span>{STUDY_MODE_LABELS[item]}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </ConfigGroup>

                {isLoadingCatalog ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <StudyBuilderFiltersPanel
                    filters={builderFilters}
                    boardOptions={boardOptions}
                    subjectOptions={subjectOptions}
                    topicOptions={topicOptions}
                    yearOptions={yearOptions}
                    onChange={setBuilderFilters}
                  />
                )}

                {!isFilterMode && (
                  <>
                    <ConfigGroup label="Quantidade de questões">
                      <RadioGroup
                        value={String(quantity)}
                        onValueChange={(value) =>
                          setQuantity(value === "all" ? "all" : (Number(value) as SessionQuantity))
                        }
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                      >
                        {SESSION_QUANTITY_OPTIONS.map((item) => (
                          <label key={String(item)} className="flex items-center gap-2 cursor-pointer">
                            <RadioGroupItem value={String(item)} />
                            <span>{item === "all" ? "Todas" : item}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    </ConfigGroup>

                    <ConfigGroup label="Ordem">
                      <RadioGroup
                        value={order}
                        onValueChange={(value) => setOrder(value as QuestionOrder)}
                        className="grid gap-2"
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="random" />
                          <span>Aleatória</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="sequential" />
                          <span>Sequencial</span>
                        </label>
                      </RadioGroup>
                    </ConfigGroup>
                  </>
                )}

                {isFilterMode && (
                  <p className="text-sm text-muted-foreground">
                    Este modo utiliza apenas as questões filtradas do seu histórico nesta distribuição.
                  </p>
                )}

                {!isExamMode && !isFilterMode && (
                  <ConfigGroup label="Mostrar respostas">
                    <RadioGroup
                      value={showAnswers}
                      onValueChange={(value) => setShowAnswers(value as ShowAnswersTiming)}
                      className="grid gap-2"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="during" />
                        <span>Durante</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="final" />
                        <span>Apenas no final</span>
                      </label>
                    </RadioGroup>
                  </ConfigGroup>
                )}

                {isExamMode && (
                  <ConfigGroup label="Mostrar respostas">
                    <RadioGroup value="final" className="grid gap-2" disabled>
                      <label className="flex items-center gap-2 opacity-50">
                        <RadioGroupItem value="during" disabled />
                        <span>Durante</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="final" />
                        <span>Apenas no final</span>
                      </label>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground mt-1">
                      No modo Prova, respostas só são exibidas ao final.
                    </p>
                  </ConfigGroup>
                )}

                {matchingCount === 0 && !isLoadingCatalog && (
                  <p className="text-sm text-destructive">
                    Nenhuma questão encontrada para os filtros escolhidos.
                  </p>
                )}

                <Button
                  className="w-full lg:hidden"
                  onClick={() => createSession.mutate()}
                  disabled={!canCreate}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {createSession.isPending ? "Criando sessão..." : "Criar sessão"}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <StudyBuilderSummary
                packageName={selected.package_name}
                mode={mode}
                boardLabel={getFilterLabel(builderFilters.boardId, boardOptions, "Todas")}
                subjectLabel={getFilterLabel(builderFilters.subjectId, subjectOptions, "Todas")}
                topicLabel={getFilterLabel(builderFilters.topicId, topicOptions, "Todos")}
                yearLabel={builderFilters.year === ALL_FILTER ? "Todos" : builderFilters.year}
                matchingCount={matchingCount}
                selectedQuantityLabel={selectedQuantityLabel}
              />

              <Button
                className="hidden w-full lg:inline-flex"
                onClick={() => createSession.mutate()}
                disabled={!canCreate}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                {createSession.isPending ? "Criando sessão..." : "Criar sessão"}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={STUDENT_PAGE_SHELL}>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Estudo</h1>
        <p className="text-sm text-muted-foreground">
          Selecione uma distribuição liberada pela sua assinatura para configurar uma sessão.
        </p>
      </header>

      {distributions.length === 0 ? (
        <EmptyState
          title="Nenhuma distribuição disponível"
          description="Verifique se você possui assinatura ativa vinculada a uma distribuição."
          icon={BookOpen}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {distributions.map((dist) => (
            <Card key={dist.distribution_id} className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{dist.distribution_name}</CardTitle>
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                </div>
                <CardDescription>
                  {dist.course_name} · {dist.package_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  Versão {dist.version_number} — {dist.version_name}
                </div>
                <Button className="w-full" onClick={() => openConfigure(dist)}>
                  Configurar sessão
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfigGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}
