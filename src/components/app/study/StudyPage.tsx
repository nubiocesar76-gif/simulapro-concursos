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
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Page,
  Skeleton,
} from "@/components/design-system";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StudyBuilderFiltersPanel } from "@/components/app/study/StudyBuilderFiltersPanel";
import { StudyBuilderSummary } from "@/components/app/study/StudyBuilderSummary";
import { ActivatePlanCard } from "@/components/shared/ActivatePlanCard";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { toast } from "sonner";
import { STUDENT_PAGE_SHELL, STUDENT_PAGE_SHELL_NARROW } from "@/config/study";

type Step = "list" | "configure" | "created";

/**
 * `grid grid-cols-[minmax(0,1fr)]`: mesmo truque do DS-005 (ver
 * StudentDashboardPage) para impedir que a largura mínima de grids/painéis
 * internos force rolagem horizontal da página inteira através do AppShell.
 */
const pageShellClass = `${STUDENT_PAGE_SHELL} grid grid-cols-[minmax(0,1fr)]`;
const narrowShellClass = `${STUDENT_PAGE_SHELL_NARROW} grid grid-cols-[minmax(0,1fr)]`;

const iconSizeStyle = { width: dsFontSize.base, height: dsFontSize.base };

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

  const {
    data: distributions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
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
      <div className={pageShellClass} aria-busy="true" aria-label="Carregando estudo">
        <div className="flex flex-col gap-[var(--ds-space-2)]">
          <Skeleton width="30%" height="var(--ds-space-8)" />
          <Skeleton width="45%" height="var(--ds-space-4)" />
        </div>
        <div className="grid gap-[var(--ds-space-4)] sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton width="65%" height="var(--ds-space-5)" />
                <Skeleton width="50%" height="var(--ds-space-4)" />
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-[var(--ds-space-3)]">
                <Skeleton width="100%" height="var(--ds-space-4)" />
                <Skeleton width="100%" height="var(--ds-space-10)" radius="lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={pageShellClass}>
        <Page title="Estudo" />
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
      <div className={narrowShellClass}>
        <Page
          title="Sessão criada"
          description="Sua sessão está pronta. Inicie a resolução quando quiser."
        />
        <Card>
          <CardHeader>
            <span
              className="text-[color:var(--ds-color-text-primary)]"
              style={{ fontSize: dsFontSize.lg, fontWeight: dsFontWeight.semibold }}
            >
              {selected.distribution_name}
            </span>
            <span
              className="text-[color:var(--ds-color-text-secondary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {selected.course_name} · {selected.package_name} · v{selected.version_number}
            </span>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col gap-[var(--ds-space-2)]">
            <p style={{ fontSize: dsFontSize.sm }}>
              <span className="text-[color:var(--ds-color-text-secondary)]">Modo:</span>{" "}
              {STUDY_MODE_LABELS[mode]}
            </p>
            <p style={{ fontSize: dsFontSize.sm }}>
              <span className="text-[color:var(--ds-color-text-secondary)]">Questões:</span>{" "}
              {selectedQuantityLabel}
            </p>
            <div>
              <Badge>Em andamento</Badge>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-[var(--ds-space-2)] sm:flex-row">
          <Button asChild className="flex-1">
            <Link to="/app/study/$sessionId" params={{ sessionId: createdSessionId }}>
              <PlayCircle aria-hidden="true" style={iconSizeStyle} />
              Iniciar sessão
            </Link>
          </Button>
          <Button
            variant="outline"
            leftIcon={<ChevronLeft style={iconSizeStyle} />}
            onClick={resetFlow}
          >
            Voltar
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
      <div className={`${pageShellClass} max-w-5xl`}>
        <div className="flex flex-col gap-[var(--ds-space-1)]">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-1 self-start"
            leftIcon={<ChevronLeft style={iconSizeStyle} />}
            onClick={() => setStep("list")}
          >
            Voltar
          </Button>
          <h1
            className="text-[color:var(--ds-color-text-primary)]"
            style={{ fontSize: dsFontSize["2xl"], fontWeight: dsFontWeight.bold }}
          >
            Configurar sessão
          </h1>
          <p
            className="text-[color:var(--ds-color-text-secondary)]"
            style={{ fontSize: dsFontSize.sm }}
          >
            {selected.distribution_name}
          </p>
        </div>

        {isCatalogError ? (
          <PageErrorState
            title="Erro ao carregar filtros"
            message={formatStudySessionError(catalogError)}
          />
        ) : (
          <div className="grid gap-[var(--ds-space-6)] lg:grid-cols-[1fr_18rem] xl:grid-cols-[1fr_20rem]">
            <Card>
              <CardContent className="pt-[var(--ds-space-6)] flex flex-col gap-[var(--ds-space-8)]">
                <ConfigGroup label="Modo">
                  <RadioGroup
                    value={mode}
                    onValueChange={(value) => {
                      setMode(value as StudyModeSelectable);
                      setBuilderFilters(DEFAULT_STUDY_BUILDER_FILTERS);
                    }}
                    className="grid gap-[var(--ds-space-2)] sm:grid-cols-2"
                  >
                    {STUDY_MODES_SELECTABLE.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-[var(--ds-space-2)] cursor-pointer"
                      >
                        <RadioGroupItem value={item} />
                        <span style={{ fontSize: dsFontSize.sm }}>{STUDY_MODE_LABELS[item]}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </ConfigGroup>

                {isLoadingCatalog ? (
                  <div className="flex flex-col gap-[var(--ds-space-4)]">
                    <Skeleton width="35%" height="var(--ds-space-4)" />
                    <Skeleton width="100%" height="var(--ds-space-10)" radius="lg" />
                    <Skeleton width="100%" height="var(--ds-space-10)" radius="lg" />
                    <Skeleton width="100%" height="var(--ds-space-10)" radius="lg" />
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
                        className="grid grid-cols-2 gap-[var(--ds-space-2)] sm:grid-cols-3"
                      >
                        {SESSION_QUANTITY_OPTIONS.map((item) => (
                          <label
                            key={String(item)}
                            className="flex items-center gap-[var(--ds-space-2)] cursor-pointer"
                          >
                            <RadioGroupItem value={String(item)} />
                            <span style={{ fontSize: dsFontSize.sm }}>
                              {item === "all" ? "Todas" : item}
                            </span>
                          </label>
                        ))}
                      </RadioGroup>
                    </ConfigGroup>

                    <ConfigGroup label="Ordem">
                      <RadioGroup
                        value={order}
                        onValueChange={(value) => setOrder(value as QuestionOrder)}
                        className="grid gap-[var(--ds-space-2)]"
                      >
                        <label className="flex items-center gap-[var(--ds-space-2)] cursor-pointer">
                          <RadioGroupItem value="random" />
                          <span style={{ fontSize: dsFontSize.sm }}>Aleatória</span>
                        </label>
                        <label className="flex items-center gap-[var(--ds-space-2)] cursor-pointer">
                          <RadioGroupItem value="sequential" />
                          <span style={{ fontSize: dsFontSize.sm }}>Sequencial</span>
                        </label>
                      </RadioGroup>
                    </ConfigGroup>
                  </>
                )}

                {isFilterMode && (
                  <p
                    className="text-[color:var(--ds-color-text-secondary)]"
                    style={{ fontSize: dsFontSize.sm }}
                  >
                    Este modo utiliza apenas as questões filtradas do seu histórico nesta
                    distribuição.
                  </p>
                )}

                {!isExamMode && !isFilterMode && (
                  <ConfigGroup label="Mostrar respostas">
                    <RadioGroup
                      value={showAnswers}
                      onValueChange={(value) => setShowAnswers(value as ShowAnswersTiming)}
                      className="grid gap-[var(--ds-space-2)]"
                    >
                      <label className="flex items-center gap-[var(--ds-space-2)] cursor-pointer">
                        <RadioGroupItem value="during" />
                        <span style={{ fontSize: dsFontSize.sm }}>Durante</span>
                      </label>
                      <label className="flex items-center gap-[var(--ds-space-2)] cursor-pointer">
                        <RadioGroupItem value="final" />
                        <span style={{ fontSize: dsFontSize.sm }}>Apenas no final</span>
                      </label>
                    </RadioGroup>
                  </ConfigGroup>
                )}

                {isExamMode && (
                  <ConfigGroup label="Mostrar respostas">
                    <RadioGroup value="final" className="grid gap-[var(--ds-space-2)]" disabled>
                      <label className="flex items-center gap-[var(--ds-space-2)] opacity-50">
                        <RadioGroupItem value="during" disabled />
                        <span style={{ fontSize: dsFontSize.sm }}>Durante</span>
                      </label>
                      <label className="flex items-center gap-[var(--ds-space-2)] cursor-pointer">
                        <RadioGroupItem value="final" />
                        <span style={{ fontSize: dsFontSize.sm }}>Apenas no final</span>
                      </label>
                    </RadioGroup>
                    <p
                      className="mt-1 text-[color:var(--ds-color-text-secondary)]"
                      style={{ fontSize: dsFontSize.xs }}
                    >
                      No modo Prova, respostas só são exibidas ao final.
                    </p>
                  </ConfigGroup>
                )}

                {matchingCount === 0 && !isLoadingCatalog && (
                  <p
                    className="text-[color:var(--ds-color-error)]"
                    style={{ fontSize: dsFontSize.sm }}
                  >
                    Nenhuma questão encontrada para os filtros escolhidos.
                  </p>
                )}

                <Button
                  fullWidth
                  className="lg:hidden"
                  leftIcon={<PlayCircle style={iconSizeStyle} />}
                  onClick={() => createSession.mutate()}
                  disabled={!canCreate}
                >
                  {createSession.isPending ? "Criando sessão..." : "Criar sessão"}
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-[var(--ds-space-4)]">
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
                fullWidth
                className="hidden lg:inline-flex"
                leftIcon={<PlayCircle style={iconSizeStyle} />}
                onClick={() => createSession.mutate()}
                disabled={!canCreate}
              >
                {createSession.isPending ? "Criando sessão..." : "Criar sessão"}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={pageShellClass}>
      <Page
        title="Estudo"
        description="Escolha um dos conteúdos liberados para configurar uma sessão de estudo."
      />

      {distributions.length === 0 ? (
        <ActivatePlanCard />
      ) : (
        <div className="grid gap-[var(--ds-space-4)] sm:grid-cols-2">
          {distributions.map((dist) => (
            <Card key={dist.distribution_id} hover>
              <CardHeader>
                <div className="flex items-start justify-between gap-[var(--ds-space-2)]">
                  <span
                    className="text-[color:var(--ds-color-text-primary)]"
                    style={{ fontSize: dsFontSize.lg, fontWeight: dsFontWeight.semibold }}
                  >
                    {dist.distribution_name}
                  </span>
                  <BookOpen
                    aria-hidden="true"
                    className="shrink-0"
                    style={{
                      width: dsFontSize.lg,
                      height: dsFontSize.lg,
                      color: "var(--ds-color-action)",
                    }}
                  />
                </div>
                <span
                  className="text-[color:var(--ds-color-text-secondary)]"
                  style={{ fontSize: dsFontSize.sm }}
                >
                  {dist.course_name} · {dist.package_name}
                </span>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-[var(--ds-space-3)]">
                <div
                  className="text-[color:var(--ds-color-text-secondary)]"
                  style={{ fontSize: dsFontSize.xs }}
                >
                  Versão {dist.version_number} — {dist.version_name}
                </div>
                <Button fullWidth onClick={() => openConfigure(dist)}>
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
    <div className="flex flex-col gap-[var(--ds-space-2)]">
      <Label
        className="text-[color:var(--ds-color-text-primary)]"
        style={{ fontSize: dsFontSize.sm, fontWeight: dsFontWeight.medium }}
      >
        {label}
      </Label>
      {children}
    </div>
  );
}
