import { Link } from "@tanstack/react-router";
import { formatDashboardDate, formatStudyDuration, type RecentSession } from "@/lib/student-dashboard";
import { STUDY_MODE_LABELS } from "@/lib/study-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RecentSessionsProps = {
  sessions: RecentSession[];
};

export function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Últimas sessões</CardTitle>
          <CardDescription>Seu histórico recente de estudo.</CardDescription>
        </div>
        <Button variant="link" size="sm" className="px-0 shrink-0" asChild>
          <Link to="/app/history">Ver todas →</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <EmptyState
            title="Nenhuma sessão registrada"
            description="Suas sessões de estudo aparecerão aqui após você começar a estudar."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Distribuição</TableHead>
                <TableHead>Modo</TableHead>
                <TableHead>Acertos</TableHead>
                <TableHead>Tempo</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDashboardDate(session.date)}
                  </TableCell>
                  <TableCell>{session.distributionName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{STUDY_MODE_LABELS[session.mode]}</Badge>
                  </TableCell>
                  <TableCell>
                    {session.totalAnswered > 0
                      ? `${session.correctCount}/${session.totalAnswered}`
                      : "—"}
                  </TableCell>
                  <TableCell>{formatStudyDuration(session.durationSeconds)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app/study/$sessionId" params={{ sessionId: session.id }}>
                        Ver resultado
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
