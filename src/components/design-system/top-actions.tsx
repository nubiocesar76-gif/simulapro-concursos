import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * TopActions do novo Design System (DS-003B) — container horizontal para
 * ações, sem lógica. Quem usa decide o conteúdo (Button, Tooltip, etc. da
 * DS-002A/DS-002C).
 */

export type TopActionsProps = React.HTMLAttributes<HTMLDivElement>;

const TopActions = React.forwardRef<HTMLDivElement, TopActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-[var(--ds-space-2)]", className)}
      {...props}
    >
      {children}
    </div>
  ),
);
TopActions.displayName = "TopActions";

export { TopActions };
