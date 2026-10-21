import {
  ICON_BOX_CLASSES,
  LANDING_CARD_CLASSES,
} from "@/src/components/ui/card-styles";
import {
  CodeIcon,
  ReceiptIcon,
  UserCheckIcon,
} from "@/src/components/ui/icons";
import { Reveal } from "@/src/components/ui/Reveal";

const REASONS = [
  {
    title: "Hablas con quien construye",
    description:
      "Sin intermediarios. Las decisiones se toman contigo y se ejecutan sin teléfono descompuesto.",
    icon: <UserCheckIcon />,
  },
  {
    title: "El código es tuyo",
    description:
      "Al terminar recibes todo: código, accesos y documentación. Sin ataduras.",
    icon: <CodeIcon />,
  },
  {
    title: "Costos claros desde el inicio",
    description:
      "Ves la inversión por módulo antes de la primera reunión y decides qué incluir.",
    icon: <ReceiptIcon />,
  },
];

export function WhyUs() {
  return (
    <section className="mx-auto max-w-[1680px] px-4 pt-6 pb-20 sm:px-8 lg:px-12 lg:pb-24">
      <div className="mx-auto grid max-w-[1120px] gap-4 min-[861px]:grid-cols-3">
        {REASONS.map((reason) => (
          <Reveal key={reason.title} className="h-full">
            <div
              className={`flex h-full flex-col gap-4 p-6 ${LANDING_CARD_CLASSES}`}
            >
              <span className={`${ICON_BOX_CLASSES} size-11`}>
                {reason.icon}
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="m-0 text-lg font-semibold">{reason.title}</h2>
                <p className="m-0 text-[15px] leading-[1.6] text-text-secondary">
                  {reason.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
