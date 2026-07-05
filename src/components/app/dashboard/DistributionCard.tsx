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
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{distribution.distribution_name}</CardTitle>
            <CardDescription>
              {distribution.course_name} · {distribution.package_name}
            </CardDescription>
          </div>
          <BookOpen className="h-5 w-5 text-primary shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Questões</p>
            <p className="font-medium">{distribution.questionCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Última atividade</p>
            <p className="font-medium">{formatDashboardDate(distribution.lastActivityAt)}</p>
          </div>
        </div>
        <Button className="w-full" asChild>
          <Link to="/app/study">Estudar</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
