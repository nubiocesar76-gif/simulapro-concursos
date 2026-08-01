import type { QuestionSiaData } from "@/lib/study-question-detail.functions";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { Clock } from "lucide-react";

type QuestionSiaTimeBlockProps = {
  time: QuestionSiaData["time"];
};

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return minutes > 0 ? `${minutes}min${String(seconds).padStart(2, "0")}` : `${seconds}s`;
}

/**
 * Bloco 9 (Tempo) — sempre renderizado, com ou sem benchmark coletivo
 * (regra explícita do plano SIA V1: "o tempo SEMPRE deve ensinar algo").
 * `time.note` já vem pronto do servidor (`study-question-detail.functions.ts`),
 * nunca montado aqui — este componente só exibe.
 */
export function QuestionSiaTimeBlock({ time }: QuestionSiaTimeBlockProps) {
  return (
    <section
      className="rounded-[var(--ds-radius-lg)] border p-5 sm:p-6"
      style={{ borderColor: "var(--ds-color-border)" }}
    >
      <div className="flex items-center gap-[var(--ds-space-2)]">
        <Clock
          className="h-5 w-5 shrink-0 text-[color:var(--ds-color-text-secondary)]"
          aria-hidden="true"
        />
        <h3
          className="text-[color:var(--ds-color-text-primary)]"
          style={{ fontSize: dsFontSize.base, fontWeight: dsFontWeight.semibold }}
        >
          Tempo de resolução
        </h3>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <div>
          <p
            className="uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
            style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
          >
            Seu tempo
          </p>
          <p
            className="text-[color:var(--ds-color-text-primary)]"
            style={{ fontSize: dsFontSize.lg, fontWeight: dsFontWeight.semibold }}
          >
            {formatSeconds(time.studentSeconds)}
          </p>
        </div>
        {time.averageSeconds !== null && (
          <div>
            <p
              className="uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
              style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
            >
              Média
            </p>
            <p
              className="text-[color:var(--ds-color-text-primary)]"
              style={{ fontSize: dsFontSize.lg, fontWeight: dsFontWeight.semibold }}
            >
              {formatSeconds(time.averageSeconds)}
            </p>
          </div>
        )}
      </div>

      <p
        className="mt-3 leading-relaxed text-[color:var(--ds-color-text-secondary)]"
        style={{ fontSize: dsFontSize.sm }}
      >
        {time.note}
      </p>
    </section>
  );
}
