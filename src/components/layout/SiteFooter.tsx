import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/src/config/site";
import { getSettings } from "@/src/lib/settings/settings";

export async function SiteFooter() {
  const settings = await getSettings();
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-6 py-10 max-[860px]:flex-col max-[860px]:items-start">
        <Image
          src="/brand/solvyn-logo.png"
          alt={SITE.name}
          width={1100}
          height={262}
          sizes="101px"
          className="h-6 w-auto opacity-[0.85]"
        />
        <div className="flex flex-wrap gap-7 text-sm text-label">
          <span>{settings.email}</span>
          <span>{settings.whatsapp}</span>
          <Link href="/privacidad" className="inline-flex min-h-11 items-center">
            Aviso de privacidad
          </Link>
          <Link href="/terminos" className="inline-flex min-h-11 items-center">
            Términos
          </Link>
          <span>© 2026 {SITE.name}</span>
        </div>
      </div>
    </footer>
  );
}
