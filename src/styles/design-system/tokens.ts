/**
 * Espelho tipado de ./tokens.css (DS-001 · Foundation).
 *
 * Existe porque CSS custom properties não podem ser lidas dentro de
 * condições `@media` (ex.: hooks como src/hooks/use-mobile.tsx usam
 * `window.matchMedia` com números em TS, não `var(--ds-breakpoint-*)`).
 * Os valores abaixo devem permanecer idênticos aos de tokens.css — qualquer
 * ajuste de paleta ou escala precisa ser feito nos dois arquivos juntos.
 *
 * Não consumido por nenhum componente ainda (DS-001 é só a fundação).
 */

export const dsColor = {
  primary: "#0A1633",
  secondary: "#133E87",
  action: "#2563EB",
  actionHover: "#3B82F6",
  background: "#F8FAFC",
  backgroundDark: "#081220",
  surface: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#CBD5E1",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
} as const;

export const dsFontFamily = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const;

export const dsFontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
} as const;

export const dsFontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const dsLineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const dsSpace = {
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  6: "1.5rem",
  8: "2rem",
  12: "3rem",
  16: "4rem",
} as const;

export const dsRadius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  full: "9999px",
} as const;

export const dsShadow = {
  sm: "0 1px 2px 0 rgb(15 23 42 / 0.06)",
  md: "0 2px 8px 0 rgb(15 23 42 / 0.08)",
  lg: "0 8px 24px -4px rgb(15 23 42 / 0.12)",
} as const;

export const dsMotionDuration = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;

export const dsMotionEase = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

export const dsBreakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
