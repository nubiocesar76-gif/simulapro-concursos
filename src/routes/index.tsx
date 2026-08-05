import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Filter,
  LineChart,
  Play,
  RotateCcw,
  ShieldCheck,
  Target,
  TrendingUp,
  UserPlus,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button, Logo as BrandLogo } from "@/components/design-system";
import {
  buildLandingStatsDisplay,
  FALLBACK_LANDING_PLATFORM_STATS,
  getLandingPlatformStats,
} from "@/lib/landing-platform-stats.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SimulaPro — Passe no seu próximo concurso" },
      {
        name: "description",
        content:
          "Estude exatamente como a banca cobra. Milhares de questões por banca, disciplina e assunto, simulados inteligentes e estatísticas de desempenho. Teste gratuitamente.",
      },
      {
        property: "og:title",
        content: "SimulaPro — Passe no seu próximo concurso",
      },
      {
        property: "og:description",
        content:
          "Questões organizadas por banca, simulados completos e revisão automática. Crie sua conta gratuitamente — sem cartão de crédito.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "SimulaPro — Passe no seu próximo concurso",
      },
      {
        name: "twitter:description",
        content:
          "Estude como a banca cobra. Teste a plataforma gratuitamente — sem cartão, acesso imediato.",
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

/** Microinterações premium — escopo exclusivo da Landing Page. */
const LANDING_CARD =
  "landing-card-hover rounded-[16px] border transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(10,22,51,0.09)]";
const LANDING_SECTION = "landing-fade-in";
const LANDING_PLAN_CARD =
  "landing-card-hover relative flex h-full flex-col rounded-[16px] border px-7 py-8 transition-all duration-300 ease-out hover:-translate-y-1";
const LANDING_PLAN_CARD_HIGHLIGHTED =
  "landing-card-hover relative z-10 flex h-full flex-col rounded-[16px] border px-7 py-8 transition-all duration-300 ease-out hover:-translate-y-1.5";

const HERO_TRUST = ["Teste gratuitamente", "Sem cartão de crédito", "Acesso imediato"];

const GROWTH_PROOF = [
  "Novas questões adicionadas toda semana",
  "Novos concursos disponíveis regularmente",
  "Atualizações incluídas na assinatura",
  "Plataforma em evolução constante",
];

const PRODUCT_DIFFERENTIATORS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Filter,
    title: "Estude como a banca cobra",
    description: "Questões organizadas pelo padrão real de cada banca — como cai na prova.",
  },
  {
    icon: BarChart3,
    title: "Saiba exatamente onde melhorar",
    description: "Estatísticas por disciplina mostram onde investir seu tempo de estudo.",
  },
  {
    icon: BookOpen,
    title: "Questões inéditas produzidas editorialmente",
    description: "Conteúdo original classificado e revisado pela equipe SimulaPro.",
  },
  {
    icon: RotateCcw,
    title: "Novos concursos adicionados continuamente",
    description: "O catálogo cresce sem que você precise contratar um novo plano.",
  },
];

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
];

const HOW_IT_WORKS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: UserPlus,
    title: "Criar conta",
    description: "Cadastro rápido com e-mail. Sem pagamento, sem cartão.",
  },
  {
    icon: Play,
    title: "Teste gratuito",
    description: "Explore questões, simulados e estatísticas antes de assinar.",
  },
  {
    icon: BookOpen,
    title: "Escolha o concurso",
    description: "Após o login, selecione o concurso que deseja estudar.",
  },
  {
    icon: ShieldCheck,
    title: "Assine quando quiser",
    description: "Um único plano dá acesso a todos os concursos disponíveis.",
  },
  {
    icon: Target,
    title: "Estude",
    description: "Questões por banca, disciplina e assunto — no seu ritmo.",
  },
  {
    icon: TrendingUp,
    title: "Acompanhe sua evolução",
    description: "Estatísticas claras mostram onde focar para acelerar a aprovação.",
  },
];

const DEMO_BENEFITS = ["Sem cartão de crédito", "Acesso imediato", "Sem compromisso"];

const PLANS_FOOTNOTE =
  "Sua assinatura dá acesso a todos os concursos disponíveis durante o período contratado. Novos concursos serão adicionados continuamente sem necessidade de contratar um novo plano.";

const PLAN_COLUMN_GRID = "minmax(0, 1.15fr) repeat(3, minmax(0, 1fr))";

type LandingPlan = {
  id: string;
  label: string;
  subtitle: string;
  value: number;
  periodLabel?: string;
  benefits: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  savingsLabel?: string;
  upgradeCopy?: string;
};

const LANDING_PLANS: LandingPlan[] = [
  {
    id: "demonstracao",
    label: "Plano Gratuito",
    subtitle: "Experimente gratuitamente antes de decidir.",
    upgradeCopy: "Ideal para conhecer a plataforma antes de assinar.",
    value: 0,
    benefits: [
      "Não precisa cartão",
      "Conheça toda a experiência",
      "Descubra como funciona a plataforma",
    ],
    cta: "Criar conta gratuita",
  },
  {
    id: "plano-mensal",
    label: "Plano Mensal",
    subtitle: "O caminho mais escolhido para quem quer começar agora.",
    value: 39.9,
    periodLabel: "mês",
    highlighted: true,
    badge: "MAIS ESCOLHIDO",
    benefits: [
      "Todos os concursos disponíveis",
      "Simulados ilimitados",
      "Estatísticas avançadas",
      "Atualizações constantes",
    ],
    cta: "Assinar agora",
  },
  {
    id: "plano-fundador",
    label: "Plano Semestral",
    subtitle: "Estude com tranquilidade por 6 meses inteiros.",
    value: 149.9,
    periodLabel: "6 meses",
    badge: "MELHOR ECONOMIA",
    savingsLabel: "ECONOMIZE R$ 89,50",
    benefits: [
      "Tudo do Plano Mensal",
      "6 meses de acesso completo",
      "Todos os concursos disponíveis",
      "Garantia de 7 dias",
      "Suporte por e-mail",
    ],
    cta: "Assinar plano semestral",
  },
];

const PLAN_COMPARISON_ROWS: Array<{
  feature: string;
  free: string;
  monthly: string;
  semestral: string;
}> = [
  { feature: "Questões", free: "Demonstração", monthly: "Ilimitadas", semestral: "Ilimitadas" },
  { feature: "Simulados", free: "Limitados", monthly: "Ilimitados", semestral: "Ilimitados" },
  { feature: "Estatísticas", free: "Básicas", monthly: "Avançadas", semestral: "Avançadas" },
  { feature: "Histórico", free: "—", monthly: "✓", semestral: "✓" },
  { feature: "Revisão", free: "—", monthly: "✓", semestral: "✓" },
  { feature: "Favoritos", free: "—", monthly: "✓", semestral: "✓" },
  { feature: "Todos os concursos", free: "—", monthly: "✓", semestral: "✓" },
  { feature: "Atualizações", free: "—", monthly: "✓", semestral: "✓" },
  { feature: "Suporte", free: "—", monthly: "—", semestral: "E-mail" },
  { feature: "Garantia", free: "—", monthly: "—", semestral: "7 dias" },
];

const FAQ_ITEMS = [
  {
    question: "Posso testar antes de assinar?",
    answer:
      "Sim. Crie sua conta gratuitamente e explore questões, simulados e estatísticas básicas — sem cartão de crédito e sem compromisso.",
  },
  {
    question: "Preciso cadastrar cartão?",
    answer:
      "Não para o plano gratuito. O cartão só é solicitado quando você decide assinar um plano pago.",
  },
  {
    question: "O plano funciona no celular?",
    answer:
      "Sim. A plataforma funciona no navegador do celular, tablet e computador — estude de onde estiver.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "Você paga uma única vez pelo ciclo contratado (mensal ou semestral). Não há cobrança automática — ao final do período, você decide se renova.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Como não há assinatura recorrente automática, seu acesso simplesmente não é renovado se você não quiser continuar. Reembolso disponível nos primeiros 7 dias.",
  },
  {
    question: "Novos concursos entram automaticamente no meu plano?",
    answer:
      "Sim. Durante sua assinatura, você terá acesso aos novos concursos disponibilizados para sua modalidade, sem necessidade de contratar um novo plano.",
  },
  {
    question: "Posso trocar de concurso quando quiser?",
    answer:
      "Sim. Você pode estudar qualquer concurso disponível na plataforma incluído em sua assinatura.",
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
        name: "SimulaPro — Plataforma de questões para concursos públicos",
        description:
          "Acesso à plataforma SimulaPro com questões oficiais organizadas por banca, disciplina e assunto, simulados completos e estatísticas de desempenho.",
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

function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: LANDING.textPrimary }}>
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path
          d="M2.5 6.5L5 9L10.5 3.5"
          stroke={LANDING.success}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </span>
  );
}

function useAnimatedNumber(target: number, durationMs = 1800, delayMs = 400) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    let frame = 0;
    let start: number | null = null;
    const timeout = window.setTimeout(() => {
      const step = (timestamp: number) => {
        if (start === null) start = timestamp;
        const progress = Math.min((timestamp - start) / durationMs, 1);
        const eased = 1 - (1 - progress) ** 3;
        setValue(Math.round(target * eased));
        if (progress < 1) frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    }, delayMs);
    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [target, durationMs, delayMs]);

  return value;
}

function GrowthProofBand() {
  return (
    <div
      className={`${LANDING_CARD} mx-auto max-w-[980px] px-6 py-8 sm:px-10 sm:py-10`}
      style={{
        borderColor: LANDING.border,
        background: LANDING.surface,
        boxShadow: "0 8px 32px rgba(10,22,51,0.06)",
      }}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold"
          style={{ borderColor: "rgba(34,197,94,0.35)", background: "rgba(34,197,94,0.08)", color: LANDING.textPrimary }}
        >
          <span
            className="landing-pulse-dot h-2 w-2 shrink-0 rounded-full"
            style={{ background: LANDING.success }}
            aria-hidden="true"
          />
          Plataforma em crescimento contínuo
        </span>
      </div>
      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {GROWTH_PROOF.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2.5 rounded-[10px] px-3 py-2.5"
            style={{ background: LANDING.surfaceSubtle }}
          >
            <svg width="14" height="14" viewBox="0 0 13 13" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
              <path
                d="M2.5 6.5L5 9L10.5 3.5"
                stroke={LANDING.success}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[13px] font-semibold leading-snug" style={{ color: LANDING.textPrimary }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
function PremiumStatsBand({ stats }: { stats: ReturnType<typeof buildLandingStatsDisplay> }) {
  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${LANDING_CARD} px-5 py-6 text-center`}
          style={{ borderColor: LANDING.border, background: LANDING.surface }}
        >
          <div
            className="text-2xl font-extrabold tracking-[-0.02em] sm:text-[28px]"
            style={{ color: LANDING.textPrimary }}
          >
            {stat.value}
          </div>
          <div className="mt-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: LANDING.textSecondary }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
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
  subtitle,
  className = "",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[640px] text-center ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-4 text-2xl font-extrabold tracking-[-0.01em] sm:text-[32px]"
        style={{ color: LANDING.textPrimary }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-[520px] text-base leading-relaxed" style={{ color: LANDING.textSecondary }}>
          {subtitle}
        </p>
      ) : null}
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

function MiniDashboardPreview({ animated = false }: { animated?: boolean }) {
  const disciplines = [
    { name: "Legislação do SUS", pct: 58, delay: "0.6s" },
    { name: "Ética Profissional", pct: 83, delay: "0.9s" },
    { name: "Saúde Coletiva", pct: 71, delay: "1.2s" },
  ];
  const animatedQuestions = useAnimatedNumber(184, 1800, 300);
  const animatedPct = useAnimatedNumber(71, 1600, 500);

  return (
    <div className="flex h-full flex-col gap-2.5 p-3.5">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Questões", value: animated ? String(animatedQuestions) : "184" },
          { label: "Aproveit.", value: animated ? `${animatedPct}%` : "71%" },
          { label: "Simulados", value: "12" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border px-2 py-2"
            style={{ borderColor: LANDING.border, background: LANDING.surfaceSubtle }}
          >
            <p className="text-[9px] font-medium" style={{ color: LANDING.textSecondary }}>
              {item.label}
            </p>
            <p className="text-sm font-bold tabular-nums" style={{ color: LANDING.textPrimary }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <div
        className="rounded-lg border p-2.5"
        style={{ borderColor: LANDING.border, background: LANDING.surfaceSubtle }}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[9px] font-semibold" style={{ color: LANDING.textSecondary }}>
            <LineChart className="h-3 w-3" aria-hidden="true" />
            Evolução semanal
          </span>
          <span className="text-[9px] font-bold tabular-nums" style={{ color: LANDING.success }}>
            +12%
          </span>
        </div>
        <svg viewBox="0 0 200 48" className="h-10 w-full" aria-hidden="true">
          <polyline
            className={animated ? "landing-chart-line" : undefined}
            fill="none"
            stroke="var(--ds-color-action)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="0,38 28,32 56,34 84,24 112,26 140,16 168,18 200,8"
          />
          <polyline
            className={animated ? "landing-chart-area" : undefined}
            fill="rgba(37,99,235,0.08)"
            stroke="none"
            points="0,48 0,38 28,32 56,34 84,24 112,26 140,16 168,18 200,8 200,48"
          />
        </svg>
      </div>
      <div className="flex-1 space-y-1.5">
        {disciplines.map((d) => (
          <div key={d.name}>
            <div className="flex items-center justify-between text-[9px]" style={{ color: LANDING.textSecondary }}>
              <span className="truncate">{d.name}</span>
              <span className="font-semibold tabular-nums">{d.pct}%</span>
            </div>
            <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full" style={{ background: LANDING.border }}>
              <div
                className={animated ? "landing-progress-bar h-1 rounded-full" : "h-1 rounded-full"}
                style={{
                  width: animated ? undefined : `${d.pct}%`,
                  ["--landing-bar-width" as string]: `${d.pct}%`,
                  animationDelay: animated ? d.delay : undefined,
                  background: d.pct >= 70 ? LANDING.success : "var(--ds-color-warning)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniStudyPreview({ animated = false }: { animated?: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between p-3.5">
      <div className="space-y-1.5">
        <div
          className="flex items-center justify-between text-[10px]"
          style={{ color: LANDING.textSecondary }}
        >
          <span>Questão 6 de 20</span>
          <span className="flex items-center gap-1 font-semibold" style={{ color: LANDING.primary }}>
            <Zap className="h-3 w-3" aria-hidden="true" />
            Modo Estudo
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: LANDING.border }}>
          <div
            className={animated ? "landing-session-progress h-1.5 rounded-full" : "h-1.5 w-[30%] rounded-full"}
            style={{ background: LANDING.primary }}
          />
        </div>
        <p className="text-[10px] font-medium leading-snug" style={{ color: LANDING.textPrimary }}>
          Qual princípio do SUS garante atendimento integral ao cidadão?
        </p>
      </div>
      <div className="space-y-1.5">
        {["A", "B", "C"].map((letter, index) => (
          <div
            key={letter}
            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[10px] ${animated && index === 1 ? "landing-answer-highlight" : ""}`}
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
              {index === 0 ? "Universalidade" : index === 1 ? "Integralidade" : "Equidade"}
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
        {["Legislação do SUS", "Ética Profissional"].map((name, index) => (
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

const PLAN_CHECK_ICON = (highlighted: boolean) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path
      d="M2.5 6.5L5 9L10.5 3.5"
      stroke={highlighted ? LANDING.primary : LANDING.success}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function PlanComparisonCell({ value }: { value: string }) {
  if (value === "✓") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 13 13"
        fill="none"
        aria-hidden="true"
        className="mx-auto"
      >
        <path
          d="M2.5 6.5L5 9L10.5 3.5"
          stroke={LANDING.success}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (value === "—") {
    return (
      <span className="text-[13px] font-medium" style={{ color: LANDING.textSecondary }}>
        —
      </span>
    );
  }
  return (
    <span className="text-[12px] font-medium leading-snug" style={{ color: LANDING.textPrimary }}>
      {value}
    </span>
  );
}

const MONTHLY_COMPARISON_COL = {
  background: "rgba(37,99,235,0.06)",
  boxShadow: "inset 0 0 0 1px rgba(37,99,235,0.18)",
} as const;

function PlanComparisonTable({ embedded = false }: { embedded?: boolean }) {
  const tableBody = (
    <>
      <div
        className="grid border-b"
        style={{
          gridTemplateColumns: PLAN_COLUMN_GRID,
          borderColor: LANDING.divider,
        }}
      >
        <div className="hidden px-5 py-4 md:block" aria-hidden="true" />
        <div className="flex items-end justify-center px-4 py-4 text-center md:px-5">
          <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: LANDING.textSecondary }}>
            Gratuito
          </span>
        </div>
        <div
          className="flex flex-col items-center justify-end px-4 py-4 text-center md:px-5"
          style={MONTHLY_COMPARISON_COL}
        >
          <span
            className="mb-1.5 inline-block rounded-[5px] px-2 py-0.5 text-[8px] font-bold tracking-wide text-white uppercase"
            style={{ background: LANDING.primary }}
          >
            Mais escolhido
          </span>
          <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: LANDING.primary }}>
            Mensal
          </span>
        </div>
        <div className="flex items-end justify-center px-4 py-4 text-center md:px-5">
          <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: LANDING.textSecondary }}>
            Semestral
          </span>
        </div>
      </div>

      {PLAN_COMPARISON_ROWS.map((row, index) => (
        <div
          key={row.feature}
          className="grid"
          style={{
            gridTemplateColumns: PLAN_COLUMN_GRID,
            borderBottom: index < PLAN_COMPARISON_ROWS.length - 1 ? `1px solid ${LANDING.divider}` : undefined,
          }}
        >
          <div
            className="hidden items-center px-5 py-3.5 text-[12.5px] font-semibold md:flex"
            style={{ color: LANDING.textPrimary }}
          >
            {row.feature}
          </div>
          <div className="flex items-center justify-center px-4 py-3.5 text-center md:px-5">
            <PlanComparisonCell value={row.free} />
          </div>
          <div className="flex items-center justify-center px-4 py-3.5 text-center md:px-5" style={MONTHLY_COMPARISON_COL}>
            <PlanComparisonCell value={row.monthly} />
          </div>
          <div className="flex items-center justify-center px-4 py-3.5 text-center md:px-5">
            <PlanComparisonCell value={row.semestral} />
          </div>
        </div>
      ))}
    </>
  );

  if (embedded) {
    return (
      <>
        <div className="hidden md:block">{tableBody}</div>
        <PlanComparisonMobile />
      </>
    );
  }

  return (
    <>
      <div
        className="hidden w-full rounded-[16px] border md:block"
        style={{ borderColor: LANDING.border, background: LANDING.surface }}
      >
        {tableBody}
      </div>
      <PlanComparisonMobile />
    </>
  );
}

function PlanComparisonMobile() {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {[
        { key: "free", label: "Gratuito", badge: null as string | null, getValue: (row: (typeof PLAN_COMPARISON_ROWS)[number]) => row.free },
        {
          key: "monthly",
          label: "Mensal",
          badge: "MAIS ESCOLHIDO",
          getValue: (row: (typeof PLAN_COMPARISON_ROWS)[number]) => row.monthly,
        },
        {
          key: "semestral",
          label: "Semestral",
          badge: "MELHOR ECONOMIA",
          getValue: (row: (typeof PLAN_COMPARISON_ROWS)[number]) => row.semestral,
        },
      ].map((plan) => (
        <div
          key={plan.key}
          className="rounded-[14px] border px-5 py-5"
          style={{
            borderColor: plan.key === "monthly" ? "rgba(37,99,235,0.25)" : LANDING.border,
            background: plan.key === "monthly" ? "rgba(37,99,235,0.04)" : LANDING.surface,
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            {plan.badge ? (
              <span
                className="rounded-[5px] px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase"
                style={{ background: LANDING.primary }}
              >
                {plan.badge}
              </span>
            ) : null}
            <span className="text-[14px] font-bold" style={{ color: LANDING.textPrimary }}>
              {plan.label}
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {PLAN_COMPARISON_ROWS.map((row) => (
              <div key={row.feature} className="flex items-center justify-between gap-3 text-[13px]">
                <span className="font-medium" style={{ color: LANDING.textSecondary }}>
                  {row.feature}
                </span>
                <PlanComparisonCell value={plan.getValue(row)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PlanGuaranteeBlock() {
  return (
    <div
      className="mx-auto flex max-w-[640px] flex-col items-center gap-3 rounded-[12px] border px-6 py-5 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left"
      style={{ borderColor: LANDING.border, background: LANDING.surfaceSubtle }}
    >
      <ShieldCheck
        className="h-5 w-5 shrink-0"
        style={{ color: LANDING.textSecondary }}
        aria-hidden="true"
      />
      <div>
        <p className="text-[14px] font-bold" style={{ color: LANDING.textPrimary }}>
          Garantia incondicional de 7 dias
        </p>
        <p className="mt-1 text-[13px] leading-relaxed" style={{ color: LANDING.textSecondary }}>
          Experimente o SimulaPro sem risco. Se não fizer sentido para você, devolvemos seu dinheiro.
        </p>
      </div>
    </div>
  );
}

function PlansPricingBlock() {
  return (
    <div
      className="overflow-hidden rounded-[16px] border"
      style={{ borderColor: LANDING.border, background: LANDING.surface }}
    >
      <div className="hidden md:grid" style={{ gridTemplateColumns: PLAN_COLUMN_GRID }}>
        <div aria-hidden="true" />
        {LANDING_PLANS.map((plan, index) => (
          <LandingPlanCard
            key={plan.id}
            plan={plan}
            connected
            showDivider={index < LANDING_PLANS.length - 1}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4 p-4 md:hidden">
        {LANDING_PLANS.map((plan) => (
          <LandingPlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <div className="border-t" style={{ borderColor: LANDING.divider }}>
        <PlanComparisonTable embedded />
      </div>
    </div>
  );
}

function LandingPlanCard({
  plan,
  connected = false,
  showDivider = false,
}: {
  plan: LandingPlan;
  connected?: boolean;
  showDivider?: boolean;
}) {
  const highlighted = plan.highlighted === true;
  const isFree = plan.value === 0;
  const isSemestral = plan.id === "plano-fundador";
  const badgeText = plan.badge ?? (isFree ? "GRÁTIS" : undefined);
  const cardClass = `${highlighted ? LANDING_PLAN_CARD_HIGHLIGHTED : LANDING_PLAN_CARD}${connected ? " !rounded-none" : ""}`;

  return (
    <div
      className={cardClass}
      style={{
        ...(highlighted
          ? {
              background: LANDING.textPrimary,
              borderColor: connected ? "transparent" : LANDING.textPrimary,
              boxShadow: connected ? "none" : "0 20px 48px rgba(10,22,51,0.28), 0 0 0 1px rgba(37,99,235,0.15)",
            }
          : isFree
            ? {
                background: LANDING.surface,
                borderColor: connected ? "transparent" : LANDING.primary,
                boxShadow: connected ? "none" : "0 8px 24px rgba(37,99,235,0.10)",
              }
            : {
                background: LANDING.surface,
                borderColor: connected ? "transparent" : LANDING.border,
              }),
        ...(connected && showDivider ? { borderRight: `1px solid ${LANDING.divider}` } : {}),
      }}
    >
      {badgeText ? (
        <div
          className={`absolute left-7 rounded-[6px] px-3 py-1.5 text-[11px] font-bold text-white ${highlighted ? "-top-3.5 text-[11px] tracking-wide" : "-top-[13px]"}`}
          style={{
            background: LANDING.primary,
            boxShadow: highlighted ? "0 4px 12px rgba(37,99,235,0.45)" : undefined,
          }}
        >
          {badgeText}
        </div>
      ) : null}

      {/* Título */}
      <div
        className="min-h-[20px] text-sm font-bold"
        style={{ color: highlighted ? "#7DA6F5" : LANDING.textSecondary }}
      >
        {plan.label.toUpperCase()}
      </div>

      {/* Economia — semestral em destaque antes do preço */}
      <div className="mt-3 min-h-[32px]">
        {plan.savingsLabel ? (
          <div
            className="inline-block rounded-[6px] px-3 py-1.5 text-[12px] font-extrabold tracking-wide uppercase"
            style={{
              background: isSemestral ? "rgba(34,197,94,0.12)" : "rgba(37,99,235,0.1)",
              color: isSemestral ? LANDING.success : LANDING.primary,
            }}
          >
            {plan.savingsLabel}
          </div>
        ) : null}
      </div>

      {/* Preço */}
      <div className="mt-2 flex min-h-[40px] items-baseline gap-1.5">
        <span
          className={`font-extrabold tracking-[-0.02em] ${isSemestral ? "text-[26px]" : "text-[32px]"}`}
          style={{ color: highlighted ? "#fff" : LANDING.textPrimary }}
        >
          R$ {plan.value.toFixed(2).replace(".", ",")}
        </span>
        {plan.periodLabel ? (
          <span
            className="text-[13px] font-semibold"
            style={{
              color: highlighted ? "rgba(255,255,255,0.55)" : LANDING.textSecondary,
            }}
          >
            / {plan.periodLabel}
          </span>
        ) : null}
      </div>

      {/* Descrição + copy de upgrade */}
      <div className="mt-2 min-h-[52px]">
        <p
          className="text-[12.5px] leading-snug"
          style={{
            color: highlighted ? "rgba(255,255,255,0.55)" : LANDING.textSecondary,
          }}
        >
          {plan.subtitle}
        </p>
        {plan.upgradeCopy ? (
          <p
            className="mt-1.5 text-[11.5px] leading-snug"
            style={{ color: highlighted ? "rgba(255,255,255,0.45)" : LANDING.textSecondary }}
          >
            {plan.upgradeCopy}
          </p>
        ) : null}
      </div>

      {/* Benefícios — altura fixa para alinhar botões */}
      <div className="mt-5 flex min-h-[132px] flex-1 flex-col gap-2.5">
        {plan.benefits.map((item) => (
          <div key={item} className="flex items-center gap-2">
            {PLAN_CHECK_ICON(highlighted)}
            <span
              className="text-[13px] font-medium leading-snug"
              style={{ color: highlighted ? "#fff" : LANDING.textPrimary }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Botão — mesma linha em todos os cards */}
      <div className="mt-auto pt-5">
        <Button
          asChild
          fullWidth
          variant={highlighted || isFree ? "primary" : "outline"}
          className={`${highlighted || isFree ? "" : "border-[#E3E8EF]"} transition-transform duration-150 hover:scale-[1.01]`}
        >
          <Link to="/auth">{plan.cta}</Link>
        </Button>
      </div>
    </div>
  );
}

function Landing() {
  const monthlyPlan = LANDING_PLANS.find((p) => p.id === "plano-mensal");
  const { data: platformStats } = useQuery({
    queryKey: ["landing-platform-stats"],
    queryFn: () => getLandingPlatformStats(),
    staleTime: 5 * 60 * 1000,
  });
  const stats = buildLandingStatsDisplay(platformStats ?? FALLBACK_LANDING_PLATFORM_STATS);

  return (
    <div
      className="min-h-screen"
      style={{ background: LANDING.surface, color: LANDING.textPrimary, fontFamily }}
    >
      <style>{`
        @keyframes landingFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes landingDrawLine {
          from { stroke-dashoffset: 280; opacity: 0.4; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes landingFillArea {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes landingProgressFill {
          from { width: 0; }
          to { width: var(--landing-bar-width); }
        }
        @keyframes landingSessionProgress {
          from { width: 0; }
          to { width: 30%; }
        }
        @keyframes landingAnswerPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
          50% { box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
        }
        @keyframes landingPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(0.85); }
        }
        .landing-fade-in { animation: landingFadeIn 0.75s ease-out both; }
        .landing-card-hover:hover { box-shadow: 0 16px 40px rgba(10,22,51,0.09); }
        .landing-chart-line {
          stroke-dasharray: 280;
          stroke-dashoffset: 280;
          animation: landingDrawLine 2.2s ease-out 0.3s forwards;
        }
        .landing-chart-area { animation: landingFillArea 1.8s ease-out 1.2s forwards; opacity: 0; }
        .landing-progress-bar {
          width: 0;
          animation: landingProgressFill 1.4s ease-out forwards;
        }
        .landing-session-progress { animation: landingSessionProgress 1.6s ease-out 0.5s forwards; width: 0; }
        .landing-answer-highlight { animation: landingAnswerPulse 2.4s ease-in-out 1.8s infinite; }
        .landing-pulse-dot { animation: landingPulseDot 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .landing-fade-in, .landing-chart-line, .landing-chart-area,
          .landing-progress-bar, .landing-session-progress, .landing-answer-highlight,
          .landing-pulse-dot { animation: none !important; }
          .landing-progress-bar { width: var(--landing-bar-width) !important; }
          .landing-session-progress { width: 30% !important; }
        }
      `}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd(monthlyPlan?.value, monthlyPlan?.periodLabel === "mês" ? 1 : undefined),
          ),
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
          <Button asChild size="md" className="transition-transform duration-150 hover:scale-[1.02]">
            <Link to="/auth">Começar gratuitamente</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section
          className={`${LANDING_SECTION} px-6 pb-12 pt-16 sm:px-16 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-[76px]`}
          style={{ background: LANDING.background }}
        >
          <div className="mx-auto flex max-w-[1312px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-14">
            <div className="max-w-[520px] text-center lg:flex-none lg:text-left">
              <Eyebrow>PREPARAÇÃO PARA APROVAÇÃO</Eyebrow>
              <h1
                className="mt-4 text-[32px] font-extrabold leading-[1.14] tracking-[-0.02em] sm:text-[38px] lg:text-[44px]"
                style={{ color: LANDING.textPrimary }}
              >
                Passe no seu próximo concurso estudando exatamente como a banca cobra.
              </h1>
              <p
                className="mx-auto mt-6 max-w-[480px] text-base leading-[1.7] lg:mx-0"
                style={{ color: LANDING.textSecondary }}
              >
                <span className="font-semibold" style={{ color: LANDING.textPrimary }}>
                  Estude exatamente como a banca cobra.
                </span>{" "}
                Milhares de questões organizadas por banca, disciplina e assunto, com simulados
                inteligentes, estatísticas de desempenho e revisão automática para acelerar sua
                aprovação.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
                {HERO_TRUST.map((item) => (
                  <TrustPill key={item}>{item}</TrustPill>
                ))}
              </div>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="lg" className="transition-transform duration-150 hover:scale-[1.02]">
                  <Link to="/auth">
                    Começar gratuitamente
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="transition-transform duration-150 hover:scale-[1.02]">
                  <a href="#demonstracao">
                    <Play className="h-3 w-3" aria-hidden="true" fill="currentColor" />
                    Ver demonstração
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative w-full max-w-[580px] lg:h-[420px] lg:flex-1">
              <div
                className="relative w-full overflow-hidden rounded-[14px] border bg-white shadow-[0_4px_12px_rgba(10,22,51,0.06),0_24px_48px_rgba(10,22,51,0.12)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(10,22,51,0.14)] lg:absolute lg:left-0 lg:top-0 lg:w-[540px]"
                style={{ borderColor: LANDING.border }}
              >
                <BrowserChrome label="app.simulapro.com.br" />
                <div className="h-[300px] sm:h-[340px] lg:h-[360px]">
                  <MiniDashboardPreview animated />
                </div>
              </div>

              <div
                className="relative mt-4 ml-auto w-[240px] overflow-hidden rounded-[14px] border bg-white shadow-[0_8px_24px_rgba(10,22,51,0.14)] transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(10,22,51,0.18)] lg:absolute lg:right-0 lg:bottom-[20px] lg:mt-0"
                style={{ borderColor: LANDING.border }}
              >
                <div className="h-[210px]">
                  <MiniStudyPreview animated />
                </div>
                <div
                  className="absolute bottom-2.5 left-2.5 rounded-[6px] px-2.5 py-1.5 text-[10.5px] font-bold text-white"
                  style={{ background: "rgba(10,22,51,0.85)" }}
                >
                  Questão em andamento
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ESTATÍSTICAS — faixa premium */}
        <section className={`${LANDING_SECTION} px-6 py-16 sm:px-16 sm:py-20`} style={{ background: LANDING.surface }}>
          <PremiumStatsBand stats={stats} />
        </section>

        {/* PROVA SOCIAL — crescimento contínuo */}
        <section
          className={`${LANDING_SECTION} px-6 py-14 sm:px-16 sm:py-16`}
          style={{ background: LANDING.surfaceSubtle, borderTop: `1px solid ${LANDING.divider}`, borderBottom: `1px solid ${LANDING.divider}` }}
        >
          <GrowthProofBand />
        </section>

        {/* DEMONSTRAÇÃO GRATUITA */}
        <section
          id="demonstracao"
          className={`${LANDING_SECTION} px-6 py-24 sm:px-16 sm:py-32`}
          style={{ background: LANDING.background }}
        >
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>EXPERIMENTE GRÁTIS</Eyebrow>
              <h2
                className="mt-3.5 text-2xl font-extrabold tracking-[-0.01em] sm:text-[32px]"
                style={{ color: LANDING.textPrimary }}
              >
                Teste antes de decidir.
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: LANDING.textSecondary }}>
                Crie sua conta gratuitamente e conheça a plataforma antes de assinar.
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {DEMO_BENEFITS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    {PLAN_CHECK_ICON(false)}
                    <span className="text-[14px] font-medium" style={{ color: LANDING.textPrimary }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild size="lg" className="transition-transform duration-150 hover:scale-[1.02]">
                  <Link to="/auth">
                    Criar conta gratuita
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
            <div
              className={`${LANDING_CARD} overflow-hidden`}
              style={{ borderColor: LANDING.border, background: LANDING.surface }}
            >
              <BrowserChrome label="app.simulapro.com.br" />
              <div className="h-[280px] sm:h-[320px]">
                <MiniDashboardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* DEMONSTRAÇÃO DA PLATAFORMA */}
        <section id="recursos" className={`${LANDING_SECTION} px-6 pb-24 sm:px-16 sm:pb-32`}>
          <SectionHeading
            eyebrow="A PLATAFORMA"
            title="Tudo o que você precisa para estudar e ser aprovado."
          />
          <div className="mx-auto mt-16 grid max-w-[1312px] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-8">
            {[
              {
                title: "Central de preparação",
                description: "Visão geral do seu progresso, evolução e pontos de melhoria.",
                Preview: MiniDashboardPreview,
              },
              {
                title: "Estudo focado",
                description: "Resolva questões com feedback imediato e acompanhe seu ritmo.",
                Preview: MiniStudyPreview,
              },
              {
                title: "Diagnóstico inteligente",
                description: "Estatísticas por disciplina para saber onde investir seu tempo.",
                Preview: MiniResultsPreview,
              },
            ].map(({ title, description, Preview }) => (
              <div key={title} className={`${LANDING_CARD} overflow-hidden`} style={{ borderColor: LANDING.border, background: LANDING.surface }}>
                <BrowserChrome />
                <div className="h-[220px] sm:h-[240px]">
                  <Preview />
                </div>
                <div className="border-t px-5 py-5" style={{ borderColor: LANDING.divider }}>
                  <p className="text-[14px] font-bold" style={{ color: LANDING.textPrimary }}>
                    {title}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: LANDING.textSecondary }}>
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA — timeline horizontal */}
        <section id="como-funciona" className={`${LANDING_SECTION} px-6 py-24 sm:px-16 sm:py-32`} style={{ background: LANDING.surfaceSubtle }}>
          <SectionHeading eyebrow="COMO FUNCIONA" title="Um caminho claro até a aprovação" />
          <div className="relative mx-auto mt-20 max-w-[1312px]">
            <div
              className="absolute top-[28px] right-8 left-8 hidden h-px lg:block"
              style={{ background: LANDING.border }}
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.title} className="relative flex flex-col items-center px-2 text-center">
                  <div
                    className="relative z-[1] mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2"
                    style={{ background: LANDING.surface, borderColor: LANDING.primary }}
                  >
                    <step.icon
                      className="h-6 w-6"
                      style={{ color: LANDING.primary }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-sm font-bold" style={{ color: LANDING.textPrimary }}>
                    {step.title}
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed" style={{ color: LANDING.textSecondary }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POR QUE É DIFERENTE — vender produto antes do preço */}
        <section className={`${LANDING_SECTION} px-6 py-24 sm:px-16 sm:py-32`} style={{ background: LANDING.surface }}>
          <SectionHeading eyebrow="DIFERENCIAIS" title="Por que o SimulaPro é diferente?" />
          <div className="mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-7">
            {PRODUCT_DIFFERENTIATORS.map((item) => (
              <div
                key={item.title}
                className={`${LANDING_CARD} p-8`}
                style={{ borderColor: LANDING.border, background: LANDING.surfaceSubtle }}
              >
                <div
                  className="mb-5 flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border"
                  style={{ background: LANDING.surface, borderColor: LANDING.border }}
                >
                  <item.icon
                    className="h-[19px] w-[19px]"
                    style={{ color: LANDING.primary }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[16px] font-bold leading-snug" style={{ color: LANDING.textPrimary }}>
                  {item.title}
                </p>
                <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: LANDING.textSecondary }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PLANOS */}
        <section
          id="planos"
          className={`${LANDING_SECTION} px-6 pt-24 pb-20 sm:px-16 sm:pt-32 sm:pb-24`}
          style={{ background: LANDING.background }}
        >
          <SectionHeading
            eyebrow="PLANOS"
            title="Escolha o plano ideal para sua aprovação"
            subtitle="Compare os recursos, escolha com confiança e comece a estudar hoje mesmo."
          />
          <div className="mx-auto mt-16 max-w-[1200px]">
            <PlansPricingBlock />
          </div>
          <div className="mx-auto mt-14 max-w-[1200px] sm:mt-16">
            <PlanGuaranteeBlock />
          </div>
          <p
            className="mx-auto mt-8 max-w-[720px] text-center text-[12px] leading-relaxed"
            style={{ color: LANDING.textSecondary }}
          >
            {PLANS_FOOTNOTE}
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className={`${LANDING_SECTION} mx-auto max-w-[760px] px-6 py-24 sm:px-16 sm:py-32`}>
          <div className="mb-14 text-center">
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

        {/* CTA FINAL — faixa azul */}
        <section className={`${LANDING_SECTION} px-6 pb-24 sm:px-16 sm:pb-28`}>
          <div
            className="mx-auto max-w-[1312px] rounded-[20px] px-6 py-16 text-center sm:px-16 sm:py-[80px]"
            style={{ background: LANDING.primary }}
          >
            <h2 className="text-2xl font-extrabold tracking-[-0.01em] text-white sm:text-[32px]">
              Seu próximo concurso começa agora.
            </h2>
            <p className="mx-auto mt-5 max-w-[580px] text-[15px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.88)" }}>
              Conheça gratuitamente a plataforma e descubra por que cada vez mais candidatos estudam
              por questões organizadas exatamente como a banca cobra.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-[color:var(--ds-color-action)] transition-transform duration-150 hover:scale-[1.02] hover:bg-white/95"
              >
                <Link to="/auth">
                  Começar gratuitamente
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {["Sem cartão", "Acesso imediato", "Sem compromisso"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/90"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 6.5L5 9L10.5 3.5"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item}
                </span>
              ))}
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
