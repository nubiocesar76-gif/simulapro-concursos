import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * AppShell do novo Design System (DS-003A) — só estrutura visual (slots
 * header/sidebar/content/footer). Sem autenticação, sem consulta, sem
 * menu, sem qualquer regra do SimulaPro — isso é responsabilidade do
 * `@/components/AppShell.tsx` atual, que continua em uso e não é
 * substituído por este.
 */

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ className, header, sidebar, footer, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex min-h-screen w-full bg-[color:var(--ds-color-background)]", className)}
      {...props}
    >
      {sidebar}
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        {header}
        <main className="flex-1">{children}</main>
        {footer}
      </div>
    </div>
  ),
);
AppShell.displayName = "AppShell";

export { AppShell };
