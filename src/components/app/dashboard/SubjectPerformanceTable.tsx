import type { SubjectPerformance } from "@/lib/student-dashboard";
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

type SubjectPerformanceTableProps = {
  subjects: SubjectPerformance[];
};

export function SubjectPerformanceTable({ subjects }: SubjectPerformanceTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho por disciplina</CardTitle>
        <CardDescription>
          Disciplinas ordenadas do menor para o maior aproveitamento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <EmptyState
            title="Sem desempenho por disciplina"
            description="Responda questões para visualizar seu desempenho por disciplina."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disciplina</TableHead>
                <TableHead>Respondidas</TableHead>
                <TableHead>Acertos</TableHead>
                <TableHead>Percentual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.subjectId}>
                  <TableCell className="font-medium">{subject.subjectName}</TableCell>
                  <TableCell>{subject.answered}</TableCell>
                  <TableCell>{subject.correct}</TableCell>
                  <TableCell>{subject.percent}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
