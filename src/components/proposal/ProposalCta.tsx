import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { CalendarIcon, CheckIcon } from "@/src/components/ui/icons";
import { SCHEDULE_ROUTE } from "@/src/config/scheduling";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { notifyProposalAccepted } from "@/src/lib/meetings/client";

const CTA_PERKS = ["30 minutos", "Sin costo", "Sin compromiso"];

export function ProposalCta() {
  const router = useRouter();
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);

  const editAnswers = () => {
    setAnswer("step", "goal");
    router.push("/configurar");
  };

  // The lead is marked in the background: the calendar opens without waiting for it.
  const acceptAndSchedule = () => {
    void notifyProposalAccepted(useConfiguratorStore.getState());
    router.push(SCHEDULE_ROUTE);
  };

  return (
    <section className="flex flex-col items-center gap-4 rounded-2xl border border-white/25 bg-linear-to-b from-white/[0.06] to-transparent px-6 py-10 text-center sm:px-8">
      <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-white">
        <CalendarIcon size={20} />
      </span>
      <h2 className="m-0 text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-balance">¿Te late la propuesta?</h2>
      <p className="m-0 max-w-[520px] text-[15px] leading-[1.6] text-text-secondary text-pretty">
        Agenda una videollamada de 30 minutos para revisarla juntos y afinar los detalles.
      </p>
      <ul className="m-0 flex list-none flex-wrap justify-center gap-x-5 gap-y-1.5 p-0 text-[13px] text-text-secondary">
        {CTA_PERKS.map((perk) => (
          <li key={perk} className="inline-flex items-center gap-1.5">
            <span className="text-signal">
              <CheckIcon size={14} />
            </span>
            {perk}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={acceptAndSchedule} withArrow>
          Aceptar y agendar reunión
        </Button>
        <Button variant="secondary" onClick={editAnswers}>
          Editar respuestas
        </Button>
      </div>
    </section>
  );
}
