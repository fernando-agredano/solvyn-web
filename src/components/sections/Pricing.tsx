import { PLANS } from "@/src/config/plans";
import { SITE } from "@/src/config/site";
import { Button } from "@/src/components/ui/Button";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

export function Pricing() {
  return (
    <section id="precios" className="border-t border-border-subtle">
      <div className="mx-auto max-w-[1240px] px-6 py-[120px]">
        <Reveal>
          <SectionHeading
            className="mb-14 max-w-[640px]"
            title="Inversión orientativa"
            description="Rangos de referencia. El configurador te da un estimado para tu caso en minutos."
          />
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-3 items-stretch gap-5 max-[1000px]:grid-cols-1">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col gap-6 rounded-2xl px-7 py-8 ${
                  plan.highlighted
                    ? "border border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))] shadow-[0_0_60px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.15)]"
                    : "border border-white/[0.12]"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute top-[-13px] left-7 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                    El más solicitado
                  </span>
                )}

                <div className="flex flex-col gap-2">
                  <h3 className="semi m-0 text-xl font-semibold">{plan.name}</h3>
                  <p className="m-0 text-[15px] leading-[1.55] text-text-secondary">{plan.description}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-label">Desde</span>
                  <span className="wide text-[30px] font-semibold tracking-[-0.02em]">{SITE.price}</span>
                  <span className="text-sm text-label">{plan.duration}</span>
                </div>

                <ul className="m-0 flex flex-1 list-none flex-col gap-2.5 p-0 text-[15px] text-[#D4D4D4]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="mt-0.5 flex-none"
                      >
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  href="/configurar"
                  variant={plan.highlighted ? "primary" : "secondary"}
                  size="sm"
                  className="w-full"
                >
                  Calcular mi caso
                </Button>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
