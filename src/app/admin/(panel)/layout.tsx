import Image from "next/image";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { connection } from "next/server";
import { AdminNav } from "@/src/components/admin/AdminNav";
import { AdminUserChip } from "@/src/components/admin/AdminUserChip";
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
        {/* Three columns from md: logo, navigation, session. The 1fr sides keep the navigation at the true center. */}
        <div className="grid grid-cols-[auto_auto] items-center justify-between gap-y-2 px-4 py-2 sm:px-8 md:h-14 md:grid-cols-[1fr_auto_1fr] md:py-0 lg:px-12">
          <Image
            src="/brand/solvyn-logo-dark.png"
            alt={SITE.name}
            width={1100}
            height={262}
            priority
            sizes="140px"
            className="col-start-1 row-start-1 block h-8 w-auto justify-self-start"
          />
          <div className="col-span-2 row-start-2 justify-self-center md:col-span-1 md:col-start-2 md:row-start-1">
            <AdminNav />
          </div>
          <div className="col-start-2 row-start-1 flex items-center justify-self-end gap-3 md:col-start-3">
            <AdminUserChip email={user.email ?? ""} />
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
