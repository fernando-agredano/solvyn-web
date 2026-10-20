import type { Metadata } from "next";
import { ProposalExperience } from "@/src/components/proposal/ProposalExperience";

export const metadata: Metadata = {
  title: "Tu propuesta",
  // Proposals are personal: never indexed.
  robots: { index: false },
};

export default function ProposalPage() {
  return <ProposalExperience />;
}
