import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

const CONTROL_CLASSES =
  "w-full rounded-xl border bg-white/3 text-[15px] text-foreground placeholder:text-[#6B6B6B] transition-colors duration-200 hover:border-white/30 focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-none";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  // Drawn inside the field, on the left.
  icon?: ReactNode;
}

type TextFieldProps = FieldProps & InputHTMLAttributes<HTMLInputElement>;
type TextAreaFieldProps = FieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

function FieldShell({
  id,
  label,
  hint,
  error,
  children,
}: FieldProps & { children: ReactNode }) {
  const message = error ?? hint;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-medium text-[#D4D4D4]">
        {label}
      </label>
      {children}
      {message && (
        <span
          id={`${id}-message`}
          className={`text-xs ${error ? "text-error" : "text-label"}`}
        >
          {message}
        </span>
      )}
    </div>
  );
}

const describedBy = ({
  id,
  hint,
  error,
}: Pick<FieldProps, "id" | "hint" | "error">) =>
  error || hint ? `${id}-message` : undefined;

export function TextField({
  id,
  label,
  hint,
  error,
  icon,
  className = "",
  ...inputProps
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-label">
            {icon}
          </span>
        )}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy({ id, hint, error })}
          className={`${CONTROL_CLASSES} min-h-11 ${icon ? "pl-11" : "pl-4"} pr-4 ${error ? "border-error" : "border-white/18"} ${className}`}
          {...inputProps}
        />
      </div>
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  className = "",
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy({ id, hint, error })}
        className={`${CONTROL_CLASSES} resize-y p-3.5 leading-[1.55] ${error ? "border-error" : "border-white/18"} ${className}`}
        {...textareaProps}
      />
    </FieldShell>
  );
}
