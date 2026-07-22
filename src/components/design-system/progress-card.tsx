import * as React from "react";

import { cardTitleTypography, smallTypography } from "./product-primitives";
import { Card, type CardProps } from "./card";
import { Skeleton } from "./skeleton";

/**
 * ProgressCard do novo Design System (DS-004) — construído sobre `Card` e
 * `Skeleton`. A barra de progresso é uma div simples (largura em %), sem
 * biblioteca de gráficos — conforme exigido nesta sprint.
 */

export interface ProgressCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  current: number;
  total: number;
  percentage?: number;
  footer?: React.ReactNode;
  loading?: boolean;
  padding?: CardProps["padding"];
}

const ProgressCard = React.forwardRef<HTMLDivElement, ProgressCardProps>(
  (
    {
      className,
      title,
      current,
      total,
      percentage,
      footer,
      loading = false,
      padding = "md",
      ...props
    },
    ref,
  ) => {
    const computedPercentage = percentage ?? (total > 0 ? (current / total) * 100 : 0);
    const clampedPercentage = Math.min(100, Math.max(0, computedPercentage));

    return (
      <Card ref={ref} padding={padding} className={className} {...props}>
        <div className="flex flex-col gap-[var(--ds-space-3)]">
          <div className="flex items-center justify-between gap-[var(--ds-space-2)]">
            <span className="text-[color:var(--ds-color-text-primary)]" style={cardTitleTypography}>
              {title}
            </span>
            {loading ? (
              <Skeleton
                width="calc(var(--ds-space-8) + var(--ds-space-4))"
                height="var(--ds-space-3)"
              />
            ) : (
              <span className="text-[color:var(--ds-color-text-secondary)]" style={smallTypography}>
                {current}/{total}
              </span>
            )}
          </div>

          {loading ? (
            <Skeleton width="100%" height="var(--ds-space-2)" radius="full" />
          ) : (
            <div
              className="h-[var(--ds-space-2)] w-full overflow-hidden rounded-[var(--ds-radius-full)] bg-[color:var(--ds-color-border)]"
              role="progressbar"
              aria-valuenow={Math.round(clampedPercentage)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-[var(--ds-radius-full)] bg-[color:var(--ds-color-action)] transition-[width] duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]"
                style={{ width: `${clampedPercentage}%` }}
              />
            </div>
          )}

          {footer ? (
            <div className="text-[color:var(--ds-color-text-secondary)]" style={smallTypography}>
              {footer}
            </div>
          ) : null}
        </div>
      </Card>
    );
  },
);
ProgressCard.displayName = "ProgressCard";

export { ProgressCard };
