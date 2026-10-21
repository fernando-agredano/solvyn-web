import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const STEPS = [
  {
    title: "Elige qué quieres lograr",
    description:
      "Vender en línea, automatizar tareas, organizar tu operación o lanzar una app. Si no está en la lista, descríbelo con tus palabras.",
    highlighted: false,
  },
  {
    title: "Responde unas preguntas",
    description:
      "Tu industria, quién usará el sistema y qué necesita conectar. Mientras respondes, tu propuesta se arma en pantalla.",
    highlighted: false,
  },
  {
    title: "Recibe tu propuesta",
    description:
      "Arquitectura, módulos, fases, inversión estimada y una vista previa visual. Si te convence, agenda una reunión desde ahí mismo.",
    highlighted: true,
  },
];

export function HowItWorks() {
  return (
    <section id="como" className="mx-auto max-w-[1680px] px-4 sm:px-8 lg:px-12 py-20 lg:py-24">
      <Reveal>
        <SectionHeading
          className="mb-12"
          title="De la idea a una propuesta clara en tres pasos"
          description="No necesitas saber de tecnología. Cuéntame qué quieres lograr y el configurador traduce tu idea en un plan concreto."
        />
      </Reveal>

      <div className="relative">
        <svg
          className="absolute top-[27px] left-[4%] h-2.5 w-[92%] max-[860px]:hidden"
          viewBox="0 0 1000 10"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 5 L1000 5"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="step-pulse"
            d="M0 5 L1000 5"
            pathLength={100}
            stroke="#FFFFFF"
            strokeWidth={2}
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ filter: "drop-shadow(0 0 4px #ffffff)" }}
          />
        </svg>

        <ol className="relative grid grid-cols-3 gap-10 max-[860px]:grid-cols-1">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Reveal>
                <div className="flex flex-col gap-[18px]">
                  <div
                    className={`wide flex size-14 items-center justify-center rounded-xl border text-xl font-semibold ${
                      step.highlighted
                        ? "border-white bg-white text-black shadow-[0_0_28px_rgba(255,255,255,0.25)]"
                        : "border-white/30 bg-black"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="semi m-0 text-[22px] font-semibold">{step.title}</h3>
                  <p className="m-0 text-base leading-[1.6] text-text-secondary">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
