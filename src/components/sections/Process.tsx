import {
  ICON_BOX_CLASSES,
  LANDING_CARD_CLASSES,
  LANDING_CARD_HIGHLIGHT_CLASSES,
} from "@/src/components/ui/card-styles";
import { CheckIcon } from "@/src/components/ui/icons";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const STAGES = [
  {
    title: "Reunión inicial",
    description:
      "Revisamos tu propuesta, ajustamos el alcance y definimos prioridades.",
    delivers: "propuesta final y cronograma",
    highlighted: false,
  },
  {
    title: "Diseño y prototipo",
    description:
      "Ves las pantallas antes de programar y las ajustamos contigo.",
    delivers: "prototipo navegable",
    highlighted: false,
  },
  {
    title: "Desarrollo por entregas",
    description:
      "Cada una o dos semanas recibes una versión funcionando para probar.",
    delivers: "avances en un enlace de prueba",
    highlighted: false,
  },
  {
    title: "Pruebas y lanzamiento",
    description:
      "Revisamos todo con tu equipo, publicamos y te capacito para usarlo.",
    delivers: "sistema en producción y manual",
    highlighted: false,
  },
  {
    title: "Soporte continuo",
    description:
      "Corrección de errores incluida y opción de mejoras mensuales.",
    delivers: "código, accesos y documentación",
    highlighted: true,
  },
];

// Connectors are pseudo-elements of each stage except the last, so nothing runs on after stage 5. They are
// vertical when the stages stack in one column and horizontal when all five sit in a row; with two columns
// there is no clear order to follow, so none is drawn.
const CONNECTOR_CLASSES =
  "relative after:absolute after:top-full after:left-1/2 after:h-10 after:w-px after:bg-white/15 last:after:hidden min-[640px]:after:hidden min-[1100px]:after:block min-[1100px]:after:top-[34px] min-[1100px]:after:left-full min-[1100px]:after:h-px min-[1100px]:after:w-6 min-[1100px]:after:bg-white/20";

export function Process() {
  return (
    <section id="proceso" className="border-t border-border-subtle">
      <div className="mx-auto max-w-[1680px] px-4 py-20 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <SectionHeading
            className="mb-12"
            title="Cómo trabajamos juntos"
            description="Entregas cortas y visibles. En cada etapa sabes qué se está construyendo y puedes probarlo."
          />
        </Reveal>

        <ol className="mx-auto grid max-w-[1400px] list-none gap-x-6 gap-y-10 p-0 min-[640px]:grid-cols-2 min-[1100px]:grid-cols-5">
          {STAGES.map((stage, index) => (
            <li key={stage.title} className={CONNECTOR_CLASSES}>
              <Reveal className="h-full">
                <div
                  className={`flex h-full flex-col items-center gap-3 p-5 text-center ${
                    stage.highlighted
                      ? LANDING_CARD_HIGHLIGHT_CLASSES
                      : LANDING_CARD_CLASSES
                  }`}
                >
                  <span
                    className={`${ICON_BOX_CLASSES} size-[44px] text-base font-semibold ${
                      stage.highlighted
                        ? "border-white bg-white text-black"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </span>
                  <h3 className="m-0 text-base font-semibold">{stage.title}</h3>
                  <p className="m-0 text-[14px] leading-[1.6] text-text-secondary">
                    {stage.description}
                  </p>
                  <span className="mt-auto inline-flex items-start gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-left text-xs leading-snug text-label">
                    <span className="mt-px"><CheckIcon size={13} /></span>
                    {stage.delivers}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
