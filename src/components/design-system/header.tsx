import * as React from "react";

import { cn } from "@/lib/utils";
import { headerTitleTypography, descriptionTypography } from "./layout-primitives";
import { Divider } from "./divider";

/**
 * Header do novo Design System (DS-003A) — apenas o container (título,
 * subtítulo, ações, conteúdo extra). Sem breadcrumbs, sem UserMenu, sem
 * lógica. Usa `Divider` (DS-002C) como borda inferior, em vez de uma borda
 * solta.
 */

export interface HeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, title, subtitle, actions, children, ...props }, ref) => {
    const hasTitleRow = Boolean(title || subtitle || actions);

    return (
      <header
        ref={ref}
        className={cn("flex flex-col bg-[color:var(--ds-color-surface)]", className)}
        {...props}
      >
        <div className="flex flex-col gap-[var(--ds-space-3)] px-[var(--ds-space-6)] py-[var(--ds-space-4)]">
          {hasTitleRow ? (
            <div className="flex items-center justify-between gap-[var(--ds-space-4)]">
              <div className="flex flex-col gap-[var(--ds-space-1)]">
                {title ? (
                  <div
                    className="text-[color:var(--ds-color-text-primary)]"
                    style={headerTitleTypography}
                  >
                    {title}
                  </div>
                ) : null}
                {subtitle ? (
                  <div
                    className="text-[color:var(--ds-color-text-secondary)]"
                    style={descriptionTypography}
                  >
                    {subtitle}
                  </div>
                ) : null}
              </div>
              {actions ? (
                <div className="flex shrink-0 items-center gap-[var(--ds-space-2)]">{actions}</div>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
        <Divider />
      </header>
    );
  },
);
Header.displayName = "Header";

export { Header };
