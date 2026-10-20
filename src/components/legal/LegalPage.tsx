import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/src/components/layout/SiteFooter";
import { SITE } from "@/src/config/site";

interface LegalPageProps {
  title: string;
  meta: string;
  children: ReactNode;
}

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalPage({ title, meta, children }: LegalPageProps) {
  return (
    <>
      <header className="mx-auto flex w-full max-w-[720px] px-6 pt-[22px]">
        <Link
          href="/"
          aria-label={`${SITE.name}, inicio`}
          className="flex min-h-11 items-center"
        >
          <Image
            src="/brand/solvyn-logo.png"
            alt={SITE.name}
            width={1100}
            height={262}
            sizes="126px"
            className="block h-[30px] w-auto"
          />
        </Link>
      </header>
      <main
        id="contenido"
        tabIndex={-1}
        className="mx-auto w-full max-w-[720px] px-6 py-12 outline-none"
      >
        <h1 className="wide text-[clamp(32px,5vw,44px)] leading-[1.1] font-bold text-heading">
          {title}
        </h1>
        <p className="mt-4 text-sm text-muted">{meta}</p>
        <div className="mt-10 flex flex-col gap-10 text-[16px] leading-[1.7] text-text-secondary">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="semi text-xl font-semibold text-heading">{title}</h2>
      {children}
    </section>
  );
}
