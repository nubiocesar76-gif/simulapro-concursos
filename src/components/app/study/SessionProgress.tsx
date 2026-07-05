import { Progress } from "@/components/ui/progress";

type SessionProgressProps = {
  current: number;
  total: number;
  label?: string;
};

export function SessionProgress({ current, total, label = "Progresso" }: SessionProgressProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {current} de {total}
        </span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
