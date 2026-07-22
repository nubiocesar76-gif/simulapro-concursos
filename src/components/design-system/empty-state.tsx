import * as React from "react";

import { cn } from "@/lib/utils";
import {
  emptyStateTitleTypography,
  emptyStateDescriptionTypography,
  iconTileSize,
} from "./product-primitives";
import { Button, type ButtonProps } from "./button";

/**
 * EmptyState do novo Design System (DS-004) — construído usando `Button`
 * (DS-002A) para a ação; não recria estilos de botão.
 */

export interface EmptyStateAction {
  label: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  variant?: ButtonProps["variant"];
}

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: EmptyStateAction;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "gap-[var(--ds-space-3)] px-[var(--ds-space-6)] py-[var(--ds-space-8)]",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          className="flex shrink-0 items-center justify-center rounded-[var(--ds-radius-lg)] bg-[color:var(--ds-color-action)]/10 text-[color:var(--ds-color-action)]"
          style={{ width: iconTileSize, height: iconTileSize }}
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}

      <div className="flex flex-col gap-[var(--ds-space-1)]">
        <div
          className="text-[color:var(--ds-color-text-primary)]"
          style={emptyStateTitleTypography}
        >
          {title}
        </div>
        {description ? (
          <div
            className="text-[color:var(--ds-color-text-secondary)]"
            style={emptyStateDescriptionTypography}
          >
            {description}
          </div>
        ) : null}
      </div>

      {action ? (
        <Button
          variant={action.variant ?? "primary"}
          size="sm"
          onClick={action.onClick}
          leftIcon={action.icon}
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
