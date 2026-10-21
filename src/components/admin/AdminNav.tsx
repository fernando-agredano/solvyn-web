"use client";

import { usePathname } from "next/navigation";
import { SegmentedNav } from "@/src/components/ui/SegmentedNav";

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
    <SegmentedNav
      items={LINKS}
      activeIndex={LINKS.findIndex((link) => isActivePath(pathname, link.href))}
      ariaLabel="Secciones del panel"
      itemWidthClass="w-24"
    />
  );
}
