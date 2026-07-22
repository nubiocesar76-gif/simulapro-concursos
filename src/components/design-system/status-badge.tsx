import * as React from "react";

import { Badge, type BadgeProps } from "./badge";

/**
 * StatusBadge do novo Design System (DS-004) — não recria o Badge, apenas
 * traduz um vocabulário semântico de estado (`success/warning/error/info/
 * neutral`) para a variante já existente do `Badge` (DS-002A).
 */

export type StatusBadgeStatus = "success" | "warning" | "error" | "info" | "neutral";

const statusToVariant: Record<StatusBadgeStatus, NonNullable<BadgeProps["variant"]>> = {
  success: "success",
  warning: "warning",
  error: "error",
  info: "primary",
  neutral: "secondary",
};

export interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: StatusBadgeStatus;
}

function StatusBadge({ status, ...props }: StatusBadgeProps) {
  return <Badge variant={statusToVariant[status]} {...props} />;
}

export { StatusBadge };
