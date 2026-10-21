import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { FaqList } from "./FaqList";

export function Faq() {
  return (
    <section id="faq" className="border-t border-border-subtle">
      <div className="mx-auto max-w-[1680px] px-4 py-20 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <SectionHeading
            className="mb-10"
            title="Preguntas frecuentes"
            description="¿Algo más? Escríbeme y te respondo el mismo día."
          />
        </Reveal>
        <Reveal className="mx-auto max-w-[820px]">
          <FaqList />
        </Reveal>
      </div>
    </section>
  );
}
