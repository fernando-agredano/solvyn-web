import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { FaqList } from "./FaqList";

export function Faq() {
  return (
    <section id="faq" className="border-t border-border-subtle">
      <div className="mx-auto grid max-w-[1240px] gap-16 px-6 py-[120px] min-[1001px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] max-[1000px]:grid-cols-1 max-[1000px]:gap-10">
        <Reveal>
          <SectionHeading
            title="Preguntas frecuentes"
            description="¿Algo más? Escríbeme y te respondo el mismo día."
          />
        </Reveal>
        <Reveal>
          <FaqList />
        </Reveal>
      </div>
    </section>
  );
}
