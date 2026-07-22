import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton do novo Design System (DS-002C). Convive com
 * `@/components/ui/skeleton` (Shadcn) sem substituí-lo.
 *
 * Discreto por design: cor neutra de baixo contraste (`--ds-color-border`)
 * e um pulso lento (ciclo derivado de `--ds-motion-duration-slow`, nunca o
 * shimmer default do Tailwind, rápido demais para um estado de carregamento
 * "suave"). Duração/easing aplicados via `style` (longhand) para sobrepor o
 * shorthand `animation` da classe `animate-pulse` com os valores de token.
 */

export type SkeletonRadius = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

const radiusClassName: Record<SkeletonRadius, string> = {
  sm: "rounded-[var(--ds-radius-sm)]",
  md: "rounded-[var(--ds-radius-md)]",
  lg: "rounded-[var(--ds-radius-lg)]",
  xl: "rounded-[var(--ds-radius-xl)]",
  "2xl": "rounded-[var(--ds-radius-2xl)]",
  full: "rounded-[var(--ds-radius-full)]",
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  radius?: SkeletonRadius;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { className, style, width = "100%", height = "var(--ds-space-4)", radius = "md", ...props },
    ref,
  ) => (
    <div
      ref={ref}
      role="status"
      aria-label="Carregando"
      className={cn(
        "animate-pulse bg-[color:var(--ds-color-border)]",
        radiusClassName[radius],
        className,
      )}
      style={{
        width,
        height,
        animationDuration: "calc(var(--ds-motion-duration-slow) * 5)",
        animationTimingFunction: "var(--ds-motion-ease-standard)",
        ...style,
      }}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
