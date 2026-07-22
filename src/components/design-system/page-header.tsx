import * as React from "react";

import { cn } from "@/lib/utils";
import { Header, type HeaderProps } from "./header";

/**
 * PageHeader do novo Design System (DS-003B) — composto sobre `Header`
 * (DS-003A), não uma reimplementação. O breadcrumb fica numa faixa própria
 * acima do `Header` (que preserva sua borda inferior via `Divider`),
 * porque o `title` do `Header` é estilizado como bloco único e não deveria
 * herdar a tipografia do breadcrumb.
 */

export interface PageHeaderProps extends Omit<HeaderProps, "title"> {
  breadcrumb?: React.ReactNode;
  title?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ className, breadcrumb, title, subtitle, actions, children, ...props }, ref) => (
    <div className={cn("flex flex-col", className)}>
      {breadcrumb ? (
        <div className="px-[var(--ds-space-6)] pt-[var(--ds-space-3)]">{breadcrumb}</div>
      ) : null}
      <Header ref={ref} title={title} subtitle={subtitle} actions={actions} {...props}>
        {children}
      </Header>
    </div>
  ),
);
PageHeader.displayName = "PageHeader";

export { PageHeader };
