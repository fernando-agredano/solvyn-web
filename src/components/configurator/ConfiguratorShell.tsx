import type { ReactNode } from "react";
import type { ConfiguratorStep } from "@/src/config/configurator-options";
import { ConfiguratorHeader } from "./ConfiguratorHeader";

interface ConfiguratorShellProps {
  // Only the questionnaire shows progress; the proposal screens don't.
  progress?: { step: ConfiguratorStep; percent: number };
  children: ReactNode;
}

export function ConfiguratorShell({ progress, children }: ConfiguratorShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(255,255,255,0.06),rgba(255,255,255,0)_70%),#000000]">
      <ConfiguratorHeader progress={progress} />
      {children}
    </div>
  );
}
