import type { Metadata } from "next";
import { SchedulingScreen } from "@/src/components/scheduling/SchedulingScreen";

export const metadata: Metadata = {
  title: "Agenda tu reunión",
  robots: { index: false },
};

export default function SchedulePage() {
  return <SchedulingScreen />;
}
