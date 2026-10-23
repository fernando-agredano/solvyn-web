import { PLANS } from "@/src/config/plans";
import { formatStartDate } from "@/src/lib/settings/model";
import { getSettings } from "@/src/lib/settings/settings";
import { Button } from "@/src/components/ui/Button";
import { CheckIcon, ClockIcon } from "@/src/components/ui/icons";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

// Green marks what is "ok" or "active": the checks, the dot of the featured plan and the availability. Nothing else.
function SignalDot() {
  return (
    <span
      aria-hidden="true"
      className="size-1.5 rounded-full bg-signal shadow-[0_0_8px_var(--signal-glow)]"
    />
  );
}

export async function Pricing() {
  const settings = await getSettings();
  const hasAvailability = Boolean(
    settings.nextStartDate || settings.availabilityMessage,
  );

  return (
    <section id="precios" className="border-t border-border-subtle">
      <div className="mx-auto max-w-[1680px] px-4 py-20 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <SectionHeading
            className="mb-12"
            title="Inversión orientativa"
            description="Rangos de referencia. El configurador te da un estimado para tu caso en minutos."
          />
        </Reveal>

        <div className="mx-auto grid max-w-[1120px] items-stretch gap-5 min-[1000px]:grid-cols-3">
          {PLANS.map((plan) => (
            <Reveal key={plan.name} className="h-full">
              <article
                className={`relative flex h-full flex-col gap-6 rounded-2xl p-7 ${
                  plan.highlighted
                    ? "border border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))] shadow-[0_0_60px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.15)]"
                    : "border border-white/[0.12] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]"
                }`}
              >
                {plan.highlighted && (
                  <>
                    <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/30 bg-black px-3 py-1 text-xs font-semibold whitespace-nowrap text-white">
                      <SignalDot />
                      El más solicitado
                    </span>
                  </>
                )}

                <div className="flex flex-col gap-2 min-[1000px]:min-h-[7.5rem]">
                  <h3 className="m-0 text-lg font-semibold">{plan.name}</h3>
                  <p className="m-0 text-[15px] leading-[1.55] text-text-secondary">
                    {plan.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-label">Desde</span>
                  <span className="text-[28px] leading-none font-semibold tracking-[-0.02em]">
                    {plan.price}
                  </span>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-xs text-text-secondary">
                    <ClockIcon size={14} />
                    {plan.duration}
                  </span>
                </div>

                <ul className="m-0 flex flex-1 list-none flex-col gap-3 border-t border-white/10 p-0 pt-5 text-[15px] text-[#D4D4D4]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-px flex size-5 flex-none items-center justify-center rounded-full bg-signal/15 text-signal">
                        <CheckIcon size={13} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  href="/configurar"
                  variant={plan.highlighted ? "primary" : "secondary"}
                  size="sm"
                  withArrow
                  className="w-full"
                >
                  Calcular mi caso
                </Button>
              </article>
            </Reveal>
          ))}
        </div>

        {hasAvailability && (
          <Reveal>
            <p className="mx-auto mt-10 mb-0 flex w-fit max-w-full items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-text-secondary">
              <SignalDot />
              <span>
                {settings.nextStartDate &&
                  `Próximo inicio disponible: ${formatStartDate(settings.nextStartDate)}`}
                {settings.nextStartDate &&
                  settings.availabilityMessage &&
                  " · "}
                {settings.availabilityMessage}
              </span>
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
