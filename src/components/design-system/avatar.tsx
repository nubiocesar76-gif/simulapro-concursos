import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
import { Skeleton } from "./skeleton";

/**
 * Avatar do novo Design System (DS-002C). Convive com
 * `@/components/ui/avatar` (Shadcn) sem substituí-lo. Usa o mesmo primitivo
 * Radix (`@radix-ui/react-avatar`) — já dependência do projeto — mas com
 * tamanhos, cores e o estado `loading` próprios, 100% via tokens da DS-001.
 */

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const avatarVariants = cva(
  cn(
    "relative flex shrink-0 items-center justify-center overflow-hidden",
    "rounded-[var(--ds-radius-full)] bg-[color:var(--ds-color-secondary)]",
  ),
  {
    variants: {
      size: {
        xs: "h-[var(--ds-space-6)] w-[var(--ds-space-6)]",
        sm: "h-[var(--ds-space-8)] w-[var(--ds-space-8)]",
        md: "h-[calc(var(--ds-space-8)_+_var(--ds-space-2))] w-[calc(var(--ds-space-8)_+_var(--ds-space-2))]",
        lg: "h-[var(--ds-space-12)] w-[var(--ds-space-12)]",
        xl: "h-[var(--ds-space-16)] w-[var(--ds-space-16)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const sizeValue: Record<AvatarSize, string> = {
  xs: "var(--ds-space-6)",
  sm: "var(--ds-space-8)",
  md: "calc(var(--ds-space-8) + var(--ds-space-2))",
  lg: "var(--ds-space-12)",
  xl: "var(--ds-space-16)",
};

const initialsFontSize: Record<AvatarSize, string> = {
  xs: dsFontSize.xs,
  sm: dsFontSize.xs,
  md: dsFontSize.sm,
  lg: dsFontSize.base,
  xl: dsFontSize.lg,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export interface AvatarProps
  extends
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  name?: string;
  loading?: boolean;
}

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, size = "md", src, alt, name, loading = false, children, ...props }, ref) => {
    const resolvedSize = size ?? "md";

    if (loading) {
      return (
        <Skeleton
          radius="full"
          width={sizeValue[resolvedSize]}
          height={sizeValue[resolvedSize]}
          className={className}
        />
      );
    }

    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src ? (
          <AvatarPrimitive.Image
            src={src}
            alt={alt ?? name ?? ""}
            className="aspect-square h-full w-full object-cover"
          />
        ) : null}
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center text-[color:var(--ds-color-surface)]"
          style={{ fontSize: initialsFontSize[resolvedSize], fontWeight: dsFontWeight.medium }}
          delayMs={src ? 400 : 0}
        >
          {children ?? (name ? getInitials(name) : null)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  },
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
