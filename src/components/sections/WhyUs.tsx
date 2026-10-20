import { Reveal } from "@/src/components/ui/Reveal";

const REASONS = [
  {
    title: "Hablas con quien construye",
    description: "Sin intermediarios. Las decisiones se toman contigo y se ejecutan sin teléfono descompuesto.",
  },
  {
    title: "El código es tuyo",
    description: "Al terminar recibes todo: código, accesos y documentación. Sin ataduras.",
  },
  {
    title: "Costos claros desde el inicio",
    description: "Ves la inversión por módulo antes de la primera reunión y decides qué incluir.",
  },
];

export function WhyUs() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pt-10 pb-[120px]">
      <Reveal>
        <div className="grid grid-cols-3 gap-10 max-[860px]:grid-cols-1">
          {REASONS.map((reason) => (
            <div key={reason.title} className="flex flex-col gap-3 border-t border-white/30 pt-6">
              <h3 className="semi m-0 text-xl font-semibold">{reason.title}</h3>
              <p className="m-0 text-base leading-[1.6] text-text-secondary">{reason.description}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
