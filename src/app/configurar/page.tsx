import type { Metadata } from "next";
import { Configurator } from "@/src/components/configurator/Configurator";

export const metadata: Metadata = {
  title: "Configura tu solución",
  // Kept out of search results until the full flow (proposal, scheduling) is built.
  robots: { index: false },
};

export default function ConfigurarPage() {
  return <Configurator />;
}
