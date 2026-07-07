import { Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import { STUDY_MODE_LABELS } from "@/lib/study-session";
import type { ContinueStudy } from "@/lib/student-dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ContinueStudyCardProps = {
  session: ContinueStudy;
};

export function ContinueStudyCard({ session }: ContinueStudyCardProps) {
  const progressLabel =
    session.totalCount > 0
      ? `${session.answeredCount} de ${session.totalCount}`
      : "Aguardando início";

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">Continuar última sessão</CardTitle>
        <CardDescription>Retome de onde você parou.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2 text-sm">
          <p className="truncate font-medium">{session.distributionName}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{STUDY_MODE_LABELS[session.mode]}</Badge>
            <span className="text-muted-foreground tabular-nums">
              Progresso: {progressLabel}
            </span>
          </div>
        </div>
        <Button asChild className="w-full shrink-0 sm:w-auto">
          <Link to="/app/study/$sessionId" params={{ sessionId: session.sessionId }}>
            <PlayCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            Continuar
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
