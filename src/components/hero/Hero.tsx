import { Navbar } from "@/src/components/layout/Navbar";
import { Button } from "@/src/components/ui/Button";
import { CircuitBackground } from "./CircuitBackground";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-[120px]">
      <CircuitBackground />
      <Navbar />
      <div id="inicio" className="relative z-2 px-6 pt-[max(calc(29.17%_-_74px),247px)]">
        <div className="mx-auto flex max-w-[820px] flex-col items-center gap-7 text-center">
          <h1 className="wide m-0 text-[clamp(2.3rem,5.2vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-heading">
            Describe tu idea. Mira cómo se construye.
          </h1>
          <p className="m-0 max-w-[600px] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.6] text-text-secondary">
            Configura tu solución en unos minutos y recibe al momento una propuesta con arquitectura, módulos,
            tiempos y una vista previa de cómo se verá. Sin compromiso.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button href="/configurar">Configurar mi solución</Button>
            <Button href="#como" variant="secondary">
              Ver cómo funciona
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
