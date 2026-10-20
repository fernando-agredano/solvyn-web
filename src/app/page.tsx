import { Hero } from "@/src/components/hero/Hero";
import { HowItWorks } from "@/src/components/sections/HowItWorks";
import { LiveProposalSection } from "@/src/components/sections/LiveProposalSection";
import { Solutions } from "@/src/components/sections/Solutions";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <HowItWorks />
      <LiveProposalSection />
      <Solutions />
    </main>
  );
}
