import { dsFontWeight } from "@/styles/design-system/tokens";

type QuestionCardProps = {
  statement: string;
  imageUrl?: string | null;
};

export function QuestionCard({ statement, imageUrl }: QuestionCardProps) {
  return (
    <article className="flex flex-col gap-[var(--ds-space-6)]">
      <p
        className="whitespace-pre-wrap text-[color:var(--ds-color-text-primary)]"
        style={{ fontSize: "1.1875rem", fontWeight: dsFontWeight.medium, lineHeight: 1.75 }}
      >
        {statement}
      </p>

      {imageUrl && (
        <figure
          className="mx-auto w-full max-w-3xl overflow-hidden rounded-[var(--ds-radius-lg)] border p-4 sm:p-5"
          style={{
            borderColor: "var(--ds-color-border)",
            background: "var(--ds-color-background)",
          }}
        >
          <img
            src={imageUrl}
            alt="Ilustração do enunciado"
            className="mx-auto max-h-[min(24rem,60vh)] w-full object-contain"
          />
        </figure>
      )}
    </article>
  );
}
