import {
  dsFontFamily,
  dsFontSize,
  dsFontWeight,
  dsLineHeight,
} from "@/styles/design-system/tokens";

/**
 * Constantes tipográficas compartilhadas por Header, Page e Section
 * (DS-003A). Sem JSX, não exportado no barrel público — mesmo papel de
 * `field-primitives.ts` (DS-002B): evitar repetir os mesmos valores de
 * token nos componentes de layout que têm título/descrição.
 */

export const pageTitleTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize["2xl"],
  fontWeight: dsFontWeight.bold,
  lineHeight: dsLineHeight.tight,
};

export const headerTitleTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.xl,
  fontWeight: dsFontWeight.semibold,
  lineHeight: dsLineHeight.tight,
};

export const sectionTitleTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.lg,
  fontWeight: dsFontWeight.semibold,
  lineHeight: dsLineHeight.tight,
};

export const descriptionTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.sm,
  fontWeight: dsFontWeight.regular,
  lineHeight: dsLineHeight.normal,
};
