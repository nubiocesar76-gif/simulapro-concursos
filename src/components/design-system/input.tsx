import * as React from "react";
import { Loader2, X } from "lucide-react";

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
 * Input do novo Design System (DS-002B). Convive com `@/components/ui/input`
 * (Shadcn) sem substituí-lo. Todo valor visual vem de
 * `@/styles/design-system/tokens.css` (via classes Tailwind com valor
 * arbitrário) ou de `@/styles/design-system/tokens.ts` (tipografia, via
 * style inline) — mesmo padrão já estabelecido na DS-002A.
 */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearButton?: boolean;
  onClear?: () => void;
  loading?: boolean;
  size?: FieldSize;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
      leftIcon,
      rightIcon,
      clearButton = false,
      onClear,
      loading = false,
      size = "md",
      required,
      disabled,
      readOnly,
      value,
      defaultValue,
      onChange,
      ...props
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;

    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const isControlled = value !== undefined;
    const [hasInnerValue, setHasInnerValue] = React.useState(
      () => String(defaultValue ?? "").length > 0,
    );
    const hasValue = isControlled ? String(value ?? "").length > 0 : hasInnerValue;

    const status = resolveFieldStatus(errorText, successText);
    const message = errorText || successText || helperText;
    const messageTone = errorText ? "error" : successText ? "success" : "helper";

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      if (!isControlled) setHasInnerValue(event.target.value.length > 0);
      onChange?.(event);
    }

    function handleClear() {
      const el = innerRef.current;
      if (el) {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        setter?.call(el, "");
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.focus();
      }
      if (!isControlled) setHasInnerValue(false);
      onClear?.();
    }

    const iconSize = iconSizeBySize[size];
    const showClear = clearButton && hasValue && !disabled && !readOnly && !loading;

    return (
      <div className={cn("flex flex-col gap-[var(--ds-space-1)]", containerClassName)}>
        {label ? (
          <label htmlFor={inputId} className={fieldLabelClassName} style={labelTypography}>
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
          className={controlShellVariants({ size, status, disabled: Boolean(disabled) })}
          data-loading={loading || undefined}
        >
          {leftIcon ? (
            <span
              className="flex shrink-0 items-center text-[color:var(--ds-color-text-secondary)]"
              style={{ width: iconSize, height: iconSize }}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          ) : null}

          <input
            ref={setRefs}
            id={inputId}
            className={cn(
              "w-full flex-1 border-none bg-transparent outline-none",
              "placeholder:text-[color:var(--ds-color-text-secondary)]",
              className,
            )}
            style={{ ...controlTypography[size], ...style }}
            required={required}
            disabled={disabled || loading}
            readOnly={readOnly}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            aria-invalid={status === "error" || undefined}
            aria-describedby={message ? messageId : undefined}
            {...props}
          />

          {loading ? (
            <Loader2
              aria-hidden="true"
              className="shrink-0 animate-spin text-[color:var(--ds-color-text-secondary)]"
              style={{ width: iconSize, height: iconSize }}
            />
          ) : showClear ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpar campo"
              className="flex shrink-0 items-center text-[color:var(--ds-color-text-secondary)] hover:text-[color:var(--ds-color-text-primary)]"
              style={{ width: iconSize, height: iconSize }}
            >
              <X aria-hidden="true" style={{ width: "100%", height: "100%" }} />
            </button>
          ) : rightIcon ? (
            <span
              className="flex shrink-0 items-center text-[color:var(--ds-color-text-secondary)]"
              style={{ width: iconSize, height: iconSize }}
              aria-hidden="true"
            >
              {rightIcon}
            </span>
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
Input.displayName = "Input";

export { Input };
