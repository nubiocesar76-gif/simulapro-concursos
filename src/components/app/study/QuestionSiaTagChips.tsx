import { SIA_TAG_CATALOG } from "@/lib/sia";
import { cn } from "@/lib/utils";

type QuestionSiaTagChipsProps = {
  tags: string[];
  className?: string;
};

/**
 * SIA V1 — chips com os ícones do catálogo fixo, sem nenhum texto
 * explicativo. Seguro para mostrar antes de a questão ser respondida (regra
 * explícita do plano SIA V1: "As tags aparecem antes da resposta"). O dado
 * (`tags`) já vem do payload seguro de `loadQuestion`/`getQuestionForStudy`
 * — nenhuma lógica de ocultação adicional é necessária aqui.
 */
export function QuestionSiaTagChips({ tags, className }: QuestionSiaTagChipsProps) {
  const definitions = tags
    .map((key) => SIA_TAG_CATALOG.find((t) => t.key === key))
    .filter((t): t is (typeof SIA_TAG_CATALOG)[number] => !!t);

  if (!definitions.length) return null;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      aria-label="Tags desta questão"
    >
      {definitions.map((tag) => (
        <span
          key={tag.key}
          title={tag.label}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm"
          style={{ borderColor: "var(--ds-color-border)" }}
        >
          {tag.icon}
        </span>
      ))}
    </div>
  );
}
