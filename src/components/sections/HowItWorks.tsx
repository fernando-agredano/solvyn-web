import {
  ICON_BOX_CLASSES,
  LANDING_CARD_CLASSES,
  LANDING_CARD_HIGHLIGHT_CLASSES,
} from "@/src/components/ui/card-styles";
import {
  FileCheckIcon,
  SlidersIcon,
  TargetIcon,
} from "@/src/components/ui/icons";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const STEPS = [
  {
    title: "Elige qué quieres lograr",
    description:
      "Vender en línea, automatizar tareas, organizar tu operación o lanzar una app. Si no está en la lista, descríbelo con tus palabras.",
    icon: <TargetIcon size={24} />,
    highlighted: false,
  },
  {
    title: "Responde unas preguntas",
    description:
      "Tu industria, quién usará el sistema y qué necesita conectar. Mientras respondes, tu propuesta se arma en pantalla.",
    icon: <SlidersIcon size={24} />,
    highlighted: false,
  },
  {
    title: "Recibe tu propuesta",
    description:
      "Arquitectura, módulos, fases, inversión estimada y un diagrama de tu sistema. Si te convence, agenda una reunión desde ahí mismo.",
    icon: <FileCheckIcon size={24} />,
    highlighted: true,
  },
];

// The connectors are pseudo-elements of each step except the last, so no line runs on after step 3: a short
// vertical one between stacked steps, a horizontal one between steps side by side.
const CONNECTOR_CLASSES =
  "relative after:absolute after:top-full after:left-1/2 after:h-12 after:w-px after:bg-white/15 last:after:hidden min-[861px]:after:top-[50px] min-[861px]:after:left-full min-[861px]:after:h-px min-[861px]:after:w-14 min-[861px]:after:bg-[linear-gradient(90deg,rgba(255,255,255,0.3),rgba(255,255,255,0.08))]";

export function HowItWorks() {
  return (
    <section
      id="como"
      className="mx-auto max-w-[1680px] px-4 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <Reveal>
        <SectionHeading
          className="mb-12"
          title="De la idea a una propuesta clara en tres pasos"
          description="No necesitas saber de tecnología. Cuéntame qué quieres lograr y el configurador traduce tu idea en un plan concreto."
        />
      </Reveal>

      <ol className="mx-auto grid max-w-[1120px] list-none gap-x-14 gap-y-12 p-0 min-[861px]:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className={CONNECTOR_CLASSES}>
            <Reveal className="h-full">
              <div
                className={`flex h-full flex-col items-center gap-4 p-6 text-center ${
                  step.highlighted
                    ? LANDING_CARD_HIGHLIGHT_CLASSES
                    : LANDING_CARD_CLASSES
                }`}
              >
                <div className="relative">
                  <span className={`${ICON_BOX_CLASSES} size-[52px]`}>
                    {step.icon}
                  </span>
                  <span
                    className={`absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                      step.highlighted
                        ? "bg-white text-black"
                        : "border border-white/30 bg-black text-white"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <h3 className="m-0 text-lg font-semibold">{step.title}</h3>
                <p className="m-0 text-[15px] leading-[1.6] text-text-secondary">
                  {step.description}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
