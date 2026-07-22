import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, HelpCircle, Target } from "lucide-react";
import { formatStudyDuration, type DashboardStats } from "@/lib/student-dashboard";
import { MetricCard } from "@/components/design-system";
import { dsFontSize } from "@/styles/design-system/tokens";

type DashboardStatsProps = {
  stats: DashboardStats;
};

const items = [
  { key: "questionsAnswered", label: "Questões respondidas", icon: HelpCircle },
  { key: "accuracyPercent", label: "Aproveitamento", icon: Target, suffix: "%" },
  { key: "completedSessions", label: "Sessões concluídas", icon: CheckCircle2 },
  {
    key: "totalStudySeconds",
    label: "Tempo total de estudo",
    icon: Clock,
    format: formatStudyDuration,
  },
] as const;

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid items-stretch gap-[var(--ds-space-4)] sm:grid-cols-2 lg:grid-cols-4">
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
            className="block h-full rounded-[var(--ds-radius-lg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-color-action)] focus-visible:ring-offset-2"
          >
            <MetricCard
              title={
                <span className="flex items-center gap-[var(--ds-space-1)]">
                  <span className="truncate">{item.label}</span>
                  <ArrowRight
                    className="shrink-0"
                    aria-hidden="true"
                    style={{ width: dsFontSize.xs, height: dsFontSize.xs }}
                  />
                </span>
              }
              value={value}
              icon={
                <Icon
                  aria-hidden="true"
                  style={{ width: dsFontSize.base, height: dsFontSize.base }}
                />
              }
              className="h-full transition-colors hover:border-[color:var(--ds-color-action)]/40"
            />
          </Link>
        );
      })}
    </div>
  );
}
