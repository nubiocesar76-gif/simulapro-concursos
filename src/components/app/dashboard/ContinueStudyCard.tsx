import { Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import { STUDY_MODE_LABELS } from "@/lib/study-session";
import type { ContinueStudy } from "@/lib/student-dashboard";
import { Badge, Button, Section } from "@/components/design-system";
import { dsFontSize } from "@/styles/design-system/tokens";

type ContinueStudyCardProps = {
  session: ContinueStudy;
};

export function ContinueStudyCard({ session }: ContinueStudyCardProps) {
  const progressLabel =
    session.totalCount > 0
      ? `${session.answeredCount} de ${session.totalCount}`
      : "Aguardando início";

  return (
    <Section
      title="Continuar última sessão"
      description="Retome de onde você parou."
      className="border-[color:var(--ds-color-action)]/30 bg-[color:var(--ds-color-action)]/5"
    >
      <div className="flex flex-col gap-[var(--ds-space-4)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-[var(--ds-space-2)] text-sm">
          <p className="truncate font-medium">{session.distributionName}</p>
          <div className="flex flex-wrap items-center gap-[var(--ds-space-2)]">
            <Badge variant="secondary">{STUDY_MODE_LABELS[session.mode]}</Badge>
            <span className="text-[color:var(--ds-color-text-secondary)] tabular-nums">
              Progresso: {progressLabel}
            </span>
          </div>
        </div>
        <Button asChild fullWidth className="sm:w-auto">
          <Link to="/app/study/$sessionId" params={{ sessionId: session.sessionId }}>
            <PlayCircle
              aria-hidden="true"
              style={{ width: dsFontSize.base, height: dsFontSize.base }}
            />
            Continuar
          </Link>
        </Button>
      </div>
    </Section>
  );
}
