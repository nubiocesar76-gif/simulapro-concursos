import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { dsFontFamily, dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { Button } from "./button";

/**
 * SidebarGroup do novo Design System (DS-003B) — puramente visual, sem
 * navegação/menu real. O toggle de `collapsible` usa `Button` (DS-002A,
 * variant="ghost") em vez de um `<button>` cru.
 */

const groupTitleTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.xs,
  fontWeight: dsFontWeight.semibold,
};

export interface SidebarGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  (
    { className, title, collapsible = false, defaultCollapsed = false, children, ...props },
    ref,
  ) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-[var(--ds-space-1)] px-[var(--ds-space-2)]", className)}
        {...props}
      >
        {title ? (
          <div className="flex items-center justify-between px-[var(--ds-space-2)] py-[var(--ds-space-1)]">
            <span
              className="text-[color:var(--ds-color-text-secondary)]"
              style={groupTitleTypography}
            >
              {title}
            </span>
            {collapsible ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-expanded={!collapsed}
                aria-label={collapsed ? "Expandir grupo" : "Recolher grupo"}
                onClick={() => setCollapsed((prev) => !prev)}
                className="h-auto w-auto p-[var(--ds-space-1)]"
              >
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "transition-transform duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]",
                    collapsed && "-rotate-90",
                  )}
                  style={{ width: dsFontSize.sm, height: dsFontSize.sm }}
                />
              </Button>
            ) : null}
          </div>
        ) : null}
        {!collapsible || !collapsed ? (
          <div className="flex flex-col gap-[var(--ds-space-1)]">{children}</div>
        ) : null}
      </div>
    );
  },
);
SidebarGroup.displayName = "SidebarGroup";

export { SidebarGroup };
