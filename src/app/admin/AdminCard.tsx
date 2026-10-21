import Image from "next/image";
import type { ReactNode } from "react";
import { SITE } from "@/src/config/site";
import { ADMIN_PANEL_CLASSES } from "@/src/components/admin/styles";

// Centered card shared by the screens shown before a session exists (login, confirmation).
export function AdminCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main
      id="contenido"
      className="mx-auto flex min-h-screen max-w-[400px] flex-col justify-center gap-6 px-5 py-12"
    >
      <Image
        src="/brand/solvyn-logo-dark.png"
        alt={SITE.name}
        width={1100}
        height={262}
        priority
        sizes="110px"
        className="block h-6 w-auto self-start"
      />
      <div className={`${ADMIN_PANEL_CLASSES} flex flex-col gap-5 p-6`}>
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-lg font-semibold text-[#18181B]">{title}</h1>
          <p className="m-0 text-sm leading-[1.6] text-[#52525B]">
            {description}
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}
