import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import { SITE } from "@/src/config/site";

const NAV_LINKS = [
  { label: "Cómo funciona", href: "#como" },
  { label: "Propuestas", href: "#propuesta" },
  { label: "Soluciones", href: "#soluciones" },
  { label: "Precios", href: "#precios" },
  { label: "Contacto", href: "#contacto" },
] as const;

export function Navbar() {
  return (
    <nav
      aria-label="Principal"
      className="relative z-2 mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-6 py-[22px]"
    >
      <Link href="#inicio" aria-label={`${SITE.name}, inicio`} className="flex min-h-11 items-center">
        <Image
          src="/brand/solvyn-logo.png"
          alt={SITE.name}
          width={1100}
          height={262}
          priority
          sizes="126px"
          className="block h-[30px] w-auto"
        />
      </Link>
      <div className="flex items-center gap-8 text-[15px] text-text-secondary max-[860px]:hidden">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center no-underline">
            {link.label}
          </Link>
        ))}
      </div>
      <Button href="/configurar" size="md">
        Configurar
      </Button>
    </nav>
  );
}
