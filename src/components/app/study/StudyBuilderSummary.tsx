import { Card, CardHeader, CardContent, Divider } from "@/components/design-system";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
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
    <div
      className="flex items-start justify-between gap-[var(--ds-space-3)]"
      style={{ fontSize: dsFontSize.sm }}
    >
      <span className="text-[color:var(--ds-color-text-secondary)]">{label}</span>
      <span
        className="max-w-[58%] text-right leading-snug text-[color:var(--ds-color-text-primary)]"
        style={{ fontWeight: dsFontWeight.medium }}
      >
        {value}
      </span>
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
    <Card padding="none" className="shadow-none">
      <CardHeader className="pb-3">
        <span
          className="text-[color:var(--ds-color-text-primary)]"
          style={{ fontSize: dsFontSize.base, fontWeight: dsFontWeight.semibold }}
        >
          Resumo da sessão
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-[var(--ds-space-4)] pt-0">
        <div
          className="rounded-[var(--ds-radius-lg)] border px-4 py-3 text-center"
          style={{
            borderColor: "var(--ds-color-border)",
            background: "var(--ds-color-background)",
          }}
        >
          <p
            className="uppercase tracking-[0.08em] text-[color:var(--ds-color-text-secondary)]"
            style={{ fontSize: dsFontSize.xs, fontWeight: dsFontWeight.medium }}
          >
            Questões encontradas
          </p>
          <p
            className="mt-1 tabular-nums text-[color:var(--ds-color-text-primary)]"
            style={{ fontSize: dsFontSize["3xl"], fontWeight: dsFontWeight.semibold }}
          >
            {matchingCount}
          </p>
        </div>

        <Divider />

        <div className="flex flex-col gap-[var(--ds-space-2)]">
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
