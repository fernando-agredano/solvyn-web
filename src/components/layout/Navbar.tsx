"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { SegmentedNav } from "@/src/components/ui/SegmentedNav";
import { SITE } from "@/src/config/site";

const NAV_LINKS = [
  { label: "Cómo funciona", href: "#como" },
  { label: "Propuestas", href: "#propuesta" },
  { label: "Soluciones", href: "#soluciones" },
  { label: "Precios", href: "#precios" },
  { label: "Contacto", href: "#contacto" },
] as const;

const SCROLLED_AFTER_PX = 8;
// Near the top the hero is showing, so no section is highlighted.
const HERO_ZONE_PX = 120;

// Fixed header. At the top it blends into the page; once the page scrolls it gets a translucent dark layer with
// a blur and a hairline border. The navigation highlights the section being read.
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > SCROLLED_AFTER_PX);
      if (window.scrollY < HERO_ZONE_PX) setActiveIndex(-1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy: the section crossing a thin band at the middle of the viewport is the current one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActiveIndex(
            NAV_LINKS.findIndex((link) => link.href === `#${entry.target.id}`),
          );
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        isScrolled
          ? "border-white/10 bg-black/60 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="grid h-16 grid-cols-[auto_1fr] items-center px-4 sm:px-8 lg:px-12 min-[1000px]:grid-cols-[1fr_auto_1fr]">
        <Link
          href="#inicio"
          aria-label={`${SITE.name}, inicio`}
          className="flex min-h-11 items-center justify-self-start"
        >
          <Image
            src="/brand/solvyn-logo.png"
            alt={SITE.name}
            width={1100}
            height={262}
            priority
            sizes="126px"
            className="block h-[30px] w-auto"
          />
        </Link>
        <div className="hidden justify-self-center min-[1000px]:block">
          <SegmentedNav
            items={NAV_LINKS}
            activeIndex={activeIndex}
            ariaLabel="Principal"
            itemWidthClass="w-[6.75rem]"
            itemMinHeightClass="min-h-[34px]"
            textSizeClass="text-[13px]"
            tone="dark"
          />
        </div>
        <div className="justify-self-end">
          <Button href="/configurar" size="md" withArrow>
            Configurar
          </Button>
        </div>
      </div>
    </header>
  );
}
