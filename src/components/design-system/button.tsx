import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  dsFontFamily,
  dsFontSize,
  dsFontWeight,
  dsLineHeight,
} from "@/styles/design-system/tokens";

/**
 * Button do novo Design System (DS-002A). Convive com
 * `@/components/ui/button` (Shadcn) sem substituí-lo — nenhuma tela importa
 * este componente automaticamente. Todo valor visual vem de
 * `@/styles/design-system/tokens.css` (cor, radius, shadow, spacing, motion)
 * ou de `@/styles/design-system/tokens.ts` (tipografia, via style inline —
 * `font-*`/`text-*` arbitrários do Tailwind são ambíguos para var() sem
 * essa camada).
 */

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-[var(--ds-radius-lg)] border border-transparent",
    "transition-colors duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[color:var(--ds-color-action)]",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "cursor-pointer",
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-[color:var(--ds-color-action)] text-[color:var(--ds-color-surface)] hover:bg-[color:var(--ds-color-action-hover)]",
        secondary:
          "bg-[color:var(--ds-color-secondary)] text-[color:var(--ds-color-surface)] hover:bg-[color:var(--ds-color-primary)]",
        outline:
          "border-[color:var(--ds-color-border)] bg-transparent text-[color:var(--ds-color-text-primary)] hover:bg-[color:var(--ds-color-background)]",
        ghost:
          "bg-transparent text-[color:var(--ds-color-text-primary)] hover:bg-[color:var(--ds-color-background)]",
        destructive:
          "bg-[color:var(--ds-color-error)] text-[color:var(--ds-color-surface)] hover:bg-[color:var(--ds-color-error)]/90",
        success:
          "bg-[color:var(--ds-color-success)] text-[color:var(--ds-color-surface)] hover:bg-[color:var(--ds-color-success)]/90",
        warning:
          "bg-[color:var(--ds-color-warning)] text-[color:var(--ds-color-surface)] hover:bg-[color:var(--ds-color-warning)]/90",
      },
      size: {
        sm: "gap-[var(--ds-space-1)] px-[var(--ds-space-3)] py-[var(--ds-space-1)]",
        md: "gap-[var(--ds-space-2)] px-[var(--ds-space-4)] py-[var(--ds-space-2)]",
        lg: "gap-[var(--ds-space-2)] px-[var(--ds-space-6)] py-[var(--ds-space-3)]",
        xl: "gap-[var(--ds-space-3)] px-[var(--ds-space-8)] py-[var(--ds-space-3)]",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonSize = "sm" | "md" | "lg" | "xl";

const sizeTypography: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    fontFamily: dsFontFamily.sans,
    fontSize: dsFontSize.xs,
    fontWeight: dsFontWeight.medium,
    lineHeight: dsLineHeight.normal,
  },
  md: {
    fontFamily: dsFontFamily.sans,
    fontSize: dsFontSize.sm,
    fontWeight: dsFontWeight.medium,
    lineHeight: dsLineHeight.normal,
  },
  lg: {
    fontFamily: dsFontFamily.sans,
    fontSize: dsFontSize.base,
    fontWeight: dsFontWeight.medium,
    lineHeight: dsLineHeight.normal,
  },
  xl: {
    fontFamily: dsFontFamily.sans,
    fontSize: dsFontSize.lg,
    fontWeight: dsFontWeight.semibold,
    lineHeight: dsLineHeight.normal,
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  loadingSpinner?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      style,
      variant,
      size,
      fullWidth,
      asChild = false,
      leftIcon,
      rightIcon,
      loading = false,
      loadingSpinner,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedSize: ButtonSize = size ?? "md";

    if (asChild) {
      // Slot exige um único elemento filho para clonar — leftIcon/rightIcon/
      // loading não são compostos aqui; quem usa asChild deve incluir ícones
      // dentro do próprio elemento filho (ex.: <Link>).
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          style={{ ...sizeTypography[resolvedSize], ...style }}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        style={{ ...sizeTypography[resolvedSize], ...style }}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading
          ? (loadingSpinner ?? (
              <Loader2
                aria-hidden="true"
                className="animate-spin"
                style={{ width: dsFontSize.base, height: dsFontSize.base }}
              />
            ))
          : leftIcon}
        {children}
        {!loading ? rightIcon : null}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
