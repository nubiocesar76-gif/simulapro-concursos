import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, ExternalLink, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchMySubscriptions,
  resolveDisplayStatus,
  displayStatusBadgeVariant,
  formatBillingType,
  formatDueDate,
  type MySubscriptionRow,
} from "@/lib/student-subscription";
import {
  getAsaasLiveStatus,
  iniciarCheckout,
  type AsaasLiveStatus,
} from "@/lib/student-subscription.functions";
import { iniciarPlanoFree } from "@/lib/free-subscription.functions";
import { COMMERCIAL_PLANS } from "@/config/commercial-plans";
import { FREE_PLAN_DISTRIBUTION_ID } from "@/config/free-plan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { EmptyState } from "@/components/shared/EmptyState";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { toast } from "sonner";
import { STUDENT_PAGE_SHELL_NARROW } from "@/config/study";

// Mesmo critério de vigência usado no backend (Bug G4/G4.1) — só decide o que
// mostrar na tela, não decide acesso de verdade (isso continua sendo feito pelo
// servidor em cada server function).
function isCurrentlyActive(subscription: MySubscriptionRow): boolean {
  if (subscription.status !== "ACTIVE") return false;
  const now = Date.now();
  if (new Date(subscription.starts_at).getTime() > now) return false;
  if (subscription.expires_at && new Date(subscription.expires_at).getTime() < now) return false;
  return true;
}

export function SubscriptionPage() {
  const { user } = useAuth();
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);
  const [cpfCnpj, setCpfCnpj] = useState("");

  const {
    data: subscriptions,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-subscriptions", user?.id],
    enabled: !!user,
    queryFn: () => fetchMySubscriptions(user!.id),
  });

  const checkout = useMutation({
    mutationFn: (planId: string) => iniciarCheckout({ data: { planId, cpfCnpj } }),
    onSuccess: (result) => {
      window.location.href = result.redirectUrl;
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Erro ao iniciar checkout."),
  });

  const freePlan = useMutation({
    mutationFn: () => iniciarPlanoFree(),
    onSuccess: () => {
      toast.success("Plano Free ativado! Bem-vindo ao SimulaPro.");
      refetch();
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

  if (isLoading) {
    return (
      <div className={STUDENT_PAGE_SHELL_NARROW} aria-busy="true" aria-label="Carregando assinatura">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (isError || !subscriptions) {
    return (
      <div className={STUDENT_PAGE_SHELL_NARROW}>
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Minha assinatura</h1>
        </header>
        <PageErrorState
          title="Erro ao carregar assinatura"
          message={
            error instanceof Error ? error.message : "Não foi possível carregar sua assinatura."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className={STUDENT_PAGE_SHELL_NARROW}>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Minha assinatura</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe sua assinatura ou escolha um plano para começar a estudar.
        </p>
      </header>

      {subscriptions.length > 0 && (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      )}

      {/* O catálogo (Free + planos pagos) some quando já existe assinatura paga
          vigente — não faz sentido oferecer upgrade ou o plano free para quem já tem
          acesso completo. Continua visível para quem só tem (ou não tem nenhuma)
          assinatura free, para permitir o upgrade descrito na validação da G6.0. */}
      {!subscriptions.some(
        (s) => s.distribution_id !== FREE_PLAN_DISTRIBUTION_ID && isCurrentlyActive(s),
      ) && (
        <PlanCatalog
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
              <Button type="button" variant="outline" onClick={() => setCheckoutPlanId(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={checkout.isPending}>
                {checkout.isPending ? "Redirecionando..." : "Ir para pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SubscriptionCard({ subscription }: { subscription: MySubscriptionRow }) {
  const qc = useQueryClient();
  const live = useQuery({
    queryKey: ["asaas-live-status", subscription.distribution_id],
    queryFn: () => getAsaasLiveStatus({ data: { distributionId: subscription.distribution_id } }),
  });

  const liveData: AsaasLiveStatus | undefined = live.data;
  const status = resolveDisplayStatus(subscription.status, subscription.expires_at, liveData);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xl">{subscription.distribution_name}</CardTitle>
            <CardDescription>
              {subscription.course_name} · {subscription.package_name}
            </CardDescription>
          </div>
          <Badge variant={displayStatusBadgeVariant(status)}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Próxima cobrança</p>
            <p className="font-medium">{formatDueDate(liveData?.nextDueDate ?? null)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Vencimento da assinatura</p>
            <p className="font-medium">{formatDueDate(subscription.expires_at)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Método de pagamento</p>
            <p className="font-medium">{formatBillingType(liveData?.billingType ?? null)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {liveData?.invoiceUrl && (
            <Button variant="outline" asChild>
              <a href={liveData.invoiceUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Gerenciar pagamento
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() =>
              qc.invalidateQueries({
                queryKey: ["asaas-live-status", subscription.distribution_id],
              })
            }
            disabled={live.isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${live.isFetching ? "animate-spin" : ""}`} />
            {live.isFetching ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PlanCatalog({
  onSelectPlan,
  onActivateFree,
  freePending,
}: {
  onSelectPlan: (planId: string) => void;
  onActivateFree: () => void;
  freePending: boolean;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Plano Free</CardTitle>
          <CardDescription>Comece a estudar agora, sem custo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl font-semibold tracking-tight">R$ 0,00</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
            <li>Acesso ao primeiro simulado</li>
            <li>Acesso imediato</li>
            <li>Sem cartão</li>
            <li>Sem cobrança</li>
          </ul>
          <Button
            className="w-full"
            variant="outline"
            onClick={onActivateFree}
            disabled={freePending}
          >
            {freePending ? "Ativando..." : "Começar Grátis"}
          </Button>
        </CardContent>
      </Card>

      {COMMERCIAL_PLANS.length === 0 ? (
        <EmptyState
          title="Nenhum plano pago disponível no momento"
          description="Fale com o administrador para saber mais sobre as opções de assinatura."
          icon={CreditCard}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {COMMERCIAL_PLANS.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className="text-lg">{plan.label}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold tracking-tight">
                  R$ {plan.value.toFixed(2).replace(".", ",")}
                </p>
                <Button className="w-full" onClick={() => onSelectPlan(plan.id)}>
                  Assinar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
