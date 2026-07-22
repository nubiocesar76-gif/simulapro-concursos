import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Card do novo Design System (DS-002A). Genérico — sem qualquer variante
 * específica do SimulaPro (MetricCard, PlanCard, etc. pertencem a sprints
 * futuras). Convive com `@/components/ui/card` (Shadcn) sem substituí-lo.
 * Cor, radius, shadow e spacing consomem exclusivamente
 * `@/styles/design-system/tokens.css`.
 */

const cardVariants = cva(
  cn(
    "min-w-0 bg-[color:var(--ds-color-surface)] text-[color:var(--ds-color-text-primary)]",
    "transition-shadow duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]",
  ),
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-[var(--ds-space-4)]",
        md: "p-[var(--ds-space-6)]",
        lg: "p-[var(--ds-space-8)]",
      },
      radius: {
        sm: "rounded-[var(--ds-radius-sm)]",
        md: "rounded-[var(--ds-radius-md)]",
        lg: "rounded-[var(--ds-radius-lg)]",
        xl: "rounded-[var(--ds-radius-xl)]",
        "2xl": "rounded-[var(--ds-radius-2xl)]",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-[var(--ds-shadow-sm)]",
        md: "shadow-[var(--ds-shadow-md)]",
        lg: "shadow-[var(--ds-shadow-lg)]",
      },
      bordered: {
        true: "border border-[color:var(--ds-color-border)]",
        false: "border border-transparent",
      },
      hover: {
        true: "hover:shadow-[var(--ds-shadow-md)] cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      padding: "none",
      radius: "lg",
      shadow: "sm",
      bordered: true,
      hover: false,
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding, radius, shadow, bordered, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ padding, radius, shadow, bordered, hover, className }))}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-[var(--ds-space-1)] p-[var(--ds-space-6)]", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-[var(--ds-space-6)] pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-[var(--ds-space-2)] p-[var(--ds-space-6)] pt-0",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter, cardVariants };
