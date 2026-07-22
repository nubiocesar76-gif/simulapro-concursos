import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";
import { dsFontFamily, dsFontSize, dsFontWeight, dsSpace } from "@/styles/design-system/tokens";
import { Avatar } from "./avatar";
import { Divider } from "./divider";

/**
 * UserMenu do novo Design System (DS-003B) — puramente visual, sem
 * autenticação. Usa `@radix-ui/react-dropdown-menu` (já dependência do
 * projeto) diretamente, sem tocar em `@/components/ui/dropdown-menu`.
 * `menuChildren` é conteúdo livre — quem usa decide o que colocar ali.
 */

const REM_PX = 16;

const nameTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.sm,
  fontWeight: dsFontWeight.medium,
};

const descriptionTypography: React.CSSProperties = {
  fontFamily: dsFontFamily.sans,
  fontSize: dsFontSize.xs,
  fontWeight: dsFontWeight.regular,
};

export interface UserMenuProps {
  name: React.ReactNode;
  description?: React.ReactNode;
  avatarSrc?: string;
  menuChildren?: React.ReactNode;
  className?: string;
}

function UserMenu({ name, description, avatarSrc, menuChildren, className }: UserMenuProps) {
  const sideOffset = parseFloat(dsSpace[2]) * REM_PX;

  const identity = (
    <>
      <Avatar size="sm" src={avatarSrc} name={typeof name === "string" ? name : undefined} />
      <div className="flex min-w-0 flex-col items-start text-left">
        <span className="truncate text-[color:var(--ds-color-text-primary)]" style={nameTypography}>
          {name}
        </span>
        {description ? (
          <span
            className="truncate text-[color:var(--ds-color-text-secondary)]"
            style={descriptionTypography}
          >
            {description}
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-[var(--ds-space-2)] rounded-[var(--ds-radius-md)]",
            "px-[var(--ds-space-2)] py-[var(--ds-space-2)]",
            "transition-colors duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]",
            "hover:bg-[color:var(--ds-color-background)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-[color:var(--ds-color-action)]",
            "cursor-pointer",
            className,
          )}
        >
          {identity}
        </button>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={sideOffset}
          className={cn(
            "z-50 min-w-[calc(var(--ds-space-16)*2)] overflow-hidden",
            "rounded-[var(--ds-radius-lg)] border border-[color:var(--ds-color-border)]",
            "bg-[color:var(--ds-color-surface)] shadow-[var(--ds-shadow-md)]",
            "p-[var(--ds-space-2)]",
            "duration-[var(--ds-motion-duration-base)]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
        >
          <div className="flex items-center gap-[var(--ds-space-2)] px-[var(--ds-space-2)] py-[var(--ds-space-1)]">
            {identity}
          </div>
          {menuChildren ? (
            <>
              <Divider className="my-[var(--ds-space-2)]" />
              {menuChildren}
            </>
          ) : null}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

export { UserMenu };
