"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/ajustes", label: "Ajustes" },
] as const;

// Only the current section is highlighted. Leads stays active on a lead's detail page too.
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Secciones del panel" className="flex items-center gap-1">
      {LINKS.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex min-h-9 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150 ${
              isActive
                ? "bg-[#F4F4F5] text-[#18181B]"
                : "text-[#71717A] hover:text-[#18181B]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
