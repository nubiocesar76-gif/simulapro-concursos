import type { QuestionContext } from "@/lib/study-engine";
import { cn } from "@/lib/utils";

type QuestionMetadataBadgesProps = {
  context: QuestionContext;
  className?: string;
};

const badgeClass =
  "inline-flex items-center rounded-md bg-muted/40 px-2 py-0.5 text-xs font-normal text-muted-foreground";

export function QuestionMetadataBadges({ context, className }: QuestionMetadataBadgesProps) {
  const items = [
    context.boardName ? { label: "Banca", value: context.boardName } : null,
    context.year ? { label: "Ano", value: String(context.year) } : null,
    context.subjectName ? { label: "Disciplina", value: context.subjectName } : null,
    context.topicName ? { label: "Assunto", value: context.topicName } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  if (!items.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {items.map((item) => (
        <span key={item.label} className={badgeClass}>
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  );
}
