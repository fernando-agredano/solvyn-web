"use client";

import { animate, inView } from "motion";
import { type ReactNode, useEffect, useRef } from "react";

const OFFSET_PX = 32;

// Content is visible by default, without JavaScript. Only elements below the fold are hidden, and only once
// JavaScript runs and the user does not prefer reduced motion. Animation enhances, it never gates content.
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.style.opacity = "0";
    element.style.transform = `translateY(${OFFSET_PX}px)`;

    return inView(element, () => {
      animate(element, { opacity: 1, transform: "translateY(0px)" }, { duration: 0.9, ease: "easeOut" });
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}
