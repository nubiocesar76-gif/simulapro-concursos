import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Sidebar do novo Design System (DS-003A) — casca genérica, sem menu, sem
 * navegação, sem estado próprio. `collapsed` é controlado por quem usa;
 * este componente só reflete a largura correspondente. Convive com
 * `@/components/ui/sidebar` (Shadcn, usado hoje pelo `AppShell` atual) sem
 * substituí-lo. `SidebarItem`/`SidebarGroup`/menu pertencem à DS-003B.
 *
 * Larguras compostas a partir de tokens de espaçamento (sem pixel novo):
 * expandida = 4× `--ds-space-16` (256px), recolhida = 1× `--ds-space-16`
 * (64px, trilho só com ícones).
 */

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  width?: string;
  collapsedWidth?: string;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      className,
      style,
      collapsed = false,
      width = "calc(var(--ds-space-16) * 4)",
      collapsedWidth = "var(--ds-space-16)",
      children,
      ...props
    },
    ref,
  ) => (
    <aside
      ref={ref}
      data-collapsed={collapsed || undefined}
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden",
        "bg-[color:var(--ds-color-surface)] border-r border-[color:var(--ds-color-border)]",
        "transition-[width] duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]",
        className,
      )}
      style={{ width: collapsed ? collapsedWidth : width, ...style }}
      {...props}
    >
      {children}
    </aside>
  ),
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
