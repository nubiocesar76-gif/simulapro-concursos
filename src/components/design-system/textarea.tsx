import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  controlShellVariants,
  controlTypography,
  fieldLabelClassName,
  fieldMessageVariants,
  fieldRequiredMarkClassName,
  iconSizeBySize,
  labelTypography,
  messageTypography,
  resolveFieldStatus,
  type FieldSize,
} from "./field-primitives";

/**
 * Textarea do novo Design System (DS-002B). Mesmo padrão do Input — convive
 * com `@/components/ui/textarea` (Shadcn) sem substituí-lo. Tokens via
 * `@/styles/design-system/tokens.css`/`tokens.ts`, mesma estratégia da
 * DS-002A/Input.
 */

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> {
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  loading?: boolean;
  size?: FieldSize;
  resize?: "none" | "vertical" | "horizontal" | "both";
  containerClassName?: string;
}

const resizeClassName: Record<NonNullable<TextareaProps["resize"]>, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      style,
      id,
      label,
      helperText,
      errorText,
      successText,
      loading = false,
      size = "md",
      resize = "vertical",
      rows = 4,
      required,
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const messageId = `${textareaId}-message`;

    const status = resolveFieldStatus(errorText, successText);
    const message = errorText || successText || helperText;
    const messageTone = errorText ? "error" : successText ? "success" : "helper";
    const iconSize = iconSizeBySize[size];

    return (
      <div className={cn("flex flex-col gap-[var(--ds-space-1)]", containerClassName)}>
        {label ? (
          <label htmlFor={textareaId} className={fieldLabelClassName} style={labelTypography}>
            {label}
            {required ? (
              <span className={fieldRequiredMarkClassName} aria-hidden="true">
                {" "}
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <div
          className={cn(
            controlShellVariants({ size, status, disabled: Boolean(disabled) }),
            "items-start",
          )}
        >
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            className={cn(
              "w-full flex-1 border-none bg-transparent outline-none",
              "placeholder:text-[color:var(--ds-color-text-secondary)]",
              resizeClassName[resize],
              className,
            )}
            style={{ ...controlTypography[size], ...style }}
            required={required}
            disabled={disabled || loading}
            readOnly={readOnly}
            aria-invalid={status === "error" || undefined}
            aria-describedby={message ? messageId : undefined}
            {...props}
          />

          {loading ? (
            <Loader2
              aria-hidden="true"
              className="mt-[var(--ds-space-1)] shrink-0 animate-spin text-[color:var(--ds-color-text-secondary)]"
              style={{ width: iconSize, height: iconSize }}
            />
          ) : null}
        </div>

        {message ? (
          <p
            id={messageId}
            role={status === "error" ? "alert" : undefined}
            className={fieldMessageVariants({ tone: messageTone })}
            style={messageTypography}
          >
            {message}
          </p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
