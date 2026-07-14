import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PerformanceGroup } from "@/lib/session-results-analytics";

type SessionResultsPerformanceTableProps = {
  title: string;
  description?: string;
  groups: PerformanceGroup[];
  nameColumnLabel: string;
  emptyMessage: string;
  formatValue?: (group: PerformanceGroup) => string;
};

export function SessionResultsPerformanceTable({
  title,
  description,
  groups,
  nameColumnLabel,
  emptyMessage,
  formatValue,
}: SessionResultsPerformanceTableProps) {
  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{nameColumnLabel}</TableHead>
                  <TableHead className="text-right">Questões</TableHead>
                  <TableHead className="text-right">Acertos</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.key}>
                    <TableCell className="font-medium">{group.label}</TableCell>
                    <TableCell className="text-right tabular-nums">{group.total}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatValue ? formatValue(group) : group.correct}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{group.percent}%</TableCell>
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
