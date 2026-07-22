import type { SubjectPerformance } from "@/lib/student-dashboard";
import { EmptyState, Section } from "@/components/design-system";
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
    <Section
      title="Desempenho por disciplina"
      description="Disciplinas ordenadas do menor para o maior aproveitamento."
    >
      {subjects.length === 0 ? (
        <EmptyState
          title="Sem desempenho por disciplina"
          description="Responda questões para visualizar seu desempenho por disciplina."
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--ds-radius-lg)] border border-[color:var(--ds-color-border)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[12rem]">Disciplina</TableHead>
                <TableHead className="min-w-[6rem]">Respondidas</TableHead>
                <TableHead className="min-w-[5rem]">Acertos</TableHead>
                <TableHead className="min-w-[5rem]">Percentual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.subjectId}>
                  <TableCell className="max-w-[16rem] truncate font-medium">
                    {subject.subjectName}
                  </TableCell>
                  <TableCell className="tabular-nums">{subject.answered}</TableCell>
                  <TableCell className="tabular-nums">{subject.correct}</TableCell>
                  <TableCell className="tabular-nums">{subject.percent}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Section>
  );
}
