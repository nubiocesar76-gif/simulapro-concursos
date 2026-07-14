import type { QuestionFeedback } from "@/lib/study-engine";
import type { QuestionAlternative } from "@/lib/questions";
import { cn } from "@/lib/utils";
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
    "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30 hover:shadow-sm active:scale-[0.995]",
  selected: "border-primary bg-primary/[0.06] shadow-sm ring-2 ring-primary/15",
  correct: "border-success/60 bg-success/[0.08] ring-2 ring-success/20",
  wrong: "border-destructive/60 bg-destructive/[0.08] ring-2 ring-destructive/20",
  disabled: "border-border/50 bg-muted/20 opacity-80",
  hover: "",
};

export function QuestionOptions({
  alternatives,
  value,
  onChange,
  disabled = false,
  feedback,
}: QuestionOptionsProps) {
  return (
    <div className="space-y-3" role="group" aria-label="Alternativas">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Alternativas
      </p>
      <div className="grid gap-3 sm:gap-3.5">
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
                "flex min-h-[4.25rem] w-full items-start gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-150 sm:min-h-[4.75rem] sm:px-5 sm:py-5",
                isInteractive ? "cursor-pointer" : "cursor-default",
                stateClasses[state],
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold sm:h-10 sm:w-10 sm:text-base",
                  state === "selected" && "bg-primary text-primary-foreground",
                  state === "correct" && "bg-success text-success-foreground",
                  state === "wrong" && "bg-destructive text-destructive-foreground",
                  (state === "default" || state === "disabled") && "bg-muted text-muted-foreground",
                )}
              >
                {alternative.letter}
              </span>
              <span className="min-w-0 flex-1 pt-1 text-base leading-relaxed text-foreground sm:text-[1.05rem] sm:leading-relaxed">
                {alternative.text}
              </span>
              {state === "correct" && (
                <CheckCircle2 className="mt-1.5 h-5 w-5 shrink-0 text-success" aria-hidden />
              )}
              {state === "wrong" && (
                <XCircle className="mt-1.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
