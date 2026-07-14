import { Progress } from "@/components/ui/progress";
import { STUDY_MODE_LABELS, type StudyMode } from "@/lib/study-session";
import { Clock } from "lucide-react";

type StudyActiveHeaderProps = {
  mode: StudyMode;
  currentQuestion: number;
  totalQuestions: number;
  elapsedLabel: string;
};

export function StudyActiveHeader({
  mode,
  currentQuestion,
  totalQuestions,
  elapsedLabel,
}: StudyActiveHeaderProps) {
  const percent = totalQuestions > 0 ? Math.round((currentQuestion / totalQuestions) * 100) : 0;

  return (
    <header className="space-y-3 border-b border-border/60 pb-4">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
        <h1 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
          Questão {currentQuestion} de {totalQuestions}
        </h1>
        <span className="text-muted-foreground">
          Modo{" "}
          <span className="font-medium text-foreground">{STUDY_MODE_LABELS[mode]}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>Tempo</span>
          <span className="font-medium tabular-nums text-foreground">{elapsedLabel}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Progress value={percent} className="h-3 flex-1 sm:h-3.5" />
        <span className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
          {percent}%
        </span>
      </div>
    </header>
  );
}
