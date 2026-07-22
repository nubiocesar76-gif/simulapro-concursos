import {
  dsFontFamily,
  dsFontSize,
  dsFontWeight,
  dsLineHeight,
} from "@/styles/design-system/tokens";

/**
 * Constantes compartilhadas por MetricCard, ProgressCard e EmptyState
 * (DS-004). Sem JSX, não exportado no barrel público — mesmo papel de
 * `field-primitives.ts`/`layout-primitives.ts` das sprints anteriores.
 */

export const captionTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.sm,
  fontWeight: dsFontWeight.medium,
  lineHeight: dsLineHeight.normal,
};

export const metricValueTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize["3xl"],
  fontWeight: dsFontWeight.bold,
  lineHeight: dsLineHeight.tight,
};

export const cardTitleTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.sm,
  fontWeight: dsFontWeight.semibold,
  lineHeight: dsLineHeight.normal,
};

export const smallTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.xs,
  fontWeight: dsFontWeight.regular,
  lineHeight: dsLineHeight.normal,
};

export const emptyStateTitleTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.lg,
  fontWeight: dsFontWeight.semibold,
  lineHeight: dsLineHeight.tight,
};

export const emptyStateDescriptionTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.sm,
  fontWeight: dsFontWeight.regular,
  lineHeight: dsLineHeight.normal,
};

/** 36px — composto de `--ds-space-8` (32px) + `--ds-space-1` (4px), sem pixel novo. */
export const iconTileSize = "calc(var(--ds-space-8) + var(--ds-space-1))";
