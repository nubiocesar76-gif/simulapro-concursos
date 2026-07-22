import type { QuestionFeedback } from "@/lib/study-engine";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { CheckCircle2, XCircle } from "lucide-react";

type QuestionFeedbackPanelProps = {
  feedback: QuestionFeedback;
};

export function QuestionFeedbackPanel({ feedback }: QuestionFeedbackPanelProps) {
  return (
    <section
      className={
        feedback.isCorrect
          ? "rounded-[var(--ds-radius-lg)] border border-[color:var(--ds-color-success)]/30 bg-[color:var(--ds-color-success)]/[0.04] p-5 sm:p-6"
          : "rounded-[var(--ds-radius-lg)] border border-[color:var(--ds-color-error)]/30 bg-[color:var(--ds-color-error)]/[0.04] p-5 sm:p-6"
      }
      aria-live="polite"
    >
      <div className="flex items-center gap-[var(--ds-space-2)]">
        {feedback.isCorrect ? (
          <CheckCircle2
            className="h-5 w-5 shrink-0 text-[color:var(--ds-color-success)]"
            aria-hidden="true"
          />
        ) : (
          <XCircle
            className="h-5 w-5 shrink-0 text-[color:var(--ds-color-error)]"
            aria-hidden="true"
          />
        )}
        <h2
          className="text-[color:var(--ds-color-text-primary)]"
          style={{ fontSize: dsFontSize.base, fontWeight: dsFontWeight.semibold }}
        >
          {feedback.isCorrect ? "Correta" : "Incorreta"}
        </h2>
      </div>

      <div
        className="mt-5 flex flex-col gap-[var(--ds-space-5)] border-t pt-5"
        style={{ borderColor: "var(--ds-color-border)" }}
      >
        <div>
          <p
            className="uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
            style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
          >
            Resposta correta
          </p>
          <p
            className="mt-1 text-[color:var(--ds-color-text-primary)]"
            style={{ fontSize: dsFontSize.base, fontWeight: dsFontWeight.semibold }}
          >
            Alternativa {feedback.correctAnswer}
          </p>
        </div>

        {feedback.explanation && (
          <div>
            <p
              className="uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
              style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
            >
              Explicação
            </p>
            <p
              className="mt-1.5 whitespace-pre-wrap leading-relaxed text-[color:var(--ds-color-text-primary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {feedback.explanation}
            </p>
          </div>
        )}

        {(feedback.bibliography || feedback.legalReference) && (
          <div>
            <p
              className="uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
              style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
            >
              Referência
            </p>
            <div
              className="mt-1.5 flex flex-col gap-1 leading-relaxed text-[color:var(--ds-color-text-secondary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {feedback.bibliography && <p>{feedback.bibliography}</p>}
              {feedback.legalReference && <p>{feedback.legalReference}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
