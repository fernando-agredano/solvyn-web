import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { LiveProposalDemo } from "./LiveProposalDemo";

export function LiveProposalSection() {
  return (
    <section
      id="propuesta"
      className="border-y border-border-subtle bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.05),rgba(255,255,255,0)_70%)]"
    >
      <div className="mx-auto max-w-[1240px] px-6 py-[120px]">
        <Reveal>
          <SectionHeading
            className="mb-14 max-w-[680px]"
            title="Así se ve una propuesta"
            description="Ejemplo: sistema de citas para una clínica. Activa o desactiva módulos y observa cómo cambian la inversión y los tiempos."
          />
        </Reveal>
        <Reveal>
          <LiveProposalDemo />
        </Reveal>
      </div>
    </section>
  );
}
