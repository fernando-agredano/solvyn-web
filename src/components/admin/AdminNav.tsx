"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/ajustes", label: "Ajustes" },
] as const;

// Leads stays active on a lead's detail page too.
const isActivePath = (pathname: string, href: string) =>
  href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

export function AdminNav() {
  const pathname = usePathname();
  return (
    <AdminNavView
      activeIndex={LINKS.findIndex((link) => isActivePath(pathname, link.href))}
    />
  );
}

// A segmented control: the white indicator slides to the current section. Every item has the same width, so the
// indicator moves by whole multiples of its own width and needs no measuring.
export function AdminNavView({ activeIndex }: { activeIndex: number }) {
  return (
    <nav
      aria-label="Secciones del panel"
      className="relative grid grid-cols-3 rounded-full border border-[#E4E4E7] bg-[#F4F4F5] p-1"
    >
      {activeIndex >= 0 && (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
      )}
      {LINKS.map((link, index) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={index === activeIndex ? "page" : undefined}
          className={`relative z-10 inline-flex min-h-8 w-24 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors duration-200 ${
            index === activeIndex
              ? "text-[#18181B]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
