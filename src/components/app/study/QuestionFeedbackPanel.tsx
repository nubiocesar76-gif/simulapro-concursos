import type { QuestionFeedback } from "@/lib/study-engine";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { CheckCircle2, XCircle } from "lucide-react";

type QuestionFeedbackPanelProps = {
  feedback: QuestionFeedback;
};

function FeedbackLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
      style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
    >
      {children}
    </p>
  );
}

export function QuestionFeedbackPanel({ feedback }: QuestionFeedbackPanelProps) {
  const { sia } = feedback;

  return (
    <section
      className={
        feedback.isCorrect
          ? "rounded-[var(--ds-radius-lg)] border border-[color:var(--ds-color-success)]/30 bg-[color:var(--ds-color-success)]/[0.04] p-5 sm:p-6"
          : "rounded-[var(--ds-radius-lg)] border border-[color:var(--ds-color-error)]/30 bg-[color:var(--ds-color-error)]/[0.04] p-5 sm:p-6"
      }
      aria-live="polite"
    >
      {/* Bloco 1 — Resultado */}
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
          <FeedbackLabel>Resposta correta</FeedbackLabel>
          <p
            className="mt-1 text-[color:var(--ds-color-text-primary)]"
            style={{ fontSize: dsFontSize.base, fontWeight: dsFontWeight.semibold }}
          >
            Alternativa {feedback.correctAnswer}
          </p>
        </div>

        {feedback.explanation && (
          <div>
            <FeedbackLabel>Explicação</FeedbackLabel>
            <p
              className="mt-1.5 whitespace-pre-wrap leading-relaxed text-[color:var(--ds-color-text-primary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {feedback.explanation}
            </p>
          </div>
        )}

        {/* Bloco 2 — Por que você acertou/errou. Sempre presente (frase com
            linguagem de probabilidade, autorada, ou fallback genérico). */}
        <div>
          <FeedbackLabel>
            {feedback.isCorrect ? "Por que você acertou" : "Por que você errou"}
          </FeedbackLabel>
          <p
            className="mt-1.5 leading-relaxed text-[color:var(--ds-color-text-primary)]"
            style={{ fontSize: dsFontSize.sm }}
          >
            {sia.reasonSentence ?? "Reveja a explicação para entender o motivo do erro."}
          </p>
        </div>

        {/* Bloco 4 — Pegadinha */}
        {sia.pegadinha && (
          <div>
            <FeedbackLabel>🎯 Pegadinha encontrada</FeedbackLabel>
            <p
              className="mt-1.5 text-[color:var(--ds-color-text-primary)]"
              style={{ fontSize: dsFontSize.sm, fontWeight: dsFontWeight.semibold }}
            >
              “{sia.pegadinha.trigger}”
            </p>
            <p
              className="mt-1 leading-relaxed text-[color:var(--ds-color-text-secondary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {sia.pegadinha.explanation}
            </p>
          </div>
        )}

        {/* Bloco 5 — Texto longo */}
        {sia.longText && (
          <div>
            <FeedbackLabel>📖 Texto longo — trechos que importavam</FeedbackLabel>
            <ul
              className="mt-1.5 list-disc space-y-1 pl-5 leading-relaxed text-[color:var(--ds-color-text-primary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {sia.longText.excerpts.map((excerpt, i) => (
                <li key={i}>“{excerpt}”</li>
              ))}
            </ul>
            {sia.longText.note && (
              <p
                className="mt-1.5 leading-relaxed text-[color:var(--ds-color-text-secondary)]"
                style={{ fontSize: dsFontSize.sm }}
              >
                {sia.longText.note}
              </p>
            )}
          </div>
        )}

        {/* Bloco 6 — Interpretação */}
        {sia.interpretation && (
          <div>
            <FeedbackLabel>🧠 Interpretação</FeedbackLabel>
            <p
              className="mt-1.5 text-[color:var(--ds-color-text-primary)]"
              style={{ fontSize: dsFontSize.sm, fontWeight: dsFontWeight.semibold }}
            >
              “{sia.interpretation.trigger}”
            </p>
            <p
              className="mt-1 leading-relaxed text-[color:var(--ds-color-text-secondary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {sia.interpretation.explanation}
            </p>
          </div>
        )}

        {/* Bloco 7 — Lei seca (reaproveita legal_reference já existente) */}
        {feedback.legalReference && (
          <div>
            <FeedbackLabel>⚖ Lei seca</FeedbackLabel>
            <p
              className="mt-1.5 leading-relaxed text-[color:var(--ds-color-text-primary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {feedback.legalReference}
            </p>
          </div>
        )}

        {/* Bloco 8 — Cálculo */}
        {sia.calculation && (
          <div>
            <FeedbackLabel>📊 Cálculo — resolução passo a passo</FeedbackLabel>
            <p
              className="mt-1.5 whitespace-pre-wrap leading-relaxed text-[color:var(--ds-color-text-primary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {sia.calculation.steps}
            </p>
            {sia.calculation.commonError && (
              <p
                className="mt-1.5 leading-relaxed text-[color:var(--ds-color-text-secondary)]"
                style={{ fontSize: dsFontSize.sm }}
              >
                Erro mais comum: {sia.calculation.commonError}
              </p>
            )}
          </div>
        )}

        {feedback.bibliography && (
          <div>
            <FeedbackLabel>Referência bibliográfica</FeedbackLabel>
            <p
              className="mt-1.5 leading-relaxed text-[color:var(--ds-color-text-secondary)]"
              style={{ fontSize: dsFontSize.sm }}
            >
              {feedback.bibliography}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
