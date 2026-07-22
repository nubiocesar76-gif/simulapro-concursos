import { ChevronDown, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, Divider } from "@/components/design-system";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import type { QuestionContext } from "@/lib/study-engine";
import { STUDY_MODE_LABELS, type StudyMode } from "@/lib/study-session";

type SessionSummaryPanelProps = {
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  mode: StudyMode;
  packageName: string;
  questionContext: QuestionContext;
  className?: string;
};

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="flex items-start justify-between gap-[var(--ds-space-3)]"
      style={{ fontSize: dsFontSize.sm }}
    >
      <span className="text-[color:var(--ds-color-text-secondary)]">{label}</span>
      <span
        className="max-w-[58%] text-right leading-snug text-[color:var(--ds-color-text-primary)]"
        style={{ fontWeight: dsFontWeight.medium }}
      >
        {value}
      </span>
    </div>
  );
}

function ContextRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return <StatRow label={label} value={value} />;
}

function PanelContent({
  answeredCount,
  correctCount,
  wrongCount,
  totalQuestions,
  mode,
  packageName,
  questionContext,
}: Omit<SessionSummaryPanelProps, "className">) {
  const remaining = Math.max(totalQuestions - answeredCount, 0);
  const percentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const progressPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="flex flex-col gap-[var(--ds-space-5)]">
      <div>
        <p
          className="mb-2 uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
          style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
        >
          Resumo
        </p>
        <div className="flex flex-col gap-[var(--ds-space-2)]">
          <div
            className="flex items-center justify-between text-[color:var(--ds-color-text-secondary)]"
            style={{ fontSize: dsFontSize.xs }}
          >
            <span>Progresso</span>
            <span
              className="tabular-nums text-[color:var(--ds-color-text-primary)]"
              style={{ fontWeight: dsFontWeight.medium }}
            >
              {progressPercent}%
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "var(--ds-color-border)" }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]"
              style={{ width: `${progressPercent}%`, background: "var(--ds-color-action)" }}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-[var(--ds-space-2)]">
          <StatRow label="Respondidas" value={answeredCount} />
          <StatRow label="Acertos" value={correctCount} />
          <StatRow label="Erros" value={wrongCount} />
          <StatRow label="Aproveitamento" value={`${percentage}%`} />
          <StatRow label="Restantes" value={remaining} />
        </div>
      </div>

      <Divider />

      <div>
        <p
          className="mb-3 uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
          style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
        >
          Contexto
        </p>
        <div className="flex flex-col gap-[var(--ds-space-2)]">
          <StatRow label="Modo" value={STUDY_MODE_LABELS[mode]} />
          <ContextRow label="Banco" value={packageName} />
          <ContextRow label="Banca" value={questionContext.boardName} />
          <ContextRow label="Disciplina" value={questionContext.subjectName} />
          <ContextRow label="Assunto" value={questionContext.topicName} />
        </div>
      </div>
    </div>
  );
}

export function SessionSummaryPanel({
  answeredCount,
  correctCount,
  wrongCount,
  totalQuestions,
  mode,
  packageName,
  questionContext,
  className,
}: SessionSummaryPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const panelProps = {
    answeredCount,
    correctCount,
    wrongCount,
    totalQuestions,
    mode,
    packageName,
    questionContext,
  };

  return (
    <>
      <aside className={`hidden lg:block ${className ?? ""}`}>
        <Card padding="none" className="sticky top-4 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <span
              className="text-[color:var(--ds-color-text-secondary)]"
              style={{ fontSize: dsFontSize.sm, fontWeight: dsFontWeight.medium }}
            >
              Contexto da sessão
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 shrink-0 p-0"
              onClick={() => setDesktopCollapsed((open) => !open)}
              aria-label={desktopCollapsed ? "Expandir painel" : "Recolher painel"}
            >
              {desktopCollapsed ? (
                <PanelRightOpen className="h-4 w-4" />
              ) : (
                <PanelRightClose className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          {!desktopCollapsed && (
            <CardContent className="pt-0 pb-5">
              <PanelContent {...panelProps} />
            </CardContent>
          )}
        </Card>
      </aside>

      <Collapsible open={mobileOpen} onOpenChange={setMobileOpen} className="lg:hidden">
        <Card padding="none" className="shadow-none">
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="flex h-auto w-full items-center justify-between rounded-b-none px-4 py-3"
            >
              <span
                className="text-[color:var(--ds-color-text-secondary)]"
                style={{ fontSize: dsFontSize.sm, fontWeight: dsFontWeight.medium }}
              >
                Contexto da sessão
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-5">
              <PanelContent {...panelProps} />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </>
  );
}
