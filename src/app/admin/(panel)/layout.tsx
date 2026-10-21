import Image from "next/image";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { connection } from "next/server";
import { AdminNav } from "@/src/components/admin/AdminNav";
import { SignOutButton } from "@/src/components/admin/SignOutButton";
import { SITE } from "@/src/config/site";
import { requireAdmin } from "@/src/lib/admin/auth";
import { signOut } from "../actions";

async function PanelFrame({ children }: { children: ReactNode }) {
  // The session is read per request: the panel must never be prerendered with a stale login state.
  await connection();
  const { user } = await requireAdmin();
  return (
    <>
      {/* Sticky: the header stays on top while the page scrolls. */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] bg-white/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-6">
            <Image
              src="/brand/solvyn-logo-dark.png"
              alt={SITE.name}
              width={1100}
              height={262}
              priority
              sizes="140px"
              className="block h-8 w-auto"
            />
            <AdminNav />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[#71717A] sm:inline">
              {user.email}
            </span>
            <SignOutButton action={signOut} />
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
