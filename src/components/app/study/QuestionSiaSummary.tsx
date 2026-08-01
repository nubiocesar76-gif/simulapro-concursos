import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { GraduationCap } from "lucide-react";

type QuestionSiaSummaryProps = {
  lessonsLearned: string[];
};

/**
 * Bloco 10 (O que você aprendeu) — sempre presente (obrigatório). Os
 * bullets já vêm computados do servidor a partir dos blocos que realmente
 * dispararam (`study-question-detail.functions.ts`), nunca autorados à
 * parte — evita pedir ao editorial um resumo redundante do que já foi
 * autorado em cada bloco individual.
 */
export function QuestionSiaSummary({ lessonsLearned }: QuestionSiaSummaryProps) {
  if (!lessonsLearned.length) return null;

  return (
    <section
      className="rounded-[var(--ds-radius-lg)] border p-5 sm:p-6"
      style={{ borderColor: "var(--ds-color-border)" }}
    >
      <div className="flex items-center gap-[var(--ds-space-2)]">
        <GraduationCap
          className="h-5 w-5 shrink-0 text-[color:var(--ds-color-text-secondary)]"
          aria-hidden="true"
        />
        <h3
          className="text-[color:var(--ds-color-text-primary)]"
          style={{ fontSize: dsFontSize.base, fontWeight: dsFontWeight.semibold }}
        >
          Hoje você aprendeu
        </h3>
      </div>
      <ul
        className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-[color:var(--ds-color-text-primary)]"
        style={{ fontSize: dsFontSize.sm }}
      >
        {lessonsLearned.map((lesson, i) => (
          <li key={i}>{lesson}</li>
        ))}
      </ul>
    </section>
  );
}
