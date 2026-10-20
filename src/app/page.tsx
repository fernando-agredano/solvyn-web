import { Hero } from "@/src/components/hero/Hero";
import { SiteFooter } from "@/src/components/layout/SiteFooter";
import { Demos } from "@/src/components/sections/Demos";
import { Faq } from "@/src/components/sections/Faq";
import { FinalCta } from "@/src/components/sections/FinalCta";
import { HowItWorks } from "@/src/components/sections/HowItWorks";
import { Industries } from "@/src/components/sections/Industries";
import { LiveProposalSection } from "@/src/components/sections/LiveProposalSection";
import { Pricing } from "@/src/components/sections/Pricing";
import { Process } from "@/src/components/sections/Process";
import { Solutions } from "@/src/components/sections/Solutions";
import { WhyUs } from "@/src/components/sections/WhyUs";

export default function HomePage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <HowItWorks />
        <LiveProposalSection />
        <Solutions />
        <Industries />
        <Demos />
        <Process />
        <WhyUs />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
