import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ICON_BOX_CLASSES } from "@/src/components/ui/card-styles";
import { MailIcon, MapPinIcon, MessageIcon } from "@/src/components/ui/icons";
import { SITE } from "@/src/config/site";
import { formatStartDate } from "@/src/lib/settings/model";
import { getSettings } from "@/src/lib/settings/settings";
import { formatDisplayPhone, getWhatsAppUrl } from "@/src/lib/whatsapp";

// Anchors start with "/" so they also work from the legal pages, which share this footer.
const EXPLORE_LINKS = [
  { label: "Cómo funciona", href: "/#como" },
  { label: "Propuestas", href: "/#propuesta" },
  { label: "Soluciones", href: "/#soluciones" },
  { label: "Cómo trabajamos", href: "/#proceso" },
  { label: "Precios", href: "/#precios" },
  { label: "Preguntas frecuentes", href: "/#faq" },
] as const;

const LEGAL_LINKS = [
  { label: "Configurar mi solución", href: "/configurar" },
  { label: "Aviso de privacidad", href: "/privacidad" },
  { label: "Términos y condiciones", href: "/terminos" },
] as const;

const LINK_CLASSES =
  "inline-flex min-h-11 items-center text-sm text-text-secondary no-underline transition-colors duration-200 hover:text-white";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col max-[639px]:items-center max-[639px]:text-center">
      <h2 className="m-0 mb-2 text-xs font-medium tracking-[0.12em] text-label uppercase">
        {title}
      </h2>
      {children}
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className={`${ICON_BOX_CLASSES} size-9`}>{icon}</span>
      <span className="flex min-w-0 flex-col max-[639px]:text-left">
        <span className="text-xs text-label">{label}</span>
        <span className="truncate text-sm text-foreground">{value}</span>
      </span>
    </>
  );
  return href ? (
    <a
      href={href}
      className="group flex min-h-11 items-center gap-3 no-underline transition-opacity duration-200 hover:opacity-80 max-[639px]:justify-center"
    >
      {content}
    </a>
  ) : (
    <div className="flex min-h-11 items-center gap-3 max-[639px]:justify-center">{content}</div>
  );
}

export async function SiteFooter() {
  const settings = await getSettings();

  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto max-w-[1680px] px-4 pt-14 pb-8 sm:px-8 lg:px-12">
        <div className="grid gap-10 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div className="flex flex-col items-start gap-5 max-[639px]:items-center max-[639px]:text-center">
            {/* Same height as the logo in the header. */}
            <Link
              href="/"
              aria-label={`${SITE.name}, inicio`}
              className="flex min-h-11 items-center"
            >
              <Image
                src="/brand/solvyn-logo.png"
                alt={SITE.name}
                width={1100}
                height={262}
                sizes="126px"
                className="block h-[30px] w-auto"
              />
            </Link>
            <p className="m-0 max-w-[320px] text-sm leading-[1.6] text-text-secondary">
              Software a medida para negocios en México. Configuras tu solución,
              recibes una propuesta clara y trabajas directo con quien la
              construye.
            </p>
            {settings.nextStartDate && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-text-secondary">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-signal shadow-[0_0_8px_var(--signal-glow)]"
                />
                Próximo inicio: {formatStartDate(settings.nextStartDate)}
              </span>
            )}
          </div>

          <FooterColumn title="Explorar">
            {EXPLORE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={LINK_CLASSES}>
                {link.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Proyecto y legal">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={LINK_CLASSES}>
                {link.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Contacto">
            <ContactItem
              icon={<MailIcon size={18} />}
              label="Correo"
              value={settings.email}
              href={`mailto:${settings.email}`}
            />
            <ContactItem
              icon={<MessageIcon size={18} />}
              label="WhatsApp"
              value={formatDisplayPhone(settings.whatsapp)}
              href={getWhatsAppUrl(settings.whatsapp, SITE.whatsappMessage)}
            />
            <ContactItem
              icon={<MapPinIcon size={18} />}
              label="Ubicación"
              value="México"
            />
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-6 text-xs text-muted max-[639px]:justify-center max-[639px]:text-center">
          <span>© 2026 {SITE.name}. Todos los derechos reservados.</span>
          <span>Hecho en México</span>
        </div>
      </div>
    </footer>
  );
}
