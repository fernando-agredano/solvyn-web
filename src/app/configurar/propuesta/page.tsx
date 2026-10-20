import type { Metadata } from "next";
import { Button } from "@/src/components/ui/Button";

export const metadata: Metadata = {
  title: "Tu propuesta",
  // Placeholder until the final proposal screen is built.
  robots: { index: false },
};

export default function ProposalPage() {
  return (
    <main id="contenido" tabIndex={-1} className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center outline-none">
      <h1 className="wide m-0 text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.025em]">Estamos preparando tu propuesta</h1>
      <p className="m-0 max-w-[520px] text-lg leading-[1.6] text-text-secondary">
        Esta pantalla es provisional. Tus respuestas están guardadas, puedes volver a revisarlas.
      </p>
      <Button href="/configurar" variant="secondary">
        Volver al configurador
      </Button>
    </main>
  );
}
