import Image from "next/image";
import { Button } from "@/src/components/ui/Button";
import { Reveal } from "@/src/components/ui/Reveal";
import { SITE } from "@/src/config/site";
import { getSettings } from "@/src/lib/settings/settings";
import { getWhatsAppUrl } from "@/src/lib/whatsapp";

export async function FinalCta() {
  const settings = await getSettings();
  return (
    <section id="contacto" className="relative overflow-hidden border-t border-border-subtle">
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 h-[420px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(255,255,255,0.09),rgba(255,255,255,0)_70%)]"
      />
      <Reveal>
        <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-7 px-6 py-[140px] text-center">
          <Image
            src="/brand/solvyn-iso.png"
            alt=""
            width={380}
            height={392}
            sizes="44px"
            className="h-auto w-[44px] opacity-90"
          />
          <h2 className="wide m-0 text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.025em]">
            ¿Tienes una idea? Veamos cómo se vería.
          </h2>
          <p className="m-0 max-w-[520px] text-lg leading-[1.6] text-text-secondary">
            Tu propuesta preliminar está a unos minutos. Si prefieres platicarlo primero, escríbeme directo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/configurar">Configurar mi solución</Button>
            <Button
              href={getWhatsAppUrl(settings.whatsapp, SITE.whatsappMessage)}
              variant="secondary"
            >
              Escribir por WhatsApp
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
