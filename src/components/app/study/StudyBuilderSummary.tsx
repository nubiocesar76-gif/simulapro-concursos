import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STUDY_MODE_LABELS, type StudyModeSelectable } from "@/lib/study-session";

type StudyBuilderSummaryProps = {
  packageName: string;
  mode: StudyModeSelectable;
  boardLabel: string;
  subjectLabel: string;
  topicLabel: string;
  yearLabel: string;
  matchingCount: number;
  selectedQuantityLabel: string;
};

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[58%] text-right font-medium leading-snug">{value}</span>
    </div>
  );
}

export function StudyBuilderSummary({
  packageName,
  mode,
  boardLabel,
  subjectLabel,
  topicLabel,
  yearLabel,
  matchingCount,
  selectedQuantityLabel,
}: StudyBuilderSummaryProps) {
  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Resumo da sessão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Questões encontradas
          </p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{matchingCount}</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <SummaryRow label="Banco" value={packageName} />
          <SummaryRow label="Modo" value={STUDY_MODE_LABELS[mode]} />
          <SummaryRow label="Banca" value={boardLabel} />
          <SummaryRow label="Disciplina" value={subjectLabel} />
          <SummaryRow label="Assunto" value={topicLabel} />
          <SummaryRow label="Ano" value={yearLabel} />
          <SummaryRow label="Quantidade selecionada" value={selectedQuantityLabel} />
        </div>
      </CardContent>
    </Card>
  );
}
