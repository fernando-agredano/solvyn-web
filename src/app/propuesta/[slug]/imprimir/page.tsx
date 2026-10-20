import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PrintableProposal } from "@/src/components/proposal/print/PrintableProposal";
import { buildProposalFacts } from "@/src/lib/proposal";
import { getProposalBySlug } from "@/src/lib/proposals/repository";
import { resolveProposalCopy } from "@/src/lib/templates";

export const metadata: Metadata = {
  title: "Propuesta para imprimir",
  robots: { index: false, follow: false },
};

async function PrintableSavedProposal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) notFound();

  // The saved proposal has no business name, same as the shared page.
  const facts = buildProposalFacts({ ...proposal.answers, business: "" }, proposal.hourlyRateMxn);
  if (!facts) notFound();

  return (
    <PrintableProposal
      facts={facts}
      copy={resolveProposalCopy(proposal, facts)}
      risks={proposal.risks}
      proposalPath={`/propuesta/${slug}`}
      date={new Date()}
    />
  );
}

export default function PrintableProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <PrintableSavedProposal params={params} />
    </Suspense>
  );
}
