import Image from "next/image";
import type { ReactNode } from "react";
import { SITE } from "@/src/config/site";

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
      className="mx-auto flex min-h-screen max-w-[440px] flex-col justify-center gap-8 px-6 py-12"
    >
      <Image
        src="/brand/solvyn-logo.png"
        alt={SITE.name}
        width={1100}
        height={262}
        priority
        sizes="110px"
        className="block h-[26px] w-auto self-start"
      />
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-gradient-to-b from-white/[0.04] to-transparent p-7">
        <div className="flex flex-col gap-2">
          <h1 className="wide m-0 text-2xl font-bold text-heading">{title}</h1>
          <p className="m-0 text-[15px] leading-[1.6] text-text-secondary">
            {description}
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}
