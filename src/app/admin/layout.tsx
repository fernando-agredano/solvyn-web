import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";

// Admin only: the panel uses a neutral UI face, the public site keeps its own typography.
const geist = Geist({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
  // The confirmation URL carries a one-time token: never leak it through the Referer header.
  referrer: "no-referrer",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${geist.className} min-h-screen bg-[#F4F4F5] text-[#18181B] antialiased`}
    >
      {children}
    </div>
  );
}
