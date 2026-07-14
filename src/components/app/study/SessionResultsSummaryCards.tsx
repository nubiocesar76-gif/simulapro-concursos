import { Card, CardContent } from "@/components/ui/card";
import { formatStudyDuration } from "@/lib/student-dashboard";
import type { SessionResultsSummary } from "@/lib/study-engine";

type SessionResultsSummaryCardsProps = {
  summary: SessionResultsSummary;
};

function MetricCard({
  label,
  value,
  hint,
  highlight = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-primary/30 bg-primary/[0.03]" : "border-border/60 shadow-none"}>
      <CardContent className="space-y-1 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`text-2xl font-semibold tabular-nums tracking-tight ${highlight ? "text-primary" : ""}`}>
          {value}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function SessionResultsSummaryCards({ summary }: SessionResultsSummaryCardsProps) {
  return (
    <section aria-label="Resumo do desempenho" className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Aproveitamento" value={`${summary.percentage}%`} highlight />
        <MetricCard label="Acertos" value={summary.correctCount} />
        <MetricCard label="Erros" value={summary.wrongCount} />
        <MetricCard
          label="Tempo"
          value={formatStudyDuration(summary.totalTimeSeconds)}
          hint={`Média ${formatStudyDuration(summary.averageTimeSeconds)}/questão`}
        />
        <MetricCard
          label="Questões respondidas"
          value={summary.answeredCount}
          hint={`de ${summary.totalQuestions} na sessão`}
        />
      </div>
    </section>
  );
}
