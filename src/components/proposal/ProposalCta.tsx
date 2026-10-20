import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { SCHEDULE_ROUTE } from "@/src/config/scheduling";
import { clearGeneratedFlag } from "@/src/hooks/useProposalGeneration";
import { useConfiguratorStore } from "@/src/lib/configurator/store";

export function ProposalCta() {
  const router = useRouter();
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);

  const editAnswers = () => {
    clearGeneratedFlag();
    setAnswer("step", "goal");
    router.push("/configurar");
  };

  return (
    <section className="relative flex flex-col items-center gap-5 overflow-hidden rounded-[20px] border border-white/30 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(255,255,255,0.1),rgba(255,255,255,0)_70%),#000000] px-8 py-12 text-center">
      <h2 className="wide m-0 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] font-semibold tracking-[-0.02em]">¿Te late la propuesta?</h2>
      <p className="m-0 max-w-[520px] text-base leading-[1.6] text-text-secondary">
        Agenda una videollamada de 30 minutos para revisarla juntos y afinar los detalles. Sin costo ni compromiso.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => router.push(SCHEDULE_ROUTE)}>Aceptar y agendar reunión</Button>
        <Button variant="secondary" onClick={editAnswers}>
          Editar respuestas
        </Button>
      </div>
    </section>
  );
}
