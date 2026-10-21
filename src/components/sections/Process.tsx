import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const STAGES = [
  {
    title: "Reunión inicial",
    description: "Revisamos tu propuesta, ajustamos el alcance y definimos prioridades.",
    delivers: "propuesta final y cronograma",
    highlighted: false,
  },
  {
    title: "Diseño y prototipo",
    description: "Ves las pantallas antes de programar y las ajustamos contigo.",
    delivers: "prototipo navegable",
    highlighted: false,
  },
  {
    title: "Desarrollo por entregas",
    description: "Cada una o dos semanas recibes una versión funcionando para probar.",
    delivers: "avances en un enlace de prueba",
    highlighted: false,
  },
  {
    title: "Pruebas y lanzamiento",
    description: "Revisamos todo con tu equipo, publicamos y te capacito para usarlo.",
    delivers: "sistema en producción y manual",
    highlighted: false,
  },
  {
    title: "Soporte continuo",
    description: "Corrección de errores incluida y opción de mejoras mensuales.",
    delivers: "código, accesos y documentación",
    highlighted: true,
  },
];

export function Process() {
  return (
    <section id="proceso" className="border-t border-border-subtle">
      <div className="mx-auto grid max-w-[1240px] gap-16 px-6 py-20 lg:py-24 max-[1000px]:gap-10 min-[1001px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] max-[1000px]:grid-cols-1">
        <Reveal>
          <SectionHeading
            title="Cómo trabajamos juntos"
            description="Entregas cortas y visibles. En cada etapa sabes qué se está construyendo y puedes probarlo."
          />
        </Reveal>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute top-5 bottom-5 left-[19px] w-px bg-[linear-gradient(to_bottom,rgba(255,255,255,0.35),rgba(255,255,255,0.08))]"
          />
          <div
            aria-hidden="true"
            className="absolute top-5 left-[17px] h-10 w-[5px] rounded-[3px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0),#FFFFFF)] shadow-[0_0_10px_#FFFFFF] animate-[procrun_4.5s_cubic-bezier(0.5,0,0.5,1)_infinite] motion-reduce:hidden"
          />

          <ol className="relative flex flex-col">
            {STAGES.map((stage, index) => (
              <li key={stage.title} className="relative">
                <Reveal>
                  <div className={`flex gap-7 ${index < STAGES.length - 1 ? "pb-10" : ""}`}>
                    <div
                      className={`wide flex size-10 flex-none items-center justify-center rounded-[10px] text-[15px] font-semibold ${
                        stage.highlighted
                          ? "bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.25)]"
                          : "border border-white/35 bg-black"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <h3 className="semi m-0 text-xl font-semibold">{stage.title}</h3>
                      <p className="m-0 text-base leading-[1.6] text-text-secondary">{stage.description}</p>
                      <span className="text-sm text-label">Recibes: {stage.delivers}</span>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
