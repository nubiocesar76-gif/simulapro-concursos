import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { dsFontFamily, dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";

/**
 * Badge do novo Design System (DS-002A). Convive com `@/components/ui/badge`
 * (Shadcn) sem substituí-lo. Cor, radius e spacing consomem exclusivamente
 * `@/styles/design-system/tokens.css`; tamanho de fonte via
 * `@/styles/design-system/tokens.ts` (style inline — ver nota em button.tsx
 * sobre ambiguidade de `text-*`/`font-*` arbitrários com var()).
 */

const badgeVariants = cva(
  cn(
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-[var(--ds-radius-md)] border border-transparent",
    "transition-colors duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]",
  ),
  {
    variants: {
      variant: {
        primary: "bg-[color:var(--ds-color-action)] text-[color:var(--ds-color-surface)]",
        secondary: "bg-[color:var(--ds-color-secondary)] text-[color:var(--ds-color-surface)]",
        success: "bg-[color:var(--ds-color-success)] text-[color:var(--ds-color-surface)]",
        warning: "bg-[color:var(--ds-color-warning)] text-[color:var(--ds-color-surface)]",
        error: "bg-[color:var(--ds-color-error)] text-[color:var(--ds-color-surface)]",
        outline:
          "border-[color:var(--ds-color-border)] bg-transparent text-[color:var(--ds-color-text-primary)]",
        ghost: "bg-transparent text-[color:var(--ds-color-text-primary)]",
      },
      size: {
        sm: "gap-[var(--ds-space-1)] px-[var(--ds-space-2)] py-0",
        md: "gap-[var(--ds-space-1)] px-[var(--ds-space-3)] py-[var(--ds-space-1)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type BadgeSize = "sm" | "md";

const sizeTypography: Record<BadgeSize, React.CSSProperties> = {
  sm: {
    fontFamily: dsFontFamily.sans,
    fontSize: dsFontSize.xs,
    fontWeight: dsFontWeight.medium,
  },
  md: {
    fontFamily: dsFontFamily.sans,
    fontSize: dsFontSize.sm,
    fontWeight: dsFontWeight.medium,
  },
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, style, variant, size, ...props }: BadgeProps) {
  const resolvedSize: BadgeSize = size ?? "md";

  return (
    <div
      className={cn(badgeVariants({ variant, size, className }))}
      style={{ ...sizeTypography[resolvedSize], ...style }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
