import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Container do novo Design System (DS-003A). Responsável só por largura
 * máxima e padding horizontal — nenhuma cor, borda ou lógica.
 *
 * As larguras máximas reaproveitam os próprios breakpoints da DS-001
 * (`--ds-breakpoint-*`) em vez de uma escala nova — "sm" para no breakpoint
 * sm, "md" no md, e assim por diante.
 */

const containerVariants = cva("mx-auto w-full px-[var(--ds-space-6)]", {
  variants: {
    size: {
      sm: "max-w-[var(--ds-breakpoint-sm)]",
      md: "max-w-[var(--ds-breakpoint-md)]",
      lg: "max-w-[var(--ds-breakpoint-lg)]",
      xl: "max-w-[var(--ds-breakpoint-xl)]",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div ref={ref} className={cn(containerVariants({ size }), className)} {...props} />
  ),
);
Container.displayName = "Container";

export { Container, containerVariants };
