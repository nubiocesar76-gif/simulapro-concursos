import type { QuestionContext } from "@/lib/study-engine";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/design-system";

type QuestionMetadataBadgesProps = {
  context: QuestionContext;
  className?: string;
};

export function QuestionMetadataBadges({ context, className }: QuestionMetadataBadgesProps) {
  const items = [
    context.boardName ? { label: "Banca", value: context.boardName } : null,
    context.year ? { label: "Ano", value: String(context.year) } : null,
    context.subjectName ? { label: "Disciplina", value: context.subjectName } : null,
    context.topicName ? { label: "Assunto", value: context.topicName } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  if (!items.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-[var(--ds-space-2)]", className)}>
      {items.map((item) => (
        <Badge key={item.label} variant="outline" size="sm" className="tracking-[0.04em]">
          {item.label.toUpperCase()}: {item.value}
        </Badge>
      ))}
    </div>
  );
}
