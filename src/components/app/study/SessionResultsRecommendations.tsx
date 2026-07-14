import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionRecommendation } from "@/lib/session-results-analytics";

type SessionResultsRecommendationsProps = {
  recommendations: SessionRecommendation[];
};

export function SessionResultsRecommendations({ recommendations }: SessionResultsRecommendationsProps) {
  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" aria-hidden />
          <CardTitle className="text-base">Recomendações</CardTitle>
        </div>
        <CardDescription>
          Prioridade: menor aproveitamento, mais erros e maior recorrência na sessão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Excelente desempenho — nenhum assunto crítico para revisão nesta sessão.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium">Revise:</p>
            <ul className="space-y-2">
              {recommendations.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">
                    {item.percent}% · {item.wrong} erro{item.wrong === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
