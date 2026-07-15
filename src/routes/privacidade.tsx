import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — SimulaPro" },
      {
        name: "description",
        content:
          "Como o SimulaPro coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
      },
      { property: "og:title", content: "Política de Privacidade — SimulaPro" },
      {
        property: "og:description",
        content: "Como o SimulaPro coleta, usa e protege seus dados pessoais.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacidadePage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function PrivacidadePage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última atualização: 15 de julho de 2026.
        </p>

        <Card className="mt-8 border-border/60 shadow-none">
          <CardContent className="space-y-8 p-6 sm:p-8">
            <Section title="Quais dados coletamos">
              <p>
                Coletamos nome completo, e-mail e senha no cadastro; CPF no momento do pagamento; e
                dados gerados pelo uso da plataforma, como respostas às questões, sessões de estudo
                e estatísticas de desempenho.
              </p>
            </Section>

            <Separator />

            <Section title="Finalidade">
              <p>
                Usamos esses dados exclusivamente para: criar e manter sua conta, processar seu
                pagamento, liberar o acesso ao conteúdo contratado e enviar comunicações
                relacionadas à sua experiência no SimulaPro (confirmações, avisos de renovação,
                suporte). Não usamos seus dados para vender a terceiros ou para fins de marketing
                não relacionados ao SimulaPro.
              </p>
            </Section>

            <Separator />

            <Section title="Cookies">
              <p>
                Hoje utilizamos apenas cookies essenciais, necessários para manter sua sessão de
                login funcionando. Não utilizamos, nesta fase, cookies de análise de audiência ou de
                publicidade. Se isso mudar no futuro, esta política será atualizada antes da mudança
                entrar em vigor.
              </p>
            </Section>

            <Separator />

            <Section title="Autenticação">
              <p>
                A autenticação da sua conta é feita por um provedor especializado (Supabase Auth).
                Sua senha nunca é armazenada em texto simples pelo SimulaPro.
              </p>
            </Section>

            <Separator />

            <Section title="Pagamentos">
              <p>
                Os pagamentos são processados pelo Asaas, uma instituição de pagamento
                especializada. O SimulaPro não processa nem armazena o número do seu cartão de
                crédito — essa informação fica inteiramente a cargo do Asaas. O CPF informado no
                checkout é repassado ao Asaas apenas para viabilizar a emissão da cobrança.
              </p>
            </Section>

            <Separator />

            <Section title="Armazenamento">
              <p>
                Seus dados ficam armazenados em infraestrutura de banco de dados hospedada
                (Supabase), com acesso restrito à equipe do SimulaPro.
              </p>
            </Section>

            <Separator />

            <Section title="Tempo de retenção">
              <p>
                Mantemos seus dados enquanto sua conta existir. Seu histórico de estudo continua
                disponível mesmo após o fim de um ciclo de acesso, para que você possa retomar ou
                consultar sua evolução caso decida renovar. Você pode solicitar a eliminação dos
                seus dados a qualquer momento, conforme descrito abaixo.
              </p>
            </Section>

            <Separator />

            <Section title="Direitos do usuário">
              <p>
                Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:
                confirmação da existência de tratamento, acesso aos seus dados, correção de dados
                incompletos ou desatualizados, eliminação dos dados tratados com o seu
                consentimento, portabilidade a outro fornecedor, informação sobre com quem
                compartilhamos seus dados, e revogação do consentimento quando aplicável.
              </p>
            </Section>

            <Separator />

            <Section title="Contato para solicitações LGPD">
              <p>
                Para exercer qualquer um desses direitos, entre em contato pelo e-mail{" "}
                <a
                  href="mailto:suporte@simulapro.com.br"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  suporte@simulapro.com.br
                </a>
                . Responderemos pessoalmente à sua solicitação.
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
