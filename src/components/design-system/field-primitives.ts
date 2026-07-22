import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  dsFontFamily,
  dsFontSize,
  dsFontWeight,
  dsLineHeight,
} from "@/styles/design-system/tokens";

/**
 * Peças internas compartilhadas por Input, Textarea e Select (DS-002B).
 * Não é um componente novo (sem JSX, sem export no barrel público) — existe
 * só para não duplicar as mesmas classes/estilos de token nos três
 * arquivos, seguindo a mesma exigência de composição já usada na DS-002A.
 */

export type FieldSize = "sm" | "md" | "lg";
export type FieldStatus = "default" | "error" | "success";

export function resolveFieldStatus(errorText?: string, successText?: string): FieldStatus {
  if (errorText) return "error";
  if (successText) return "success";
  return "default";
}

export const controlShellVariants = cva(
  cn(
    "flex w-full items-center bg-[color:var(--ds-color-surface)] text-[color:var(--ds-color-text-primary)]",
    "rounded-[var(--ds-radius-lg)] border",
    "shadow-[var(--ds-shadow-sm)]",
    "transition-colors duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]",
  ),
  {
    variants: {
      size: {
        sm: "gap-[var(--ds-space-1)] px-[var(--ds-space-2)] py-[var(--ds-space-1)]",
        md: "gap-[var(--ds-space-2)] px-[var(--ds-space-3)] py-[var(--ds-space-2)]",
        lg: "gap-[var(--ds-space-2)] px-[var(--ds-space-4)] py-[var(--ds-space-3)]",
      },
      status: {
        default:
          "border-[color:var(--ds-color-border)] hover:border-[color:var(--ds-color-secondary)] focus-within:border-[color:var(--ds-color-action)] focus-within:ring-2 focus-within:ring-[color:var(--ds-color-action)]",
        error:
          "border-[color:var(--ds-color-error)] focus-within:border-[color:var(--ds-color-error)] focus-within:ring-2 focus-within:ring-[color:var(--ds-color-error)]",
        success:
          "border-[color:var(--ds-color-success)] focus-within:border-[color:var(--ds-color-success)] focus-within:ring-2 focus-within:ring-[color:var(--ds-color-success)]",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      status: "default",
      disabled: false,
    },
  },
);

export const fieldMessageVariants = cva("", {
  variants: {
    tone: {
      helper: "text-[color:var(--ds-color-text-secondary)]",
      error: "text-[color:var(--ds-color-error)]",
      success: "text-[color:var(--ds-color-success)]",
    },
  },
  defaultVariants: {
    tone: "helper",
  },
});

export const fieldLabelClassName = "text-[color:var(--ds-color-text-primary)]";

export const fieldRequiredMarkClassName = "text-[color:var(--ds-color-error)]";

export const controlTypography: Record<FieldSize, React.CSSProperties> = {
  sm: {
    fontFamily: dsFontFamily.sans,
    fontSize: dsFontSize.xs,
    lineHeight: dsLineHeight.normal,
  },
  md: {
    fontFamily: dsFontFamily.sans,
    fontSize: dsFontSize.sm,
    lineHeight: dsLineHeight.normal,
  },
  lg: {
    fontFamily: dsFontFamily.sans,
    fontSize: dsFontSize.base,
    lineHeight: dsLineHeight.normal,
  },
};

export const labelTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.sm,
  fontWeight: dsFontWeight.medium,
  lineHeight: dsLineHeight.normal,
};

export const messageTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.xs,
  fontWeight: dsFontWeight.regular,
  lineHeight: dsLineHeight.normal,
};

export const iconSizeBySize: Record<FieldSize, string> = {
  sm: dsFontSize.sm,
  md: dsFontSize.base,
  lg: dsFontSize.lg,
};
