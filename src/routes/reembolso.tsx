import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/reembolso")({
  head: () => ({
    meta: [
      { title: "Política de Reembolso — SimulaPro" },
      {
        name: "description",
        content: "Garantia de 7 dias, procedimento e prazo para solicitar reembolso no SimulaPro.",
      },
      { property: "og:title", content: "Política de Reembolso — SimulaPro" },
      {
        property: "og:description",
        content: "Garantia de 7 dias, procedimento e prazo para solicitar reembolso.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ReembolsoPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function ReembolsoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Política de Reembolso</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última atualização: 15 de julho de 2026.
        </p>

        <Card className="mt-8 border-border/60 shadow-none">
          <CardContent className="space-y-8 p-6 sm:p-8">
            <Section title="Garantia de 7 dias">
              <p>
                Você tem 7 dias corridos, a contar da confirmação do seu pagamento, para solicitar o
                cancelamento e reembolso integral, sem precisar justificar o motivo. É uma garantia
                incondicional.
              </p>
            </Section>

            <Separator />

            <Section title="Procedimento">
              <p>
                Para solicitar o reembolso, entre em contato pelo canal de suporte informando o
                e-mail usado no cadastro. Não é necessário preencher formulário nem apresentar
                justificativa.
              </p>
            </Section>

            <Separator />

            <Section title="Prazo">
              <p>
                A solicitação precisa ser feita dentro dos 7 dias corridos da garantia. Após
                confirmada, o reembolso é processado em poucos dias úteis, no mesmo meio de
                pagamento utilizado na compra.
              </p>
            </Section>

            <Separator />

            <Section title="Forma de contato">
              <p>
                Solicitações de reembolso devem ser feitas pelo e-mail{" "}
                <a
                  href="mailto:suporte@simulapro.com.br"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  suporte@simulapro.com.br
                </a>
                .
              </p>
            </Section>

            <Separator />

            <Section title="Perda de acesso após reembolso">
              <p>
                Após a confirmação do reembolso, o acesso ao Acervo é encerrado. Seu histórico de
                estudo permanece salvo, caso você decida contratar o acesso novamente no futuro.
              </p>
            </Section>

            <Separator />

            <Section title="Observação sobre pagamentos via Asaas">
              <p>
                Os pagamentos do SimulaPro são processados pelo Asaas. O reembolso é efetuado
                através dessa mesma plataforma de pagamento, respeitando o prazo de compensação do
                meio de pagamento original (Pix, cartão de crédito ou boleto).
              </p>
            </Section>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 text-center sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            SimulaPro
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SimulaPro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
