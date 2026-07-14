import { ChevronDown, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[58%] text-right font-medium leading-snug text-foreground">{value}</span>
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
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Resumo
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span className="font-medium tabular-nums">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        <div className="mt-4 space-y-2">
          <StatRow label="Respondidas" value={answeredCount} />
          <StatRow label="Acertos" value={correctCount} />
          <StatRow label="Erros" value={wrongCount} />
          <StatRow label="Aproveitamento" value={`${percentage}%`} />
          <StatRow label="Restantes" value={remaining} />
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Contexto
        </p>
        <div className="space-y-2">
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
        <Card className="sticky top-4 border-border/60 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contexto da sessão
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
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
            <CardContent className="pb-5">
              <PanelContent {...panelProps} />
            </CardContent>
          )}
        </Card>
      </aside>

      <Collapsible open={mobileOpen} onOpenChange={setMobileOpen} className="lg:hidden">
        <Card className="border-border/60 shadow-none">
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="flex h-auto w-full items-center justify-between rounded-b-none px-4 py-3"
            >
              <span className="text-sm font-medium text-muted-foreground">Contexto da sessão</span>
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
