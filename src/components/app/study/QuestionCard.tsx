type QuestionCardProps = {
  statement: string;
  imageUrl?: string | null;
};

export function QuestionCard({ statement, imageUrl }: QuestionCardProps) {
  return (
    <article className="space-y-6">
      <p className="text-lg leading-[1.8] whitespace-pre-wrap text-foreground sm:text-xl sm:leading-[1.85] md:text-[1.35rem] md:leading-[1.9]">
        {statement}
      </p>

      {imageUrl && (
        <figure className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border/50 bg-muted/20 p-4 sm:p-5">
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
