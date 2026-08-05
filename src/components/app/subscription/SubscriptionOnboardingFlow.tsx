import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  ChevronLeft,
  Crown,
  CreditCard,
  FileCheck2,
  Gift,
  GraduationCap,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAvailableExamsForPosition,
  fetchAcervoStatsForPosition,
  type AvailableExam,
  type AcervoStats,
} from "@/lib/student-onboarding";
import { iniciarCheckout } from "@/lib/student-subscription.functions";
import { iniciarPlanoFree } from "@/lib/free-subscription.functions";
import { getPlansForPosition, type CommercialPlan } from "@/config/commercial-plans";
import { FREE_PLAN_POSITION_SLUGS } from "@/config/free-plan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/shared/EmptyState";
import { toast } from "sonner";
import {
  CheckItem,
  FreePlanIllustration,
} from "@/components/app/subscription/SubscriptionIllustrations";

/**
 * Jornada Área (courses) → Cargo (positions) → Concursos disponíveis (exams,
 * derivado de questions.exam_id) → Plano (commercial-plans.ts). Extraído de
 * SubscriptionPage.tsx para ser reaproveitado também no primeiro acesso do
 * Dashboard, sem duplicar a lógica de seleção. Área e Cargo sempre vêm do
 * banco real (courses/positions), nunca de commercial-plans.ts (ver
 * PLANO_TECNICO_MULTIAREA_MULTICARGO_V1.md, Ajuste 2).
 *
 * Os subcomponentes de apresentação (AreaPicker/CargoPicker/ExamsStep/
 * PlanCatalog) usam um sistema de cards claros elevados (não fundo escuro),
 * porque este mesmo fluxo também é embutido no primeiro acesso do Dashboard
 * (StudentDashboardPage.tsx), que é uma página clara — só o shell da tela
 * "Minha assinatura" (SubscriptionPage.tsx) tem o hero escuro.
 */
export function SubscriptionOnboardingFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedPositionSlug, setSelectedPositionSlug] = useState<string | null>(null);
  const [examsStepSeen, setExamsStepSeen] = useState(false);

  const { data: courses } = useQuery({
    queryKey: ["subscription-courses"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  // Auto-seleciona quando só existe 1 área real — evita uma tela de "escolha entre 1
  // opção só". Some sozinho assim que uma segunda área real existir no banco.
  const effectiveCourseId = selectedCourseId ?? (courses?.length === 1 ? courses[0].id : null);

  const { data: positions } = useQuery({
    queryKey: ["subscription-positions", effectiveCourseId],
    enabled: !!user && !!effectiveCourseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("positions")
        .select("id, name, slug")
        .eq("course_id", effectiveCourseId!)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const selectedCourse = courses?.find((c) => c.id === effectiveCourseId) ?? null;
  const selectedPosition = positions?.find((p) => p.slug === selectedPositionSlug) ?? null;

  const { data: exams, isLoading: examsLoading } = useQuery({
    queryKey: ["subscription-exams", selectedPosition?.id],
    enabled: !!user && !!selectedPosition,
    queryFn: () => fetchAvailableExamsForPosition(selectedPosition!.id),
  });

  const { data: acervoStats, isLoading: acervoStatsLoading } = useQuery({
    queryKey: ["subscription-acervo-stats", selectedPosition?.id],
    enabled: !!user && !!selectedPosition,
    queryFn: () => fetchAcervoStatsForPosition(selectedPosition!.id),
  });

  function resetCourseSelection() {
    setSelectedCourseId(null);
    setSelectedPositionSlug(null);
    setExamsStepSeen(false);
  }

  function resetPositionSelection() {
    setSelectedPositionSlug(null);
    setExamsStepSeen(false);
  }

  const checkout = useMutation({
    mutationFn: (planId: string) =>
      iniciarCheckout({
        data: { planId, cpfCnpj, positionSlug: selectedPosition!.slug },
      }),
    onSuccess: (result) => {
      window.location.href = result.redirectUrl;
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Erro ao iniciar checkout."),
  });

  const freePlan = useMutation({
    mutationFn: () => iniciarPlanoFree({ data: { positionSlug: selectedPosition!.slug } }),
    onSuccess: async () => {
      toast.success("Plano Free ativado! Bem-vindo ao SimulaPro.");
      await qc.invalidateQueries({ queryKey: ["my-subscriptions"] });
      await qc.invalidateQueries({ queryKey: ["student-dashboard"] });
      navigate({ to: "/app" });
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Erro ao ativar o Plano Free."),
  });

  function openCheckout(planId: string) {
    setCpfCnpj("");
    setCheckoutPlanId(planId);
  }

  function confirmCheckout() {
    if (!checkoutPlanId) return;
    checkout.mutate(checkoutPlanId);
  }

  return (
    <>
      {!effectiveCourseId && (
        <AreaPicker courses={courses ?? []} onSelect={(id) => setSelectedCourseId(id)} />
      )}

      {effectiveCourseId && !selectedPosition && (
        <CargoPicker
          areaLabel={selectedCourse?.name ?? ""}
          positions={positions ?? []}
          showBackToArea={(courses?.length ?? 0) > 1}
          onBack={resetCourseSelection}
          onSelect={(slug) => setSelectedPositionSlug(slug)}
        />
      )}

      {selectedPosition && !examsStepSeen && (
        <ExamsStep
          cargoLabel={selectedPosition.name}
          exams={exams ?? []}
          isLoading={examsLoading}
          acervoStats={acervoStats ?? null}
          acervoStatsLoading={acervoStatsLoading}
          onBack={resetPositionSelection}
          onContinue={() => setExamsStepSeen(true)}
        />
      )}

      {selectedPosition && examsStepSeen && (
        <PlanCatalog
          cargoLabel={selectedPosition.name}
          plans={getPlansForPosition(selectedPosition.slug)}
          showFree={FREE_PLAN_POSITION_SLUGS.includes(selectedPosition.slug)}
          onBack={() => setExamsStepSeen(false)}
          onSelectPlan={openCheckout}
          onActivateFree={() => freePlan.mutate()}
          freePending={freePlan.isPending}
        />
      )}

      <Dialog open={!!checkoutPlanId} onOpenChange={(open) => !open && setCheckoutPlanId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar assinatura</DialogTitle>
            <DialogDescription>
              Informe seu CPF para prosseguir. Você será redirecionado ao checkout seguro do Asaas
              para concluir o pagamento.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              confirmCheckout();
            }}
            className="space-y-3"
          >
            <div>
              <Label htmlFor="checkout-cpf">CPF *</Label>
              <Input
                id="checkout-cpf"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setCheckoutPlanId(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl" disabled={checkout.isPending}>
                {checkout.isPending ? "Redirecionando..." : "Ir para pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Card premium claro reaproveitado pelas 4 telas do wizard (Área/Cargo/Concursos/Planos).
const PICKER_CARD_CLASSES =
  "group relative cursor-pointer rounded-2xl border border-[color:var(--ds-color-border)] bg-white p-5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--ds-color-action)] hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.18)]";

// Tela 1 — "O que você deseja estudar?" — lista vem sempre de `courses` (banco real).
function AreaPicker({
  courses,
  onSelect,
}: {
  courses: { id: string; name: string }[];
  onSelect: (courseId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold tracking-tight" style={{ color: "#0A1633" }}>
        O que você deseja estudar?
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <button
            key={course.id}
            type="button"
            className={PICKER_CARD_CLASSES}
            onClick={() => onSelect(course.id)}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-semibold" style={{ color: "#0A1633" }}>
                {course.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Tela 2 — "Escolha sua preparação" — lista vem de `positions` filtrada por `course_id`.
function CargoPicker({
  areaLabel,
  positions,
  showBackToArea,
  onBack,
  onSelect,
}: {
  areaLabel: string;
  positions: { id: string; name: string; slug: string }[];
  showBackToArea: boolean;
  onBack: () => void;
  onSelect: (positionSlug: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {showBackToArea && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onBack}
            aria-label="Trocar área"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-lg font-bold tracking-tight" style={{ color: "#0A1633" }}>
          Escolha sua preparação {areaLabel ? `em ${areaLabel}` : ""}
        </h2>
      </div>
      {positions.length === 0 ? (
        <EmptyState
          title="Nenhum cargo disponível nesta área"
          description="Fale com o administrador para saber mais sobre as opções de preparação."
          icon={CreditCard}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {positions.map((position) => (
            <button
              key={position.id}
              type="button"
              className={PICKER_CARD_CLASSES}
              onClick={() => onSelect(position.slug)}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-semibold" style={{ color: "#0A1633" }}>
                  {position.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Tela 3 — "Concursos disponíveis para este cargo" — derivado de questions.exam_id
// (dado real já existente). Puramente informativa: não filtra planos por concurso,
// já que hoje 1 plano cobre o acervo inteiro do cargo. Cargos cujo acervo é 100%
// inédito (sem exam_id vinculado) mostram uma explicação em vez de lista vazia.
// Card base reaproveitado pelas duas variantes (com exames reais / acervo inédito) desta
// etapa — mesmo nível visual, mesma estrutura, mesmo espaçamento em ambos os cargos.
function ExamsStepCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl border border-[color:var(--ds-color-border)] bg-white p-6"
      style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
    >
      {children}
    </div>
  );
}

function ExamsStep({
  cargoLabel,
  exams,
  isLoading,
  acervoStats,
  acervoStatsLoading,
  onBack,
  onContinue,
}: {
  cargoLabel: string;
  exams: AvailableExam[];
  isLoading: boolean;
  acervoStats: AcervoStats | null;
  acervoStatsLoading: boolean;
  onBack: () => void;
  onContinue: () => void;
}) {
  const boardNames = [...new Set(exams.map((e) => e.boardName).filter((n): n is string => !!n))];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onBack}
          aria-label="Trocar cargo"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-bold tracking-tight" style={{ color: "#0A1633" }}>
          {exams.length > 0 ? "Concursos e bancas cobertos" : "Acervo Técnico em Enfermagem"}
        </h2>
      </div>

      {isLoading ? (
        <ExamsStepCard>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </ExamsStepCard>
      ) : exams.length > 0 ? (
        <ExamsStepCard>
          <p className="text-sm font-semibold" style={{ color: "#0A1633" }}>
            Conteúdo baseado em {exams.length}{" "}
            {exams.length === 1 ? "concurso real" : "concursos reais"}
          </p>
          {boardNames.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {boardNames.map((name) => (
                <Badge key={name} variant="secondary" className="px-3 py-1 text-xs font-medium">
                  {name}
                </Badge>
              ))}
            </div>
          )}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "#64748B" }}>
            Você terá acesso a questões organizadas com base no perfil real das principais bancas e
            concursos da área.
          </p>

          <Accordion type="single" collapsible className="mt-3">
            <AccordionItem value="todos" className="border-t border-[color:var(--ds-color-border)]">
              <AccordionTrigger className="py-3 text-sm text-[#2563EB] hover:no-underline">
                Ver todos os concursos
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-1">
                  {exams.map((exam) => (
                    <Badge
                      key={exam.id}
                      variant="secondary"
                      className="px-3 py-1.5 text-xs font-normal"
                    >
                      {exam.name}
                      {exam.year ? ` · ${exam.year}` : ""}
                      {exam.boardName ? ` · ${exam.boardName}` : ""}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ExamsStepCard>
      ) : (
        <ExamsStepCard>
          {acervoStatsLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                    <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "#0A1633" }}>
                    {acervoStats?.totalQuestions ?? 0} questões inéditas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "#0A1633" }}>
                    {acervoStats?.disciplineCount ?? 0} disciplinas
                  </span>
                </div>
                {(acervoStats?.boardNames.length ?? 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "#0A1633" }}>
                      {acervoStats?.boardNames.length} bancas de referência
                    </span>
                  </div>
                )}
              </div>
              {(acervoStats?.boardNames.length ?? 0) > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {acervoStats!.boardNames.map((name) => (
                    <Badge key={name} variant="secondary" className="px-3 py-1 text-xs font-medium">
                      {name}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#64748B" }}>
                O acervo deste cargo é formado por questões inéditas, construídas a partir de
                editais reais e do perfil de cobrança das principais bancas.
              </p>
            </>
          )}
        </ExamsStepCard>
      )}

      <Button size="lg" className="rounded-xl" onClick={onContinue}>
        Continuar
      </Button>
    </div>
  );
}

// Tela 4 — planos já filtrados para o cargo escolhido.
function PlanCatalog({
  cargoLabel,
  plans,
  showFree,
  onBack,
  onSelectPlan,
  onActivateFree,
  freePending,
}: {
  cargoLabel: string;
  plans: CommercialPlan[];
  showFree: boolean;
  onBack: () => void;
  onSelectPlan: (planId: string) => void;
  onActivateFree: () => void;
  freePending: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onBack}
          aria-label="Voltar aos concursos"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
            style={{ color: "#0A1633" }}
          >
            <Sparkles className="h-5 w-5" style={{ color: "#2563EB" }} aria-hidden="true" />
            Escolha seu plano
          </h2>
          <p className="text-sm text-[#64748B]">
            Acesso completo à plataforma SimulaPro — escolha o concurso que deseja estudar.
          </p>
        </div>
      </div>

      {showFree && (
        <div className="overflow-hidden rounded-2xl border border-[color:var(--ds-color-border)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  <Gift className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-lg font-bold" style={{ color: "#0A1633" }}>
                    Plano Free
                  </p>
                  <p className="text-sm text-[#64748B]">Comece a estudar agora, sem custo.</p>
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight" style={{ color: "#0A1633" }}>
                R$ 0,00
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                <CheckItem>Acesso ao primeiro simulado</CheckItem>
                <CheckItem>Acesso imediato</CheckItem>
                <CheckItem>Sem cartão</CheckItem>
                <CheckItem>Sem cobrança</CheckItem>
              </ul>
              <Button
                size="lg"
                variant="outline"
                onClick={onActivateFree}
                disabled={freePending}
                className="w-full rounded-xl sm:w-auto"
              >
                {freePending ? "Ativando..." : "Começar Grátis"}
              </Button>
            </div>
            <FreePlanIllustration className="hidden h-32 w-32 sm:block" />
          </div>
        </div>
      )}

      {plans.length === 0 ? (
        <EmptyState
          title="Nenhum plano pago disponível para este cargo no momento"
          description="Fale com o administrador para saber mais sobre as opções de assinatura."
          icon={CreditCard}
        />
      ) : (
        <div className={`grid gap-5 ${plans.length >= 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
          {plans.map((plan, index) => {
            const highlighted = plans.length > 1 && index === 0;
            const Icon = index === 0 ? Crown : Zap;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_24px_-10px_rgba(15,23,42,0.14)] ${
                  highlighted
                    ? "border-2 border-[#2563EB] shadow-[0_12px_28px_-12px_rgba(37,99,235,0.35)]"
                    : "border-[color:var(--ds-color-border)]"
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF7E6] text-[#D97706]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-lg font-bold" style={{ color: "#0A1633" }}>
                    {plan.label}
                  </p>
                  <p className="mt-1 text-sm text-[#64748B]">{plan.description}</p>
                </div>
                <div>
                  <p
                    className="text-3xl font-extrabold tracking-tight"
                    style={{ color: "#0A1633" }}
                  >
                    R$ {plan.value.toFixed(2).replace(".", ",")}
                  </p>
                  {plan.accessDurationMonths > 1 && (
                    <p className="mt-0.5 text-xs text-[#64748B]">
                      equivale a R${" "}
                      {(plan.value / plan.accessDurationMonths).toFixed(2).replace(".", ",")}
                      /mês
                    </p>
                  )}
                </div>
                {highlighted && (
                  <span className="inline-flex w-fit items-center rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-semibold text-[#15803D]">
                    Melhor custo-benefício
                  </span>
                )}
                <Button
                  size="lg"
                  onClick={() => onSelectPlan(plan.id)}
                  className="mt-auto w-full rounded-xl"
                >
                  Assinar agora
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
