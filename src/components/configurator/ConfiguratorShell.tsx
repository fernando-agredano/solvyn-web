import type { ReactNode } from "react";
import type { ConfiguratorStep } from "@/src/config/configurator-options";
import { ConfiguratorHeader } from "./ConfiguratorHeader";

interface ConfiguratorShellProps {
  // Only the questionnaire shows progress; the proposal screens don't.
  progress?: { step: ConfiguratorStep; percent: number };
  children: ReactNode;
}

export function ConfiguratorShell({
  progress,
  children,
}: ConfiguratorShellProps) {
  return (
    <div className="min-h-dvh bg-black">
      <ConfiguratorHeader progress={progress} />
      {/* The header is fixed, so its 4rem is reserved here instead of sitting in the flow. */}
      <div aria-hidden="true" className="h-16" />
      {children}
    </div>
  );
}
