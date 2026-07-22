import { Clock } from "lucide-react";
import { STUDY_MODE_LABELS, type StudyMode } from "@/lib/study-session";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";

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
    <header className="flex flex-col gap-[var(--ds-space-3)]">
      <div
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ background: "var(--ds-color-border)" }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]"
          style={{ width: `${percent}%`, background: "var(--ds-color-action)" }}
        />
      </div>

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1
          className="text-[color:var(--ds-color-text-primary)]"
          style={{ fontSize: dsFontSize.base, fontWeight: dsFontWeight.bold }}
        >
          Questão {currentQuestion} de {totalQuestions}
        </h1>
        <span
          className="text-[color:var(--ds-color-text-secondary)]"
          style={{ fontSize: dsFontSize.sm }}
        >
          Modo{" "}
          <span
            className="text-[color:var(--ds-color-text-primary)]"
            style={{ fontWeight: dsFontWeight.medium }}
          >
            {STUDY_MODE_LABELS[mode]}
          </span>
        </span>
        <span
          className="inline-flex items-center gap-[var(--ds-space-1)] text-[color:var(--ds-color-text-secondary)]"
          style={{ fontSize: dsFontSize.sm }}
        >
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Tempo</span>
          <span
            className="tabular-nums text-[color:var(--ds-color-text-primary)]"
            style={{ fontWeight: dsFontWeight.medium }}
          >
            {elapsedLabel}
          </span>
        </span>
      </div>
    </header>
  );
}
