import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  BookOpen,
  ClipboardList,
  Clock,
  Filter,
  History,
  Play,
  RotateCcw,
  ShieldCheck,
  Target,
  TrendingUp,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Button, Logo as BrandLogo } from "@/components/design-system";
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
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: Landing,
});

/**
 * Paleta desta Landing — reproduzida 1:1 do arquivo aprovado no Claude
 * Design ("Landing Page.dc.html"). Onde o valor já existe na DS-001
 * (`@/styles/design-system/tokens.css`), reaproveitamos o token; onde o
 * design introduz um valor novo específico da Landing (fundo/bordas mais
 * claros que o resto do app), usamos a constante literal — são valores da
 * Landing, não tokens do Design System da aplicação autenticada.
 */
const LANDING = {
  primary: "var(--ds-color-action)", // #2563EB
  textPrimary: "var(--ds-color-primary)", // #0A1633
  textSecondary: "var(--ds-color-text-secondary)", // #64748B
  surface: "var(--ds-color-surface)", // #FFFFFF
  success: "var(--ds-color-success)",
  background: "#EEF2F6",
  surfaceSubtle: "#F2F5F9",
  border: "#E3E8EF",
  divider: "#EDF1F5",
} as const;

const fontFamily = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Estatísticas — números reais, conferidos diretamente no banco nesta
 * sprint (nenhum valor de exemplo do Claude Design foi mantido aqui: o
 * arquivo original mostrava "120.000+ Questões / 98% Satisfação", que não
 * correspondem ao Acervo real e não podiam ser reproduzidos como se
 * fossem — ver relatório da entrega).
 */
const STATS = [
  { value: "1.100+", label: "Questões" },
  { value: "22", label: "Bancas" },
  { value: "30", label: "Disciplinas" },
  { value: "100%", label: "Oficiais" },
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

const DIFFERENTIATORS = [
  {
    title: "Banca real, não genérica",
    description:
      "Questões filtradas exatamente pelo estilo de cobrança de cada banca organizadora de Enfermagem.",
  },
  {
    title: "Evolução mensurável",
    description:
      "Cada sessão mostra sua curva de progresso por disciplina, não apenas um número isolado.",
  },
  {
    title: "Foco sem distração",
    description:
      "Interface pensada para sessões longas de estudo, sem ruído visual nem gamificação.",
  },
  {
    title: "Acervo em produção contínua",
    description:
      "Novas provas passam por classificação e revisão antes de entrar no banco de questões.",
  },
];

const BENEFITS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Target,
    title: "Aprenda como a banca cobra",
    description: "Questões organizadas pelo padrão real de cada concurso de Enfermagem.",
  },
  {
    icon: TrendingUp,
    title: "Acompanhe sua evolução",
    description: "Resultados claros mostram seu progresso real por disciplina ao longo do tempo.",
  },
  {
    icon: Clock,
    title: "Estude com foco",
    description: "Um ambiente desenhado para concentração, sem distrações nem ruído visual.",
  },
  {
    icon: BookMarked,
    title: "Organize seu conteúdo",
    description: "Favoritos, Central de Revisão e Histórico em um só lugar.",
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

function jsonLd(planValue?: number, planMonths?: number) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: "SimulaPro", url: "https://simulapro.com.br" },
      { "@type": "WebSite", name: "SimulaPro", url: "https://simulapro.com.br" },
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

/* ------------------------------------------------------------------ */
/* Peças pequenas                                                       */
/* ------------------------------------------------------------------ */

/** Logo oficial da marca — `variant="dark"` (texto escuro) para fundos
 * claros, `variant="light"` (texto branco) para fundos escuros. */
function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <BrandLogo
      orientation="horizontal"
      theme={variant === "light" ? "dark" : "light"}
      className="h-[30px] w-auto"
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold tracking-[0.12em]" style={{ color: LANDING.primary }}>
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[640px] text-center ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-3.5 text-2xl font-extrabold tracking-[-0.01em] sm:text-[32px]"
        style={{ color: LANDING.textPrimary }}
      >
        {title}
      </h2>
    </div>
  );
}

/** Chrome de navegador (barra com 3 pontos) usado nos mockups do produto. */
function BrowserChrome({ label }: { label?: string }) {
  return (
    <div
      className="flex items-center gap-1.5 border-b px-3.5 py-2.5"
      style={{ background: LANDING.surfaceSubtle, borderColor: LANDING.divider }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: LANDING.border }} />
      <span className="h-2 w-2 rounded-full" style={{ background: LANDING.border }} />
      <span className="h-2 w-2 rounded-full" style={{ background: LANDING.border }} />
      {label ? (
        <span className="ml-2.5 flex items-center gap-1.5">
          <BrandLogo orientation="mark" aria-hidden="true" className="h-3.5 w-3.5" />
          <span className="text-[11px] font-semibold" style={{ color: LANDING.textSecondary }}>
            {label}
          </span>
        </span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recriações reais do produto (usadas no mockup do Hero e na           */
/* "Demonstração do sistema") — montadas com os componentes reais do    */
/* Design System (Card/Badge), não capturas de tela, mas com a mesma    */
/* aparência e dados de exemplo realistas.                              */
/* ------------------------------------------------------------------ */

function MiniDashboardPreview() {
  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: "Questões respondidas", value: "184" },
          { label: "Aproveitamento", value: "71%" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border p-2.5"
            style={{ borderColor: LANDING.border, background: LANDING.surfaceSubtle }}
          >
            <p className="text-[10px]" style={{ color: LANDING.textSecondary }}>
              {item.label}
            </p>
            <p className="text-lg font-bold tabular-nums" style={{ color: LANDING.textPrimary }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <div
        className="mt-2.5 space-y-1.5 rounded-lg border p-2.5"
        style={{ borderColor: LANDING.border, background: LANDING.surfaceSubtle }}
      >
        <div
          className="flex items-center justify-between text-[10px]"
          style={{ color: LANDING.textSecondary }}
        >
          <span>Legislação do SUS</span>
          <span className="tabular-nums">58%</span>
        </div>
        <div className="h-1.5 w-full rounded-full" style={{ background: LANDING.border }}>
          <div
            className="h-1.5 w-[58%] rounded-full"
            style={{ background: "var(--ds-color-warning)" }}
          />
        </div>
      </div>
    </div>
  );
}

function MiniStudyPreview() {
  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-1.5">
        <div
          className="flex items-center justify-between text-[10px]"
          style={{ color: LANDING.textSecondary }}
        >
          <span>Questão 6 de 20</span>
          <span>Modo Estudo</span>
        </div>
        <div className="h-1.5 w-full rounded-full" style={{ background: LANDING.border }}>
          <div className="h-1.5 w-[30%] rounded-full" style={{ background: LANDING.primary }} />
        </div>
      </div>
      <div className="mt-2.5 space-y-1.5">
        {["A", "B", "C"].map((letter, index) => (
          <div
            key={letter}
            className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[10.5px]"
            style={
              index === 1
                ? { borderColor: "var(--ds-color-success)", background: "rgba(34,197,94,0.06)" }
                : { borderColor: LANDING.border, background: LANDING.surfaceSubtle }
            }
          >
            <span
              className="grid h-4 w-4 shrink-0 place-items-center rounded text-[9px] font-bold"
              style={
                index === 1
                  ? { background: "var(--ds-color-success)", color: "#fff" }
                  : { background: LANDING.border, color: LANDING.textPrimary }
              }
            >
              {letter}
            </span>
            <span className="truncate" style={{ color: LANDING.textPrimary }}>
              Alternativa de exemplo {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniResultsPreview() {
  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Acertos", value: "14" },
          { label: "Erros", value: "6" },
          { label: "Aprov.", value: "70%" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border p-2 text-center"
            style={{ borderColor: LANDING.border, background: LANDING.surfaceSubtle }}
          >
            <p className="text-[9.5px]" style={{ color: LANDING.textSecondary }}>
              {item.label}
            </p>
            <p className="text-sm font-bold tabular-nums" style={{ color: LANDING.textPrimary }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-2.5 space-y-1.5">
        {["Administração em Enfermagem", "Saúde Coletiva"].map((name, index) => (
          <div key={name} className="flex items-center justify-between text-[10.5px]">
            <span className="truncate" style={{ color: LANDING.textSecondary }}>
              {name}
            </span>
            <span className="font-semibold tabular-nums" style={{ color: LANDING.textPrimary }}>
              {index === 0 ? "52%" : "83%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ — accordion próprio (visual do Claude Design), copy real         */
/* ------------------------------------------------------------------ */

function FaqAccordion({ items }: { items: typeof FAQ_ITEMS }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className="cursor-pointer border-b py-[22px]"
            style={{ borderColor: LANDING.divider }}
            onClick={() => setOpenIndex(isOpen ? null : index)}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-[15.5px] font-bold" style={{ color: LANDING.textPrimary }}>
                {item.question}
              </span>
              <span
                className="text-lg leading-none"
                style={{ color: LANDING.textSecondary }}
                aria-hidden="true"
              >
                {isOpen ? "–" : "+"}
              </span>
            </div>
            {isOpen ? (
              <div
                className="mt-3 max-w-[640px] text-sm leading-relaxed"
                style={{ color: LANDING.textSecondary }}
              >
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                               */
/* ------------------------------------------------------------------ */

function Landing() {
  const plan = COMMERCIAL_PLANS.find((p) => p.id === "plano-fundador") ?? COMMERCIAL_PLANS[0];
  const otherPlans = COMMERCIAL_PLANS.filter((p) => p.id !== plan?.id);
  const allPlans = plan ? [plan, ...otherPlans] : COMMERCIAL_PLANS;

  return (
    <div
      className="min-h-screen"
      style={{ background: LANDING.surface, color: LANDING.textPrimary, fontFamily }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(plan?.value, plan?.accessDurationMonths)),
        }}
      />

      {/* HEADER */}
      <header
        className="flex items-center justify-between border-b px-6 py-5 sm:px-16"
        style={{ borderColor: LANDING.divider }}
      >
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold"
              style={{ color: LANDING.textPrimary }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4.5">
          <Link to="/auth" className="text-sm font-semibold" style={{ color: LANDING.textPrimary }}>
            Entrar
          </Link>
          <Button asChild size="md">
            <Link to="/auth">Começar agora</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section
          className="px-6 pb-16 pt-16 sm:px-16 sm:pb-20 sm:pt-16 lg:pb-[88px] lg:pt-[76px]"
          style={{ background: LANDING.background }}
        >
          <div className="mx-auto flex max-w-[1312px] flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-10">
            <div className="max-w-[480px] text-center lg:flex-none lg:text-left">
              <Eyebrow>PLATAFORMA PARA APROVAÇÃO EM ENFERMAGEM</Eyebrow>
              <h1
                className="mt-4 text-[32px] font-extrabold leading-[1.14] tracking-[-0.02em] sm:text-[38px] lg:text-[44px]"
                style={{ color: LANDING.textPrimary }}
              >
                Estude Enfermagem por questões oficiais, organizadas do seu jeito.
              </h1>
              <p
                className="mx-auto mt-5 max-w-[440px] text-base leading-relaxed lg:mx-0"
                style={{ color: LANDING.textSecondary }}
              >
                Questões reais de bancas organizadoras, filtradas por disciplina e assunto, com
                acompanhamento de evolução para você saber exatamente onde estudar primeiro.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="lg">
                  <Link to="/auth">
                    Começar agora
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#como-funciona">
                    <Play className="h-3 w-3" aria-hidden="true" fill="currentColor" />
                    Ver como funciona
                  </a>
                </Button>
              </div>
              <div className="mt-10 flex items-center justify-center gap-0 overflow-x-auto lg:justify-start">
                {STATS.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="px-4 first:pl-0 sm:px-6"
                    style={
                      index < STATS.length - 1
                        ? { borderRight: `1px solid ${LANDING.border}` }
                        : undefined
                    }
                  >
                    <div
                      className="text-lg font-extrabold tracking-[-0.01em] sm:text-xl"
                      style={{ color: LANDING.textPrimary }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs font-semibold" style={{ color: LANDING.textSecondary }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full max-w-[560px] lg:h-[400px] lg:flex-1">
              <div
                className="relative w-full overflow-hidden rounded-[12px] border bg-white shadow-[0_4px_12px_rgba(10,22,51,0.06),0_24px_48px_rgba(10,22,51,0.12)] lg:absolute lg:left-0 lg:top-0 lg:w-[520px]"
                style={{ borderColor: LANDING.border }}
              >
                <BrowserChrome label="app.simulapro.com.br" />
                <div className="h-[280px] sm:h-[320px] lg:h-[347px]">
                  <MiniDashboardPreview />
                </div>
              </div>

              <div
                className="relative mt-4 ml-auto w-[220px] overflow-hidden rounded-[14px] border bg-white shadow-[0_8px_24px_rgba(10,22,51,0.14)] lg:absolute lg:right-[14px] lg:bottom-[26px] lg:mt-0"
                style={{ borderColor: LANDING.border }}
              >
                <div className="h-[196px]">
                  <MiniStudyPreview />
                </div>
                <div
                  className="absolute bottom-2.5 left-2.5 rounded-[6px] px-2.5 py-1.5 text-[10.5px] font-bold text-white"
                  style={{ background: "rgba(10,22,51,0.85)" }}
                >
                  Modo de estudo focado
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROVA SOCIAL (faixa escura) */}
        <section
          className="flex flex-col items-center justify-center gap-6 px-6 py-9 sm:px-16 lg:flex-row lg:gap-0"
          style={{ background: LANDING.textPrimary }}
        >
          <div className="flex flex-wrap items-center justify-center gap-y-4">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="px-6 text-center sm:px-11"
                style={
                  index < STATS.length - 1
                    ? { borderRight: "1px solid rgba(255,255,255,0.1)" }
                    : undefined
                }
              >
                <div className="text-2xl font-extrabold tracking-[-0.01em] text-white sm:text-[26px]">
                  {stat.value}
                </div>
                <div
                  className="mt-1 text-xs font-semibold"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {stat.label === "Questões"
                    ? "Questões organizadas"
                    : stat.label === "Bancas"
                      ? "Bancas cobertas"
                      : stat.label === "Disciplinas"
                        ? "Disciplinas mapeadas"
                        : "Questões oficiais"}
                </div>
              </div>
            ))}
          </div>
          <div
            className="max-w-xs text-center text-[13px] font-semibold lg:ml-11 lg:max-w-none lg:pl-0 lg:text-left"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Acervo em produção contínua, com classificação e revisão a cada nova prova.
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="px-6 py-16 sm:px-16 sm:py-24">
          <SectionHeading eyebrow="COMO FUNCIONA" title="Um caminho claro até a aprovação" />
          <div className="relative mx-auto mt-14 flex max-w-[1312px] flex-col gap-10 sm:grid sm:grid-cols-2 sm:gap-6 lg:flex lg:flex-row lg:justify-between">
            <div
              className="absolute top-[22px] right-11 left-11 hidden h-px lg:block"
              style={{ background: LANDING.border }}
              aria-hidden="true"
            />
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.title}
                className="relative flex flex-1 flex-col items-center px-3 text-center"
              >
                <div
                  className="relative z-[1] mb-4 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px]"
                  style={{ background: LANDING.surface, borderColor: LANDING.border }}
                >
                  <step.icon
                    className="h-[18px] w-[18px]"
                    style={{ color: LANDING.textPrimary }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-bold" style={{ color: LANDING.textPrimary }}>
                  {step.title}
                </p>
                <p
                  className="mt-1.5 text-[12.5px] leading-relaxed"
                  style={{ color: LANDING.textSecondary }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RECURSOS */}
        <section id="recursos" className="px-6 pb-16 sm:px-16 sm:pb-24">
          <SectionHeading
            eyebrow="PRINCIPAIS FUNCIONALIDADES"
            title="Tudo o que você precisa em um só lugar"
          />
          <div className="mx-auto mt-12 grid max-w-[1312px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[14px] border p-6"
                style={{ borderColor: LANDING.border, background: LANDING.surfaceSubtle }}
              >
                <div
                  className="mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-[9px] border"
                  style={{ background: LANDING.surface, borderColor: LANDING.border }}
                >
                  <feature.icon
                    className="h-[17px] w-[17px]"
                    style={{ color: LANDING.textPrimary }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[14.5px] font-bold" style={{ color: LANDING.textPrimary }}>
                  {feature.title}
                </p>
                <p
                  className="mt-1.5 text-[12.5px] leading-relaxed"
                  style={{ color: LANDING.textSecondary }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* POR QUE O SIMULAPRO */}
        <section className="px-6 pb-16 sm:px-16 sm:pb-24">
          <div
            className="mx-auto flex max-w-[1312px] flex-col gap-10 rounded-[20px] border p-8 sm:p-12 lg:flex-row lg:gap-16 lg:px-[72px] lg:py-16"
            style={{ borderColor: LANDING.border, background: LANDING.surface }}
          >
            <div className="lg:w-[360px] lg:flex-none">
              <Eyebrow>POR QUE O SIMULAPRO</Eyebrow>
              <h2
                className="mt-3.5 text-2xl font-extrabold leading-tight tracking-[-0.01em] sm:text-[28px]"
                style={{ color: LANDING.textPrimary }}
              >
                Feito para quem estuda com seriedade
              </h2>
            </div>
            <div className="flex flex-1 flex-col gap-5 sm:gap-[22px]">
              {DIFFERENTIATORS.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div
                    className="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border"
                    style={{ background: LANDING.surfaceSubtle, borderColor: LANDING.border }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path
                        d="M2.5 6.5L5 9L10.5 3.5"
                        stroke={LANDING.success}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-bold" style={{ color: LANDING.textPrimary }}>
                      {item.title}
                    </p>
                    <p
                      className="mt-0.5 text-[13.5px] leading-relaxed"
                      style={{ color: LANDING.textSecondary }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEMONSTRAÇÃO DO SISTEMA */}
        <section className="px-6 pb-16 sm:px-16 sm:pb-24">
          <SectionHeading
            eyebrow="DEMONSTRAÇÃO DO SISTEMA"
            title="A plataforma que você vai usar todos os dias"
          />
          <div className="mx-auto mt-12 grid max-w-[1312px] grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { title: "Central de preparação", Preview: MiniDashboardPreview },
              { title: "Modo de estudo focado", Preview: MiniStudyPreview },
              { title: "Diagnóstico de desempenho", Preview: MiniResultsPreview },
            ].map(({ title, Preview }) => (
              <div key={title}>
                <div
                  className="overflow-hidden rounded-[12px] border bg-white shadow-[0_4px_16px_rgba(10,22,51,0.06)]"
                  style={{ borderColor: LANDING.border }}
                >
                  <BrowserChrome />
                  <div className="h-[220px] sm:h-[240px]">
                    <Preview />
                  </div>
                </div>
                <p
                  className="mt-3.5 text-center text-[13.5px] font-bold"
                  style={{ color: LANDING.textPrimary }}
                >
                  {title}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="px-6 pb-16 sm:px-16 sm:pb-24">
          <SectionHeading eyebrow="BENEFÍCIOS" title="Resultados que você consegue medir" />
          <div className="mx-auto mt-12 grid max-w-[1312px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="px-5 py-7 text-center">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border"
                  style={{ background: LANDING.surfaceSubtle, borderColor: LANDING.border }}
                >
                  <benefit.icon
                    className="h-5 w-5"
                    style={{ color: LANDING.textPrimary }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[14.5px] font-bold" style={{ color: LANDING.textPrimary }}>
                  {benefit.title}
                </p>
                <p
                  className="mt-1.5 text-[12.5px] leading-relaxed"
                  style={{ color: LANDING.textSecondary }}
                >
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PLANOS — dados reais de @/config/commercial-plans, layout do Claude Design */}
        <section
          id="planos"
          className="px-6 pt-16 pb-16 sm:px-16 sm:pt-24 sm:pb-24"
          style={{ background: LANDING.background }}
        >
          <SectionHeading eyebrow="PLANOS" title="Escolha como quer se preparar" />
          <div
            className={`mx-auto mt-12 grid max-w-[1000px] grid-cols-1 gap-5 ${
              allPlans.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            {allPlans.map((p, index) => {
              const highlighted = index === 0;
              return (
                <div
                  key={p.id}
                  className="relative rounded-[16px] border px-7 py-8"
                  style={
                    highlighted
                      ? { background: LANDING.textPrimary, borderColor: LANDING.textPrimary }
                      : { background: LANDING.surface, borderColor: LANDING.border }
                  }
                >
                  {highlighted ? (
                    <div
                      className="absolute -top-[13px] left-7 rounded-[6px] px-3 py-1.5 text-[11px] font-bold text-white"
                      style={{ background: LANDING.primary }}
                    >
                      MAIS POPULAR
                    </div>
                  ) : null}
                  <div
                    className="text-sm font-bold"
                    style={{ color: highlighted ? "#7DA6F5" : LANDING.textSecondary }}
                  >
                    {p.label.toUpperCase()}
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span
                      className="text-[32px] font-extrabold tracking-[-0.02em]"
                      style={{ color: highlighted ? "#fff" : LANDING.textPrimary }}
                    >
                      R$ {p.value.toFixed(2).replace(".", ",")}
                    </span>
                    <span
                      className="text-[13px] font-semibold"
                      style={{
                        color: highlighted ? "rgba(255,255,255,0.55)" : LANDING.textSecondary,
                      }}
                    >
                      / {p.accessDurationMonths} {p.accessDurationMonths === 1 ? "mês" : "meses"}
                    </span>
                  </div>
                  <p
                    className="mt-1.5 text-[12.5px]"
                    style={{
                      color: highlighted ? "rgba(255,255,255,0.55)" : LANDING.textSecondary,
                    }}
                  >
                    {p.description}
                  </p>
                  <div className="mt-6 mb-[26px] flex flex-col gap-2.5">
                    {[
                      "Acesso completo ao Acervo Enfermeiro",
                      "Sem cobrança automática ao final do ciclo",
                      "Garantia incondicional de 7 dias",
                      "Suporte por e-mail",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2.5 6.5L5 9L10.5 3.5"
                            stroke={highlighted ? LANDING.primary : LANDING.success}
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span
                          className="text-[13px] font-medium"
                          style={{ color: highlighted ? "#fff" : LANDING.textPrimary }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    asChild
                    fullWidth
                    variant={highlighted ? "primary" : "outline"}
                    className={highlighted ? undefined : "border-[#E3E8EF]"}
                  >
                    <Link to="/auth">Assinar</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-[760px] px-6 py-16 sm:px-16 sm:py-24">
          <div className="mb-12 text-center">
            <Eyebrow>DÚVIDAS FREQUENTES</Eyebrow>
            <h2
              className="mt-3.5 text-2xl font-extrabold tracking-[-0.01em] sm:text-[32px]"
              style={{ color: LANDING.textPrimary }}
            >
              Perguntas frequentes
            </h2>
          </div>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        {/* CTA FINAL */}
        <section className="px-6 pb-16 sm:px-16 sm:pb-16">
          <div
            className="mx-auto max-w-[1312px] rounded-[20px] px-6 py-16 text-center sm:px-16 sm:py-[72px]"
            style={{ background: LANDING.textPrimary }}
          >
            <h2 className="text-2xl font-extrabold tracking-[-0.01em] text-white sm:text-[32px]">
              O Acervo Enfermeiro está organizado. As vagas do Plano Fundador não são ilimitadas.
            </h2>
            <p className="mt-3.5 text-[15px]" style={{ color: "rgba(255,255,255,0.6)" }}>
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

      {/* FOOTER */}
      <footer
        className="flex flex-col items-center gap-4 border-t px-6 py-8 text-center sm:flex-row sm:justify-between sm:px-16 sm:text-left"
        style={{ borderColor: LANDING.divider }}
      >
        <div className="flex flex-col items-center gap-2.5 sm:items-start">
          <Logo />
          <div className="text-[13px]" style={{ color: LANDING.textSecondary }}>
            © {new Date().getFullYear()} SimulaPro Concursos. Todos os direitos reservados.
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
          <Link
            to="/privacidade"
            className="text-[13px] font-semibold hover:underline"
            style={{ color: LANDING.textSecondary }}
          >
            Privacidade
          </Link>
          <Link
            to="/termos"
            className="text-[13px] font-semibold hover:underline"
            style={{ color: LANDING.textSecondary }}
          >
            Termos
          </Link>
          <Link
            to="/reembolso"
            className="text-[13px] font-semibold hover:underline"
            style={{ color: LANDING.textSecondary }}
          >
            Reembolso
          </Link>
          <a
            href="mailto:suporte@simulapro.com.br"
            className="text-[13px] font-semibold hover:underline"
            style={{ color: LANDING.textSecondary }}
          >
            Suporte
          </a>
        </nav>
      </footer>
    </div>
  );
}
