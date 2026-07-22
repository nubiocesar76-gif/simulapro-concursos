import * as React from "react";
import { ChevronDown, Loader2 } from "lucide-react";

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
 * Select do novo Design System (DS-002B) — implementação nova sobre
 * `<select>` nativo, não relacionada ao `@/components/ui/select` (Radix),
 * que permanece intocado. Mesmo padrão de tokens de Input/Textarea/DS-002A.
 */

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  loading?: boolean;
  size?: FieldSize;
  containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      style,
      id,
      label,
      placeholder,
      helperText,
      errorText,
      successText,
      loading = false,
      size = "md",
      required,
      disabled,
      defaultValue,
      value,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const messageId = `${selectId}-message`;

    const status = resolveFieldStatus(errorText, successText);
    const message = errorText || successText || helperText;
    const messageTone = errorText ? "error" : successText ? "success" : "helper";
    const iconSize = iconSizeBySize[size];

    return (
      <div className={cn("flex flex-col gap-[var(--ds-space-1)]", containerClassName)}>
        {label ? (
          <label htmlFor={selectId} className={fieldLabelClassName} style={labelTypography}>
            {label}
            {required ? (
              <span className={fieldRequiredMarkClassName} aria-hidden="true">
                {" "}
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <div className={controlShellVariants({ size, status, disabled: Boolean(disabled) })}>
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full flex-1 appearance-none border-none bg-transparent outline-none",
              className,
            )}
            style={{ ...controlTypography[size], ...style }}
            required={required}
            disabled={disabled || loading}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={status === "error" || undefined}
            aria-describedby={message ? messageId : undefined}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled hidden={value !== undefined || defaultValue !== undefined}>
                {placeholder}
              </option>
            ) : null}
            {children}
          </select>

          {loading ? (
            <Loader2
              aria-hidden="true"
              className="shrink-0 animate-spin text-[color:var(--ds-color-text-secondary)]"
              style={{ width: iconSize, height: iconSize }}
            />
          ) : (
            <ChevronDown
              aria-hidden="true"
              className="shrink-0 text-[color:var(--ds-color-text-secondary)]"
              style={{ width: iconSize, height: iconSize }}
            />
          )}
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
Select.displayName = "Select";

export { Select };
