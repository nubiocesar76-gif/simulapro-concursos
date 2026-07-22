import { STUDY_MODE_LABELS, type StudyMode } from "@/lib/study-session";
import { Badge } from "@/components/design-system";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";

type SessionHeaderProps = {
  title: string;
  subtitle: string;
  mode: StudyMode;
};

/**
 * Mantido por compatibilidade — a tela de sessão (`StudySessionPage`) passou
 * a usar `title`/`description`/`actions` do próprio `Section` (DS-003A/
 * DS-004) diretamente, então este componente não é mais chamado ali. Ainda
 * assim, restilizado com os tokens do Design System para o caso de voltar
 * a ser usado em outro lugar.
 */
export function SessionHeader({ title, subtitle, mode }: SessionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-[var(--ds-space-3)]">
      <div className="flex flex-col gap-[var(--ds-space-1)]">
        <div
          className="text-[color:var(--ds-color-text-primary)]"
          style={{ fontSize: dsFontSize.xl, fontWeight: dsFontWeight.semibold }}
        >
          {title}
        </div>
        <div
          className="text-[color:var(--ds-color-text-secondary)]"
          style={{ fontSize: dsFontSize.sm }}
        >
          {subtitle}
        </div>
      </div>
      <Badge variant="secondary">{STUDY_MODE_LABELS[mode]}</Badge>
    </div>
  );
}
