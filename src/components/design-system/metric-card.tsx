import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import {
  captionTypography,
  iconTileSize,
  metricValueTypography,
  smallTypography,
} from "./product-primitives";
import { Card, type CardProps } from "./card";
import { Badge, type BadgeProps } from "./badge";
import { Skeleton } from "./skeleton";

/**
 * MetricCard do novo Design System (DS-004) — construído sobre `Card`
 * (superfície), `Badge` (indicador de tendência) e `Skeleton` (estado de
 * carregamento). Nenhum estilo de card/badge/skeleton é reimplementado.
 * `Button` (DS-002A) não foi necessário: nenhum campo desta sprint pede uma
 * ação/CTA no MetricCard — ver relatório da entrega.
 */

export type MetricTrendDirection = "up" | "down" | "neutral";

export interface MetricTrend {
  direction: MetricTrendDirection;
  value: React.ReactNode;
}

const trendVariant: Record<MetricTrendDirection, NonNullable<BadgeProps["variant"]>> = {
  up: "success",
  down: "error",
  neutral: "secondary",
};

const trendIcon: Record<
  MetricTrendDirection,
  React.ComponentType<{ style?: React.CSSProperties }>
> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

export interface MetricCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: MetricTrend;
  trendLabel?: React.ReactNode;
  loading?: boolean;
  padding?: CardProps["padding"];
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      title,
      value,
      subtitle,
      icon,
      trend,
      trendLabel,
      loading = false,
      padding = "md",
      ...props
    },
    ref,
  ) => {
    const TrendIcon = trend ? trendIcon[trend.direction] : null;

    return (
      <Card ref={ref} padding={padding} className={className} {...props}>
        <div className="flex items-start justify-between gap-[var(--ds-space-4)]">
          <div className="flex min-w-0 flex-col gap-[var(--ds-space-1)]">
            <span className="text-[color:var(--ds-color-text-secondary)]" style={captionTypography}>
              {title}
            </span>

            {loading ? (
              <Skeleton
                width="calc(var(--ds-space-16) + var(--ds-space-4))"
                height="var(--ds-space-8)"
              />
            ) : (
              <span
                className="text-[color:var(--ds-color-text-primary)]"
                style={metricValueTypography}
              >
                {value}
              </span>
            )}

            {subtitle ? (
              <span className="text-[color:var(--ds-color-text-secondary)]" style={smallTypography}>
                {subtitle}
              </span>
            ) : null}
          </div>

          {icon ? (
            <div
              className="flex shrink-0 items-center justify-center rounded-[var(--ds-radius-lg)] bg-[color:var(--ds-color-action)]/10 text-[color:var(--ds-color-action)]"
              style={{ width: iconTileSize, height: iconTileSize }}
              aria-hidden="true"
            >
              {icon}
            </div>
          ) : null}
        </div>

        {trend && !loading ? (
          <div className="mt-[var(--ds-space-3)] flex items-center gap-[var(--ds-space-2)]">
            <Badge variant={trendVariant[trend.direction]} size="sm">
              {TrendIcon ? (
                <TrendIcon
                  style={{ width: smallTypography.fontSize, height: smallTypography.fontSize }}
                />
              ) : null}
              {trend.value}
            </Badge>
            {trendLabel ? (
              <span className="text-[color:var(--ds-color-text-secondary)]" style={smallTypography}>
                {trendLabel}
              </span>
            ) : null}
          </div>
        ) : null}
      </Card>
    );
  },
);
MetricCard.displayName = "MetricCard";

export { MetricCard };
