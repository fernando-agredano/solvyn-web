import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { SITE } from "@/src/config/site";
import { requireAdmin } from "@/src/lib/admin/auth";
import { Button } from "@/src/components/ui/Button";
import { signOut } from "../actions";

async function PanelFrame({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <>
      <header className="border-b border-border-subtle">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-[18px]">
          <Image
            src="/brand/solvyn-logo.png"
            alt={SITE.name}
            width={1100}
            height={262}
            priority
            sizes="110px"
            className="block h-[26px] w-auto"
          />
          <nav
            aria-label="Secciones del panel"
            className="flex items-center gap-5 text-[15px]"
          >
            <Link
              href="/admin"
              className="text-text-secondary no-underline hover:text-heading"
            >
              Resumen
            </Link>
            <Link
              href="/admin/leads"
              className="text-text-secondary no-underline hover:text-heading"
            >
              Leads
            </Link>
            <Link
              href="/admin/ajustes"
              className="text-text-secondary no-underline hover:text-heading"
            >
              Ajustes
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-label">{user.email}</span>
            <form action={signOut}>
              <Button type="submit" variant="secondary" size="md">
                Cerrar sesión
              </Button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}

// The layout gives the frame, not the protection: every page below calls requireAdmin() itself.
// Inside Suspense a redirect() arrives after the shell streams, so the HTTP 307 for a missing session comes from the proxy.
export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <PanelFrame>{children}</PanelFrame>
    </Suspense>
  );
}
