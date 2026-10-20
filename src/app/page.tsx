import { Hero } from "@/src/components/hero/Hero";
import { HowItWorks } from "@/src/components/sections/HowItWorks";
import { Industries } from "@/src/components/sections/Industries";
import { LiveProposalSection } from "@/src/components/sections/LiveProposalSection";
import { Process } from "@/src/components/sections/Process";
import { Demos } from "@/src/components/sections/Demos";
import { Solutions } from "@/src/components/sections/Solutions";
import { WhyUs } from "@/src/components/sections/WhyUs";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <HowItWorks />
      <LiveProposalSection />
      <Solutions />
      <Industries />
      <Demos />
      <Process />
      <WhyUs />
    </main>
  );
}
