import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
  // The confirmation URL carries a one-time token: never leak it through the Referer header.
  referrer: "no-referrer",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(255,255,255,0.06),rgba(255,255,255,0)_70%),#000000]">
      {children}
    </div>
  );
}
