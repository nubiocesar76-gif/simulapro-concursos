import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, HelpCircle, Target } from "lucide-react";
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
    <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const rawValue = stats[item.key];
        const value =
          "format" in item && item.format
            ? item.format(rawValue as number)
            : `${rawValue}${"suffix" in item ? item.suffix : ""}`;

        return (
          <Link
            key={item.key}
            to="/app/history"
            className="flex h-full flex-col rounded-lg border bg-card p-5 shadow transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
                <span className="truncate">{item.label}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </div>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-auto pt-3 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
          </Link>
        );
      })}
    </div>
  );
}
