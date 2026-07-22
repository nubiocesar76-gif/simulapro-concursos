import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { dsFontFamily, dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { Badge } from "./badge";
import { Tooltip } from "./tooltip";

/**
 * SidebarItem do novo Design System (DS-003B) — puramente visual, sem
 * integração com router (não renderiza `<Link>`, só `<button>`; a
 * navegação é responsabilidade de quem usa, via `onClick`). Pensado para
 * viver dentro de `Sidebar`/`SidebarGroup` (DS-003A/DS-003B), mas não os
 * importa — a composição acontece por aninhamento, não por import interno.
 */

const sidebarItemVariants = cva(
  cn(
    "flex w-full items-center rounded-[var(--ds-radius-md)]",
    "transition-colors duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[color:var(--ds-color-action)]",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "cursor-pointer",
  ),
  {
    variants: {
      active: {
        true: "bg-[color:var(--ds-color-action)]/10 text-[color:var(--ds-color-action)]",
        false:
          "text-[color:var(--ds-color-text-secondary)] hover:bg-[color:var(--ds-color-background)] hover:text-[color:var(--ds-color-text-primary)]",
      },
      collapsed: {
        true: "justify-center px-[var(--ds-space-2)] py-[var(--ds-space-2)]",
        false:
          "justify-start gap-[var(--ds-space-2)] px-[var(--ds-space-3)] py-[var(--ds-space-2)]",
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
    },
  },
);

const itemTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.sm,
  fontWeight: dsFontWeight.medium,
};

export interface SidebarItemProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof sidebarItemVariants> {
  icon?: React.ReactNode;
  label: React.ReactNode;
  badge?: React.ReactNode;
}

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ className, icon, label, badge, active, collapsed, disabled, ...props }, ref) => {
    const button = (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-current={active ? "page" : undefined}
        className={cn(sidebarItemVariants({ active, collapsed }), className)}
        {...props}
      >
        {icon ? (
          <span
            className="flex shrink-0 items-center"
            aria-hidden="true"
            style={{ width: dsFontSize.base, height: dsFontSize.base }}
          >
            {icon}
          </span>
        ) : null}
        {!collapsed ? (
          <span className="flex-1 truncate text-left" style={itemTypography}>
            {label}
          </span>
        ) : null}
        {!collapsed && badge != null ? (
          <Badge size="sm" variant={active ? "primary" : "secondary"}>
            {badge}
          </Badge>
        ) : null}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip content={label} side="right">
          {button}
        </Tooltip>
      );
    }

    return button;
  },
);
SidebarItem.displayName = "SidebarItem";

export { SidebarItem, sidebarItemVariants };
