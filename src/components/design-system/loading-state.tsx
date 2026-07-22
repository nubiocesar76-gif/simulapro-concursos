import * as React from "react";

import { cn } from "@/lib/utils";
import { Container, type ContainerProps } from "./container";
import { Card } from "./card";
import { Skeleton } from "./skeleton";

/**
 * LoadingState do novo Design System (DS-004) — composto exclusivamente
 * por `Skeleton`, `Card` e `Container` (DS-002A/DS-002C/DS-003A), sem
 * nenhum outro primitivo novo.
 */

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  containerSize?: ContainerProps["size"];
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, rows = 3, containerSize = "lg", ...props }, ref) => (
    <Container ref={ref} size={containerSize} className={className} {...props}>
      <Card padding="lg">
        <div className="flex flex-col gap-[var(--ds-space-4)]">
          <Skeleton width="40%" height="var(--ds-space-6)" />
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton key={index} width="100%" height="var(--ds-space-4)" />
          ))}
        </div>
      </Card>
    </Container>
  ),
);
LoadingState.displayName = "LoadingState";

export { LoadingState };
