import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";
import { dsFontSize, dsMotionDuration, dsSpace } from "@/styles/design-system/tokens";

/**
 * Tooltip do novo Design System (DS-002C) — wrapper próprio sobre
 * `@radix-ui/react-tooltip` (já dependência do projeto), com uma API única
 * (`content` + `children`) em vez do padrão composto do
 * `@/components/ui/tooltip` (Shadcn), que permanece intocado.
 *
 * `sideOffset` do Radix exige um número (px) em tempo de execução — não
 * aceita uma string `var(--ds-space-2)`. Por isso o valor é derivado do
 * token em JS (`parseFloat(dsSpace[2]) * REM_PX`) em vez de um número fixo
 * solto no código.
 */

const REM_PX = 16;

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: TooltipSide;
  delayDuration?: number;
  disabled?: boolean;
  className?: string;
}

function Tooltip({
  content,
  children,
  side = "top",
  delayDuration = dsMotionDuration.slow,
  disabled = false,
  className,
}: TooltipProps) {
  if (disabled || !content) return children;

  const sideOffset = parseFloat(dsSpace[2]) * REM_PX;

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className={cn(
              "z-50 overflow-hidden",
              "rounded-[var(--ds-radius-md)] bg-[color:var(--ds-color-primary)] text-[color:var(--ds-color-surface)]",
              "shadow-[var(--ds-shadow-md)]",
              "px-[var(--ds-space-3)] py-[var(--ds-space-2)]",
              "duration-[var(--ds-motion-duration-base)]",
              "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
              className,
            )}
            style={{ fontSize: dsFontSize.xs }}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-[color:var(--ds-color-primary)]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export { Tooltip };
