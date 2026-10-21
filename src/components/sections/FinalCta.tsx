import Image from "next/image";
import { Button } from "@/src/components/ui/Button";
import { WhatsAppButton } from "@/src/components/ui/WhatsAppButton";
import { Reveal } from "@/src/components/ui/Reveal";
import { SITE } from "@/src/config/site";
import { getSettings } from "@/src/lib/settings/settings";
import { getWhatsAppUrl } from "@/src/lib/whatsapp";

export async function FinalCta() {
  const settings = await getSettings();
  return (
    <section id="contacto" className="relative overflow-hidden border-t border-border-subtle">
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
          <h2 className="m-0 text-balance text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.02em]">
            ¿Tienes una idea? Veamos cómo se vería.
          </h2>
          <p className="m-0 max-w-[520px] text-lg leading-[1.6] text-text-secondary">
            Tu propuesta preliminar está a unos minutos. Si prefieres platicarlo primero, escríbeme directo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/configurar" withArrow>Configurar mi solución</Button>
            <WhatsAppButton href={getWhatsAppUrl(settings.whatsapp, SITE.whatsappMessage)} variant="secondary">
              Escribir por WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
