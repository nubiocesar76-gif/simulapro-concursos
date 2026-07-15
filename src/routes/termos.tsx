import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — SimulaPro" },
      {
        name: "description",
        content:
          "As regras de uso do SimulaPro: objeto, responsabilidades, propriedade intelectual e limitações.",
      },
      { property: "og:title", content: "Termos de Uso — SimulaPro" },
      {
        property: "og:description",
        content: "As regras de uso do SimulaPro: objeto, responsabilidades e limitações.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermosPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function TermosPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Termos de Uso</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última atualização: 15 de julho de 2026.
        </p>

        <Card className="mt-8 border-border/60 shadow-none">
          <CardContent className="space-y-8 p-6 sm:p-8">
            <Section title="Objeto">
              <p>
                O SimulaPro é uma plataforma de treino por questões oficiais de concursos públicos,
                dedicada ao curso de Enfermagem e ao cargo Enfermeiro. Estes termos regem o uso da
                plataforma por qualquer pessoa que crie uma conta.
              </p>
            </Section>

            <Separator />

            <Section title="Funcionamento da plataforma">
              <p>
                O acesso ao Acervo de questões é liberado mediante a contratação de um plano (hoje,
                o Plano Fundador), por um ciclo de acesso com duração definida no momento da compra.
                O SimulaPro não é um curso completo com vídeoaulas nem garante aprovação em concurso
                — é uma ferramenta de treino por questões, complementar ao seu estudo de teoria.
              </p>
            </Section>

            <Separator />

            <Section title="Responsabilidades">
              <p>
                Você é responsável por manter a confidencialidade da sua senha e por usar a
                plataforma apenas para fins pessoais de estudo. O SimulaPro é responsável por manter
                o Acervo organizado, classificado e revisado, e por corrigir, dentro de prazo
                razoável, qualquer erro real identificado em uma questão.
              </p>
            </Section>

            <Separator />

            <Section title="Propriedade intelectual">
              <p>
                O texto original das questões pertence às respectivas bancas organizadoras e órgãos
                públicos que aplicaram as provas. A curadoria, classificação por banca, disciplina e
                assunto, as explicações escritas e a organização do Acervo são propriedade
                intelectual do SimulaPro. É vedada a reprodução, redistribuição ou revenda do
                conteúdo organizado do Acervo sem autorização prévia.
              </p>
            </Section>

            <Separator />

            <Section title="Limitações">
              <p>
                O SimulaPro não garante aprovação em nenhum concurso público. O desempenho em
                questões de provas passadas não é garantia de resultado em provas futuras. O
                SimulaPro não se exime, no entanto, de responsabilidade por vícios reais do serviço,
                como erro de gabarito ou indisponibilidade prolongada da plataforma.
              </p>
            </Section>

            <Separator />

            <Section title="Suspensão de contas">
              <p>
                A conta pode ser suspensa em caso de uso indevido da plataforma, violação destes
                Termos, ou tentativa de reproduzir, redistribuir ou revender o conteúdo do Acervo.
                Sempre que possível, você será avisado antes da suspensão, exceto em casos de uso
                claramente abusivo.
              </p>
            </Section>

            <Separator />

            <Section title="Alterações">
              <p>
                Estes Termos podem ser atualizados para refletir mudanças no produto ou na
                legislação aplicável. Alterações relevantes serão comunicadas com antecedência
                razoável.
              </p>
            </Section>

            <Separator />

            <Section title="Foro">
              <p>
                Fica eleito o foro do domicílio do usuário, conforme facultado pela legislação
                brasileira de defesa do consumidor, para dirimir eventuais controvérsias decorrentes
                destes Termos.
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
