import type { Metadata } from "next";
import { ConfiguratorShell } from "@/src/components/configurator/ConfiguratorShell";
import { Button } from "@/src/components/ui/Button";

export const metadata: Metadata = {
  title: "Agenda tu reunión",
  // Placeholder until scheduling is built.
  robots: { index: false },
};

export default function SchedulePage() {
  return (
    <ConfiguratorShell>
      <main id="contenido" tabIndex={-1} className="mx-auto flex max-w-[640px] flex-col items-center gap-6 px-6 py-24 text-center outline-none">
        <h1 className="wide m-0 text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.025em]">Agenda tu reunión</h1>
        <p className="m-0 text-lg leading-[1.6] text-text-secondary">Esta pantalla es provisional. Tu propuesta sigue guardada.</p>
        <Button href="/configurar/propuesta" variant="secondary">
          Volver a la propuesta
        </Button>
      </main>
    </ConfiguratorShell>
  );
}
