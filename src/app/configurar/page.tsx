import type { Metadata } from "next";
import { Button } from "@/src/components/ui/Button";

export const metadata: Metadata = {
  title: "Próximamente",
  // Placeholder until the configurator is built.
  robots: { index: false },
};

export default function ConfigurarPage() {
  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center outline-none"
    >
      <h1 className="wide m-0 text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.025em]">
        Próximamente
      </h1>
      <p className="m-0 max-w-[520px] text-lg leading-[1.6] text-text-secondary">
        El configurador está en construcción. Mientras tanto, puedes volver al inicio.
      </p>
      <Button href="/" variant="secondary">
        Volver al inicio
      </Button>
    </main>
  );
}
