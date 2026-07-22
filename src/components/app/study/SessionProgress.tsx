import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";

type SessionProgressProps = {
  current: number;
  total: number;
  label?: string;
};

export function SessionProgress({ current, total, label = "Progresso" }: SessionProgressProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-[var(--ds-space-2)]">
      <div className="flex items-center justify-between" style={{ fontSize: dsFontSize.sm }}>
        <span className="text-[color:var(--ds-color-text-secondary)]">{label}</span>
        <span
          className="text-[color:var(--ds-color-text-primary)]"
          style={{ fontWeight: dsFontWeight.medium }}
        >
          {current} de {total}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: "var(--ds-color-border)" }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]"
          style={{ width: `${percent}%`, background: "var(--ds-color-action)" }}
        />
      </div>
    </div>
  );
}
