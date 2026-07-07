import { formatStudyDuration, type HistorySummaryStats as HistorySummaryStatsData } from "@/lib/student-dashboard";

type HistorySummaryStatsProps = {
  stats: HistorySummaryStatsData;
};

function StatSegment({ label, value }: { label: string; value: string | number }) {
  return (
    <span>
      {label}:{" "}
      <span className="font-medium text-foreground tabular-nums">{value}</span>
    </span>
  );
}

function Dot() {
  return <span aria-hidden="true" className="mx-2 text-muted-foreground/60">·</span>;
}

export function HistorySummaryStats({ stats }: HistorySummaryStatsProps) {
  return (
    <div
      className="rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground"
      aria-label="Resumo do histórico"
    >
      <p className="hidden flex-wrap items-center sm:flex">
        <StatSegment label="Sessões registradas" value={stats.totalSessions} />
        <Dot />
        <StatSegment label="Questões respondidas" value={stats.questionsAnswered} />
        <Dot />
        <StatSegment label="Aprov." value={`${stats.accuracyPercent}%`} />
        <Dot />
        <StatSegment
          label="Tempo total de estudo"
          value={formatStudyDuration(stats.totalStudySeconds)}
        />
      </p>
      <p className="tabular-nums sm:hidden">
        <span className="font-medium text-foreground">{stats.totalSessions}</span> sessões
        <Dot />
        <span className="font-medium text-foreground">{stats.accuracyPercent}%</span> aprov.
      </p>
    </div>
  );
}
