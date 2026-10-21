import { Button } from "@/src/components/ui/Button";
import { CircuitBackground } from "./CircuitBackground";

// Fills the first screen. The circuit chip sits at about 25.8% of the (at least 1100px wide) circuit, so the text
// starts just below it; with the smaller type both buttons stay in view on common laptop screens.
export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden pb-12">
      <CircuitBackground />
      {/* The circuit is taller than the hero: fade it out at the hero's own bottom edge. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-44 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),#000000)]" />
      <div
        id="inicio"
        className="relative z-2 px-4 pt-[calc(max(100vw,_1100px)_*_0.2583_+_2.25rem)] sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5 text-center">
          <h1 className="m-0 text-balance text-[clamp(2rem,3.7vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-heading">
            Describe tu idea. Mira cómo se construye.
          </h1>
          <p className="m-0 max-w-[600px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-[1.6] text-text-secondary">
            Configura tu solución en unos minutos y recibe al momento una
            propuesta con arquitectura, módulos, tiempos y una vista previa de
            cómo se verá. Sin compromiso.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Button href="/configurar" withArrow>
              Configurar mi solución
            </Button>
            <Button href="#como" variant="secondary">
              Ver cómo funciona
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
