import type { Metadata } from "next";
import { ConfirmationScreen } from "@/src/components/scheduling/ConfirmationScreen";

export const metadata: Metadata = {
  title: "Reunión confirmada",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return <ConfirmationScreen />;
}
