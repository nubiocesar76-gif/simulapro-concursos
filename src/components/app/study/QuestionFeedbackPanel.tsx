import type { QuestionFeedback } from "@/lib/study-engine";
import { CheckCircle2, XCircle } from "lucide-react";

type QuestionFeedbackPanelProps = {
  feedback: QuestionFeedback;
};

export function QuestionFeedbackPanel({ feedback }: QuestionFeedbackPanelProps) {
  return (
    <section
      className={
        feedback.isCorrect
          ? "rounded-xl border border-success/30 bg-success/[0.04] p-5 sm:p-6"
          : "rounded-xl border border-destructive/30 bg-destructive/[0.04] p-5 sm:p-6"
      }
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5">
        {feedback.isCorrect ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
        ) : (
          <XCircle className="h-5 w-5 shrink-0 text-destructive" />
        )}
        <h2 className="text-base font-semibold text-foreground">
          {feedback.isCorrect ? "Correta" : "Incorreta"}
        </h2>
      </div>

      <div className="mt-5 space-y-5 border-t border-border/40 pt-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Resposta correta
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            Alternativa {feedback.correctAnswer}
          </p>
        </div>

        {feedback.explanation && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Explicação
            </p>
            <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 sm:text-base sm:leading-relaxed">
              {feedback.explanation}
            </p>
          </div>
        )}

        {(feedback.bibliography || feedback.legalReference) && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Referência
            </p>
            <div className="mt-1.5 space-y-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {feedback.bibliography && <p>{feedback.bibliography}</p>}
              {feedback.legalReference && <p>{feedback.legalReference}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
