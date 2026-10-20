import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ConfiguratorShell } from "@/src/components/configurator/ConfiguratorShell";
import { SavedProposalView } from "@/src/components/proposal/SavedProposalView";
import { getProposalBySlug } from "@/src/lib/proposals/repository";

export const metadata: Metadata = {
  title: "Tu propuesta",
  // Shared proposals are reachable only by their link: never indexed, never followed.
  robots: { index: false, follow: false },
};

async function SharedProposal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) notFound();
  const { answers, copy, provider, hourlyRateMxn } = proposal;
  return <SavedProposalView proposal={{ answers, copy, provider, hourlyRateMxn }} />;
}

export default function SharedProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <ConfiguratorShell>
      <Suspense>
        <SharedProposal params={params} />
      </Suspense>
    </ConfiguratorShell>
  );
}
