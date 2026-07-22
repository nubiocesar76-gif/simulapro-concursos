import type { QuestionFeedback } from "@/lib/study-engine";
import type { QuestionAlternative } from "@/lib/questions";
import { cn } from "@/lib/utils";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { CheckCircle2, XCircle } from "lucide-react";

type QuestionOptionsProps = {
  alternatives: QuestionAlternative[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  feedback?: QuestionFeedback | null;
};

type AlternativeState = "default" | "hover" | "selected" | "correct" | "wrong" | "disabled";

function getAlternativeState(
  letter: string,
  value: string | null,
  feedback: QuestionFeedback | null | undefined,
  disabled: boolean,
): AlternativeState {
  const isSelected = value === letter;
  const isAnswered = disabled && !!feedback;
  const isCorrect = feedback?.correctAnswer === letter;
  const isWrongSelection = isAnswered && isSelected && !feedback?.isCorrect;

  if (isAnswered && isCorrect) return "correct";
  if (isWrongSelection) return "wrong";
  if (disabled && !isCorrect && !isWrongSelection) return "disabled";
  if (isSelected) return "selected";
  return "default";
}

const stateClasses: Record<AlternativeState, string> = {
  default:
    "border-[color:var(--ds-color-border)] bg-[color:var(--ds-color-surface)] hover:border-[color:var(--ds-color-action)]/40 hover:bg-[color:var(--ds-color-background)] active:scale-[0.995]",
  selected:
    "border-[color:var(--ds-color-action)] bg-[color:var(--ds-color-action)]/[0.06] shadow-[var(--ds-shadow-sm)] ring-2 ring-[color:var(--ds-color-action)]/15",
  correct:
    "border-[color:var(--ds-color-success)]/60 bg-[color:var(--ds-color-success)]/[0.08] ring-2 ring-[color:var(--ds-color-success)]/20",
  wrong:
    "border-[color:var(--ds-color-error)]/60 bg-[color:var(--ds-color-error)]/[0.08] ring-2 ring-[color:var(--ds-color-error)]/20",
  disabled:
    "border-[color:var(--ds-color-border)]/70 bg-[color:var(--ds-color-background)] opacity-80",
  hover: "",
};

const badgeClasses: Record<AlternativeState, string> = {
  default: "bg-[color:var(--ds-color-background)] text-[color:var(--ds-color-text-secondary)]",
  hover: "",
  selected: "bg-[color:var(--ds-color-action)] text-[color:var(--ds-color-surface)]",
  correct: "bg-[color:var(--ds-color-success)] text-[color:var(--ds-color-surface)]",
  wrong: "bg-[color:var(--ds-color-error)] text-[color:var(--ds-color-surface)]",
  disabled: "bg-[color:var(--ds-color-background)] text-[color:var(--ds-color-text-secondary)]",
};

export function QuestionOptions({
  alternatives,
  value,
  onChange,
  disabled = false,
  feedback,
}: QuestionOptionsProps) {
  return (
    <div className="flex flex-col gap-[var(--ds-space-3)]" role="group" aria-label="Alternativas">
      <p
        className="uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
        style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
      >
        Alternativas
      </p>
      <div className="grid gap-[var(--ds-space-3)]">
        {alternatives.map((alternative) => {
          const state = getAlternativeState(alternative.letter, value, feedback, disabled);
          const isInteractive = !disabled;

          return (
            <button
              key={alternative.letter}
              type="button"
              disabled={!isInteractive}
              aria-pressed={value === alternative.letter}
              aria-label={`Alternativa ${alternative.letter}`}
              onClick={() => isInteractive && onChange(alternative.letter)}
              className={cn(
                "flex min-h-[4.25rem] w-full items-start gap-[var(--ds-space-4)] rounded-[var(--ds-radius-lg)] border px-5 py-[18px] text-left transition-all duration-150 sm:min-h-[4.75rem]",
                isInteractive ? "cursor-pointer" : "cursor-default",
                stateClasses[state],
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-md)] sm:h-8 sm:w-8",
                  badgeClasses[state],
                )}
                style={{ fontSize: dsFontSize.sm, fontWeight: dsFontWeight.bold }}
              >
                {alternative.letter}
              </span>
              <span
                className="min-w-0 flex-1 pt-1 leading-relaxed text-[color:var(--ds-color-text-primary)]"
                style={{ fontSize: dsFontSize.base }}
              >
                {alternative.text}
              </span>
              {state === "correct" && (
                <CheckCircle2
                  className="mt-1.5 h-5 w-5 shrink-0 text-[color:var(--ds-color-success)]"
                  aria-hidden="true"
                />
              )}
              {state === "wrong" && (
                <XCircle
                  className="mt-1.5 h-5 w-5 shrink-0 text-[color:var(--ds-color-error)]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
