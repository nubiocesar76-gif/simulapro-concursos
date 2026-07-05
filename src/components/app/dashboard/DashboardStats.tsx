import { CheckCircle2, Clock, HelpCircle, Target } from "lucide-react";
import { formatStudyDuration, type DashboardStats } from "@/lib/student-dashboard";

type DashboardStatsProps = {
  stats: DashboardStats;
};

const items = [
  { key: "questionsAnswered", label: "Questões respondidas", icon: HelpCircle },
  { key: "accuracyPercent", label: "Aproveitamento", icon: Target, suffix: "%" },
  { key: "completedSessions", label: "Sessões concluídas", icon: CheckCircle2 },
  { key: "totalStudySeconds", label: "Tempo total de estudo", icon: Clock, format: formatStudyDuration },
] as const;

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const rawValue = stats[item.key];
        const value =
          "format" in item && item.format
            ? item.format(rawValue as number)
            : `${rawValue}${"suffix" in item ? item.suffix : ""}`;

        return (
          <div key={item.key} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-semibold">{value}</div>
          </div>
        );
      })}
    </div>
  );
}
