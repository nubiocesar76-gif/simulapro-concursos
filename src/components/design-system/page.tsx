import * as React from "react";

import { cn } from "@/lib/utils";
import { pageTitleTypography, descriptionTypography } from "./layout-primitives";

/**
 * Page do novo Design System (DS-003A) — título, descrição, ações e
 * conteúdo de uma página. Sem lógica, sem Container/Card embutido: quem usa
 * decide se envolve em `Container` (largura) por fora.
 */

export interface PageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ className, title, description, actions, children, ...props }, ref) => {
    const hasHeaderRow = Boolean(title || description || actions);

    return (
      <div ref={ref} className={cn("flex flex-col gap-[var(--ds-space-6)]", className)} {...props}>
        {hasHeaderRow ? (
          <div className="flex items-start justify-between gap-[var(--ds-space-4)]">
            <div className="flex flex-col gap-[var(--ds-space-1)]">
              {title ? (
                <h1
                  className="text-[color:var(--ds-color-text-primary)]"
                  style={pageTitleTypography}
                >
                  {title}
                </h1>
              ) : null}
              {description ? (
                <p
                  className="text-[color:var(--ds-color-text-secondary)]"
                  style={descriptionTypography}
                >
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? (
              <div className="flex shrink-0 items-center gap-[var(--ds-space-2)]">{actions}</div>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    );
  },
);
Page.displayName = "Page";

export { Page };
