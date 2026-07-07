import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { formatDashboardDate, type DashboardDistribution } from "@/lib/student-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DistributionCardProps = {
  distribution: DashboardDistribution;
};

export function DistributionCard({ distribution }: DistributionCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{distribution.distribution_name}</CardTitle>
            <CardDescription className="truncate">
              {distribution.course_name} · {distribution.package_name}
            </CardDescription>
          </div>
          <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="mt-auto space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Questões</p>
            <p className="font-medium tabular-nums">{distribution.questionCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Última atividade</p>
            <p className="truncate font-medium">{formatDashboardDate(distribution.lastActivityAt)}</p>
          </div>
        </div>
        <Button className="w-full" asChild>
          <Link to="/app/study">Estudar</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
