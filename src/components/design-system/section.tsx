import * as React from "react";

import { cn } from "@/lib/utils";
import { sectionTitleTypography, descriptionTypography } from "./layout-primitives";
import { Card, CardHeader, CardContent } from "./card";

/**
 * Section do novo Design System (DS-003A) — bloco interno de uma página.
 * Composto sobre `Card`/`CardHeader`/`CardContent` (DS-002A) em vez de
 * reimplementar superfície/borda/radius do zero.
 */

export type SectionSpacing = "sm" | "md" | "lg";

const contentPaddingWithHeader: Record<SectionSpacing, string> = {
  sm: "p-[var(--ds-space-4)] pt-0",
  md: "p-[var(--ds-space-6)] pt-0",
  lg: "p-[var(--ds-space-8)] pt-0",
};

const contentPaddingNoHeader: Record<SectionSpacing, string> = {
  sm: "p-[var(--ds-space-4)]",
  md: "p-[var(--ds-space-6)]",
  lg: "p-[var(--ds-space-8)]",
};

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  spacing?: SectionSpacing;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, title, description, actions, spacing = "md", children, ...props }, ref) => {
    const hasHeader = Boolean(title || description || actions);

    return (
      <Card ref={ref} padding="none" className={className} {...props}>
        {hasHeader ? (
          <CardHeader>
            <div className="flex items-start justify-between gap-[var(--ds-space-4)]">
              <div className="flex flex-col gap-[var(--ds-space-1)]">
                {title ? (
                  <div
                    className="text-[color:var(--ds-color-text-primary)]"
                    style={sectionTitleTypography}
                  >
                    {title}
                  </div>
                ) : null}
                {description ? (
                  <div
                    className="text-[color:var(--ds-color-text-secondary)]"
                    style={descriptionTypography}
                  >
                    {description}
                  </div>
                ) : null}
              </div>
              {actions ? (
                <div className="flex shrink-0 items-center gap-[var(--ds-space-2)]">{actions}</div>
              ) : null}
            </div>
          </CardHeader>
        ) : null}
        <CardContent
          className={cn(
            hasHeader ? contentPaddingWithHeader[spacing] : contentPaddingNoHeader[spacing],
          )}
        >
          {children}
        </CardContent>
      </Card>
    );
  },
);
Section.displayName = "Section";

export { Section };
