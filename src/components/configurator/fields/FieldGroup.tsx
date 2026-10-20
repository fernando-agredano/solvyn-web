import type { ReactNode } from "react";

interface FieldGroupProps {
  legend: string;
  hint?: string;
  children: ReactNode;
}

export function FieldGroup({ legend, hint, children }: FieldGroupProps) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-3.5 border-0 p-0">
      <legend className={`semi p-0 text-lg font-semibold ${hint ? "mb-1.5" : "mb-3.5"}`}>{legend}</legend>
      {hint && <span className="text-sm text-label">{hint}</span>}
      {children}
    </fieldset>
  );
}
