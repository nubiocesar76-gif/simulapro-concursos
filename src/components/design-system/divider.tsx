import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Divider do novo Design System (DS-002C). Convive com
 * `@/components/ui/separator` (Shadcn) sem substituí-lo — implementação
 * nova, sem Radix, com as 3 variantes de intensidade pedidas.
 *
 * `subtle`/`strong` são derivadas do único token de borda existente
 * (`--ds-color-border`) por opacidade, e do token de texto secundário
 * (`--ds-color-text-secondary`) para o traço mais forte — nenhuma cor nova
 * foi inventada, apenas reaproveitada.
 *
 * A espessura de 1px é uma constante de "hairline" (mesma decisão já usada
 * em `@/components/ui/separator.tsx`), não faz parte da escala de espaçamento.
 */

const dividerVariants = cva("shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
    variant: {
      default: "bg-[color:var(--ds-color-border)]",
      subtle: "bg-[color:var(--ds-color-border)]/50",
      strong: "bg-[color:var(--ds-color-text-secondary)]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "default",
  },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dividerVariants> {}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = "horizontal", variant, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation ?? "horizontal"}
      className={cn(dividerVariants({ orientation, variant }), className)}
      {...props}
    />
  ),
);
Divider.displayName = "Divider";

export { Divider, dividerVariants };
