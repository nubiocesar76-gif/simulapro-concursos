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
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <div className="min-w-0">
          <CardTitle>Últimas sessões</CardTitle>
          <CardDescription>Seu histórico recente de estudo.</CardDescription>
        </div>
        <Button variant="link" size="sm" className="shrink-0 px-0" asChild>
          <Link to="/app/history">Ver histórico completo →</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <EmptyState
            title="Nenhuma sessão registrada"
            description="Suas sessões de estudo aparecerão aqui após você começar a estudar."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[7rem]">Data</TableHead>
                  <TableHead className="min-w-[10rem]">Distribuição</TableHead>
                  <TableHead className="min-w-[6rem]">Modo</TableHead>
                  <TableHead className="min-w-[5rem]">Acertos</TableHead>
                  <TableHead className="min-w-[5rem]">Tempo</TableHead>
                  <TableHead className="min-w-[7rem] text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {formatDashboardDate(session.date)}
                    </TableCell>
                    <TableCell className="max-w-[14rem] truncate font-medium">
                      {session.distributionName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{STUDY_MODE_LABELS[session.mode]}</Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {session.totalAnswered > 0
                        ? `${session.correctCount}/${session.totalAnswered}`
                        : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {formatStudyDuration(session.durationSeconds)}
                    </TableCell>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
