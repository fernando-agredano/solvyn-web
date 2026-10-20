"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PublicSettings } from "@/src/lib/settings/model";

const SettingsContext = createContext<PublicSettings | null>(null);

// The root layout reads the settings on the server and passes them down once, so browser components never fetch.
export function SettingsProvider({
  settings,
  children,
}: {
  settings: PublicSettings;
  children: ReactNode;
}) {
  return <SettingsContext value={settings}>{children}</SettingsContext>;
}

export function useSettings(): PublicSettings {
  const settings = useContext(SettingsContext);
  if (!settings)
    throw new Error("useSettings must be used inside SettingsProvider");
  return settings;
}
