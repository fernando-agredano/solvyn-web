import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const CONTROL_CLASSES =
  "w-full rounded-xl border bg-white/3 text-base text-foreground placeholder:text-[#6B6B6B]";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

type TextFieldProps = FieldProps & InputHTMLAttributes<HTMLInputElement>;
type TextAreaFieldProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

function FieldShell({ id, label, hint, error, children }: FieldProps & { children: ReactNode }) {
  const message = error ?? hint;
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className="text-[15px] text-[#D4D4D4]">
        {label}
      </label>
      {children}
      {message && (
        <span id={`${id}-message`} className={`text-[13px] ${error ? "text-error" : "text-label"}`}>
          {message}
        </span>
      )}
    </div>
  );
}

const describedBy = ({ id, hint, error }: FieldProps) => (error || hint ? `${id}-message` : undefined);

export function TextField({ id, label, hint, error, className = "", ...inputProps }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy({ id, label, hint, error })}
        className={`${CONTROL_CLASSES} min-h-[52px] px-4 ${error ? "border-error" : "border-white/18"} ${className}`}
        {...inputProps}
      />
    </FieldShell>
  );
}

export function TextAreaField({ id, label, hint, error, className = "", ...textareaProps }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy({ id, label, hint, error })}
        className={`${CONTROL_CLASSES} resize-y p-4 leading-[1.55] ${error ? "border-error" : "border-white/18"} ${className}`}
        {...textareaProps}
      />
    </FieldShell>
  );
}
