import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { formatDashboardDate, type DashboardDistribution } from "@/lib/student-dashboard";
import { Button, Card, CardContent, CardHeader } from "@/components/design-system";
import { dsFontSize } from "@/styles/design-system/tokens";

type DistributionCardProps = {
  distribution: DashboardDistribution;
};

export function DistributionCard({ distribution }: DistributionCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-[var(--ds-space-2)]">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{distribution.distribution_name}</p>
            <p className="truncate text-sm text-[color:var(--ds-color-text-secondary)]">
              {distribution.course_name} · {distribution.package_name}
            </p>
          </div>
          <BookOpen
            className="shrink-0 text-[color:var(--ds-color-action)]"
            aria-hidden="true"
            style={{ width: dsFontSize.lg, height: dsFontSize.lg }}
          />
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-[var(--ds-space-4)]">
        <div className="grid grid-cols-2 gap-[var(--ds-space-3)] text-sm">
          <div>
            <p className="text-xs text-[color:var(--ds-color-text-secondary)]">Questões</p>
            <p className="font-medium tabular-nums">{distribution.questionCount}</p>
          </div>
          <div>
            <p className="text-xs text-[color:var(--ds-color-text-secondary)]">Última atividade</p>
            <p className="truncate font-medium">
              {formatDashboardDate(distribution.lastActivityAt)}
            </p>
          </div>
        </div>
        <Button fullWidth asChild>
          <Link to="/app/study">Estudar</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
