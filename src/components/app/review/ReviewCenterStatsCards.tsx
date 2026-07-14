import { Card, CardContent } from "@/components/ui/card";
import type { ReviewCenterStats } from "@/lib/review-center";

type ReviewCenterStatsCardsProps = {
  stats: ReviewCenterStats;
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-border/60 shadow-none">
      <CardContent className="space-y-1 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

export function ReviewCenterStatsCards({ stats }: ReviewCenterStatsCardsProps) {
  return (
    <section aria-label="Estatísticas" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Favoritas" value={stats.favorites} />
      <StatCard label="Revisão" value={stats.review} />
      <StatCard label="Erradas" value={stats.wrong} />
      <StatCard label="Nunca respondidas" value={stats.unanswered} />
    </section>
  );
}
