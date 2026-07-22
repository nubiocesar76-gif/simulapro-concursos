import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { dsFontFamily, dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";

/**
 * Breadcrumb do novo Design System (DS-003B) — lista de itens puramente
 * visual. `href` (quando informado) vira um `<a>` nativo, nunca o `Link`
 * do TanStack Router — sem integração com rotas.
 */

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const itemTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.sm,
  fontWeight: dsFontWeight.regular,
};

const activeTypography: React.CSSProperties = {
  ...itemTypography,
  fontWeight: dsFontWeight.medium,
};

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator, ...props }, ref) => {
    const defaultSeparator = (
      <ChevronRight
        aria-hidden="true"
        className="shrink-0 text-[color:var(--ds-color-text-secondary)]"
        style={{ width: dsFontSize.xs, height: dsFontSize.xs }}
      />
    );

    return (
      <nav ref={ref} aria-label="breadcrumb" className={cn(className)} {...props}>
        <ol className="flex flex-wrap items-center gap-[var(--ds-space-1)]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isActive = item.active ?? isLast;

            return (
              <li key={index} className="flex items-center gap-[var(--ds-space-1)]">
                {index > 0 ? (separator ?? defaultSeparator) : null}
                {isActive ? (
                  <span
                    aria-current="page"
                    className="text-[color:var(--ds-color-text-primary)]"
                    style={activeTypography}
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className="text-[color:var(--ds-color-text-secondary)] hover:text-[color:var(--ds-color-text-primary)]"
                    style={itemTypography}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className="text-[color:var(--ds-color-text-secondary)]"
                    style={itemTypography}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
