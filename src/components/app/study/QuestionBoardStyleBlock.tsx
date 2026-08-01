import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { Landmark } from "lucide-react";

type QuestionBoardStyleBlockProps = {
  boardName: string | null;
  styleSummary: string | null;
};

/**
 * Bloco 3 (Estilo da banca) — só renderiza quando a banca tem
 * `style_summary` cadastrado (`boards.style_summary`, catálogo editorial,
 * nunca improvisado por questão). Ausência = bloco simplesmente some,
 * mesmo comportamento gracioso dos demais blocos condicionais.
 */
export function QuestionBoardStyleBlock({ boardName, styleSummary }: QuestionBoardStyleBlockProps) {
  if (!styleSummary) return null;

  return (
    <section
      className="rounded-[var(--ds-radius-lg)] border p-5 sm:p-6"
      style={{ borderColor: "var(--ds-color-border)" }}
    >
      <div className="flex items-center gap-[var(--ds-space-2)]">
        <Landmark
          className="h-5 w-5 shrink-0 text-[color:var(--ds-color-text-secondary)]"
          aria-hidden="true"
        />
        <h3
          className="text-[color:var(--ds-color-text-primary)]"
          style={{ fontSize: dsFontSize.base, fontWeight: dsFontWeight.semibold }}
        >
          {boardName ? `Estilo ${boardName}` : "Estilo da banca"}
        </h3>
      </div>
      <p
        className="mt-2 leading-relaxed text-[color:var(--ds-color-text-primary)]"
        style={{ fontSize: dsFontSize.sm }}
      >
        {styleSummary}
      </p>
    </section>
  );
}
