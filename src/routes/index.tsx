import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Filter,
  GraduationCap,
  History,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COMMERCIAL_PLANS } from "@/config/commercial-plans";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SimulaPro — Questões oficiais de Enfermagem para concursos públicos" },
      {
        name: "description",
        content:
          "Treine para concursos de Enfermagem com questões oficiais organizadas por banca, disciplina e assunto. Study Builder, resultados por disciplina e Central de Revisão em um único lugar.",
      },
      {
        property: "og:title",
        content: "SimulaPro — Questões oficiais de Enfermagem para concursos públicos",
      },
      {
        property: "og:description",
        content:
          "Organização, produtividade e revisão inteligente para quem estuda Enfermagem com o tempo contado.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "SimulaPro — Questões oficiais de Enfermagem para concursos públicos",
      },
      {
        name: "twitter:description",
        content:
          "Treine com questões oficiais organizadas por banca, disciplina e assunto. Sem cobrança automática.",
      },
    ],
  }),
  component: Landing,
});

const BANKS = [
  "IBFC",
  "FGV",
  "Instituto AOCP",
  "VUNESP",
  "Instituto Consulplan",
  "FUNDATEC",
  "UFPR/NC",
  "COSEAC",
];

const HOW_IT_WORKS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: UserPlus,
    title: "Cadastro",
    description: "Crie sua conta com e-mail e senha. Nenhum pagamento é pedido nesta etapa.",
  },
  {
    icon: ShieldCheck,
    title: "Plano",
    description: "Escolha o Plano Fundador e conclua o pagamento com segurança.",
  },
  {
    icon: BookOpen,
    title: "Resolver questões",
    description: "Configure uma sessão por banca, disciplina, assunto ou modo de estudo.",
  },
  {
    icon: BarChart3,
    title: "Resultados",
    description: "Veja seu desempenho detalhado, disciplina por disciplina.",
  },
  {
    icon: RotateCcw,
    title: "Revisão",
    description: "Volte ao que errou ou favoritou, sem se perder no que já domina.",
  },
];

const FEATURES: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: ClipboardList,
    title: "Study Builder",
    description:
      "Monte sua sessão escolhendo modo, banca, disciplina, assunto e quantidade de questões.",
  },
  {
    icon: TrendingUp,
    title: "Resultados inteligentes",
    description:
      "Desempenho ordenado do menor para o maior aproveitamento — saiba onde estudar primeiro.",
  },
  {
    icon: RotateCcw,
    title: "Central de Revisão",
    description: "Favoritas, erradas e marcadas para revisão, tudo reunido em um único lugar.",
  },
  {
    icon: History,
    title: "Histórico",
    description: "Todas as suas sessões, com filtros por curso, modo, período e status.",
  },
  {
    icon: BookMarked,
    title: "Questões favoritas",
    description: "Marque o que quiser revisar depois e volte a isso quando fizer sentido.",
  },
  {
    icon: Filter,
    title: "Filtros por banca, disciplina e assunto",
    description: "Refine o Acervo pela taxonomia oficial, sem perder tempo com o que não importa.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Vale a pena?",
    answer:
      "Se o que você precisa é treinar por questões oficiais de Enfermagem, organizadas por banca, disciplina e assunto, sim — é exatamente o problema que o SimulaPro resolve. Se você precisa de um curso completo com vídeoaulas, o SimulaPro não é esse produto, e preferimos dizer isso agora a deixar você descobrir depois de pagar.",
  },
  {
    question: "É atualizado?",
    answer:
      "O Acervo está em produção contínua. Cada nova prova passa por um processo de classificação e revisão antes de entrar no banco — não prometemos uma quantidade fixa de questões novas por mês, prometemos que o que entra, entra classificado e revisado.",
  },
  {
    question: "Como funciona?",
    answer:
      "Você garante acesso ao Acervo Enfermeiro, escolhe o modo de sessão (Estudo, Prova, Revisão, Favoritos ou Apenas Erradas), resolve questões filtradas por disciplina, assunto ou banca, e acompanha seu desempenho por disciplina em tempo real.",
  },
  {
    question: "Tem assinatura automática?",
    answer:
      'Não. Você paga uma vez pelo ciclo de acesso contratado. Ao final do período, decide se quer renovar — não há cobrança automática nem necessidade de "lembrar de cancelar".',
  },
  {
    question: "Posso cancelar?",
    answer:
      'Como não há cobrança recorrente automática, não existe "cancelamento" no sentido de interromper uma assinatura — seu acesso simplesmente não é renovado se você não quiser continuar. Se quiser reembolso dentro dos primeiros 7 dias, é só solicitar.',
  },
  {
    question: "As questões são oficiais?",
    answer:
      "Sim. Todas as questões do Acervo são de provas oficiais aplicadas por bancas organizadoras reais (hoje, IBFC, FGV, Instituto AOCP, VUNESP, Instituto Consulplan, COSEAC, FUNDATEC e UFPR/NC), com classificação por disciplina, assunto, banca e ano.",
  },
];

const plan = COMMERCIAL_PLANS[0];

function jsonLd(planValue?: number, planMonths?: number) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "SimulaPro",
        url: "https://simulapro.com.br",
      },
      {
        "@type": "WebSite",
        name: "SimulaPro",
        url: "https://simulapro.com.br",
      },
      {
        "@type": "Product",
        name: "SimulaPro — Plano Fundador",
        description:
          "Acesso ao Acervo de questões oficiais de Enfermagem para concursos públicos, organizado por banca, disciplina e assunto.",
        brand: { "@type": "Brand", name: "SimulaPro" },
        ...(planValue
          ? {
              offers: {
                "@type": "Offer",
                priceCurrency: "BRL",
                price: planValue,
                availability: "https://schema.org/InStock",
                description: planMonths
                  ? `Acesso por ${planMonths} meses, sem cobrança automática`
                  : undefined,
              },
            }
          : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Dashboard
      </p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Questões respondidas", value: "184" },
          { label: "Aproveitamento", value: "71%" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <p className="text-[0.65rem] text-muted-foreground">{item.label}</p>
            <p className="text-lg font-semibold tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5 rounded-lg border border-border/50 bg-muted/20 p-3">
        <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
          <span>Legislação do SUS</span>
          <span className="tabular-nums">58%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted">
          <div className="h-1.5 w-[58%] rounded-full bg-warning" />
        </div>
      </div>
    </div>
  );
}

function SessionPreview() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Sessão de estudo
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
          <span>Questão 6 de 20</span>
          <span>Modo Estudo</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted">
          <div className="h-1.5 w-[30%] rounded-full bg-primary" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {["A", "B", "C"].map((letter, index) => (
          <div
            key={letter}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[0.7rem] ${
              index === 1
                ? "border-success/50 bg-success/[0.06] text-foreground"
                : "border-border/50 bg-muted/10 text-muted-foreground"
            }`}
          >
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-md text-[0.65rem] font-semibold ${
                index === 1 ? "bg-success text-success-foreground" : "bg-muted"
              }`}
            >
              {letter}
            </span>
            <span className="truncate">Alternativa de exemplo {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsPreview() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Resultados
      </p>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Acertos", value: "14" },
          { label: "Erros", value: "6" },
          { label: "Aprov.", value: "70%" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border/50 bg-muted/20 p-2.5 text-center"
          >
            <p className="text-[0.6rem] text-muted-foreground">{item.label}</p>
            <p className="text-base font-semibold tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {["Administração em Enfermagem", "Saúde Coletiva"].map((name, index) => (
          <div key={name} className="flex items-center justify-between text-[0.7rem]">
            <span className="truncate text-muted-foreground">{name}</span>
            <span className="tabular-nums font-medium">{index === 0 ? "52%" : "83%"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewPreview() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Central de Revisão
      </p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Favoritas", value: "12" },
          { label: "Erradas", value: "9" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border/50 bg-muted/20 p-2.5">
            <p className="text-[0.6rem] text-muted-foreground">{item.label}</p>
            <p className="text-base font-semibold tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/10 px-2.5 py-2 text-[0.7rem] text-muted-foreground">
        <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">Refazer apenas as questões erradas</span>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(plan?.value, plan?.accessDurationMonths)),
        }}
      />

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
            </div>
            SimulaPro
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth">
                Começar agora
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* 1. Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-primary/[0.06] via-accent/[0.04] to-transparent"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                variant="outline"
                className="mx-auto gap-1.5 border-primary/30 bg-primary/5 text-primary"
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Especializado em concursos de Enfermagem
              </Badge>
              <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Estude Enfermagem por questões oficiais, organizadas do seu jeito
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                Questões reais de bancas organizadoras, filtradas por disciplina e assunto, com
                acompanhamento de evolução para você saber exatamente onde estudar primeiro.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/auth">
                    Começar agora
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#como-funciona">Ver como funciona</a>
                </Button>
              </div>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2">
              <DashboardPreview />
              <SessionPreview />
            </div>
          </div>
        </section>

        {/* 2. Principais bancas */}
        <section className="border-y border-border/60 bg-muted/20 py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Questões de provas aplicadas por bancas organizadoras reais
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {BANKS.map((bank) => (
                <Badge key={bank} variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                  {bank}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Como funciona */}
        <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Como funciona"
            title="Da conta ao primeiro resultado, em cinco passos"
            description="Sem etapas escondidas — você sabe exatamente o que vem a seguir em cada momento."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm font-semibold">
                    {index + 1}. {step.title}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Funcionalidades */}
        <section className="border-y border-border/60 bg-muted/20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Funcionalidades"
              title="Tudo que você precisa para treinar com foco"
              description="Sem recursos genéricos — cada peça existe para resolver um problema específico de quem estuda com o tempo contado."
            />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <Card key={feature.title} className="border-border/60 shadow-none">
                  <CardHeader>
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="mt-3 text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Screenshots (ilustrativos — o produto real não tem imagens de tela publicadas ainda) */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="O produto"
            title="Uma prévia do que você encontra depois de entrar"
            description="Representação da interface real do SimulaPro — dashboard, sessão de estudo, resultados e central de revisão."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardPreview />
            <SessionPreview />
            <ResultsPreview />
            <ReviewPreview />
          </div>
        </section>

        {/* 6. Plano */}
        <section id="planos" className="border-y border-border/60 bg-muted/20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow="Oferta de lançamento" title="Plano Fundador" />
            <div className="mx-auto mt-12 max-w-md">
              <Card className="border-primary/30 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{plan?.label ?? "Plano Fundador"}</CardTitle>
                    <Badge>Vagas limitadas</Badge>
                  </div>
                  <CardDescription>
                    {plan?.description ??
                      "Acesso completo ao Acervo Enfermeiro por um ciclo de estudo."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {plan && (
                    <p className="text-4xl font-bold tracking-tight">
                      R$ {plan.value.toFixed(2).replace(".", ",")}
                      <span className="ml-1.5 text-base font-normal text-muted-foreground">
                        / {plan.accessDurationMonths} meses
                      </span>
                    </p>
                  )}
                  <ul className="space-y-2.5 text-sm">
                    {[
                      "Acesso completo ao Acervo Enfermeiro",
                      "Sem cobrança automática ao final do ciclo",
                      "Garantia incondicional de 7 dias",
                      "Vagas limitadas da primeira leva",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-success"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" size="lg">
                    <Link to="/auth">
                      Garantir minha vaga
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Garantia de 7 dias, sem burocracia
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <SectionHeading title="Perguntas frequentes" />
          <Accordion type="single" collapsible className="mt-10 w-full">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* 8. CTA final */}
        <section className="border-t border-border/60 bg-muted/20 py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Target className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              O Acervo Enfermeiro está organizado. As vagas do Plano Fundador não são ilimitadas.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Garanta acesso agora, com garantia de 7 dias e sem assinatura automática.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg">
                <Link to="/auth">
                  Começar agora
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            SimulaPro
          </div>
          <p className="text-xs text-muted-foreground">
            Plataforma especializada em questões oficiais para concursos de Enfermagem.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Link to="/privacidade" className="hover:text-foreground hover:underline">
              Privacidade
            </Link>
            <Link to="/termos" className="hover:text-foreground hover:underline">
              Termos
            </Link>
            <Link to="/reembolso" className="hover:text-foreground hover:underline">
              Reembolso
            </Link>
            <a
              href="mailto:suporte@simulapro.com.br"
              className="hover:text-foreground hover:underline"
            >
              Suporte
            </a>
          </nav>
          <Separator className="my-1 w-24" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SimulaPro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
