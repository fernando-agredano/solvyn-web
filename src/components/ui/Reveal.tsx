"use client";

import { type ReactNode, useEffect, useRef } from "react";

// A block counts as in view once its top is above this share of the viewport height.
const REVEAL_LINE = 0.92;
// Safety net for the scroll restoration the browser does after the page mounts (going back).
const RECHECK_DELAYS_MS = [120, 600];

const pending = new Set<HTMLElement>();
let isListening = false;

function revealVisible() {
  const limit = window.innerHeight * REVEAL_LINE;
  for (const element of pending) {
    if (element.getBoundingClientRect().top < limit) {
      element.dataset.reveal = "shown";
      pending.delete(element);
    }
  }
  if (pending.size === 0) stopListening();
}

function startListening() {
  if (isListening) return;
  isListening = true;
  window.addEventListener("scroll", revealVisible, { passive: true });
  window.addEventListener("resize", revealVisible);
  window.addEventListener("pageshow", revealVisible);
}

function stopListening() {
  if (!isListening) return;
  isListening = false;
  window.removeEventListener("scroll", revealVisible);
  window.removeEventListener("resize", revealVisible);
  window.removeEventListener("pageshow", revealVisible);
}

// Content is visible by default, with no JavaScript. Only blocks below the fold are hidden once the page runs,
// and one scroll listener reveals them. Everything already in view is left alone, and a block that is passed
// while the page restores its scroll is revealed by the same check, so nothing stays hidden. Animation
// enhances, it never gates content (the hidden state lives in globals.css and respects reduced motion).
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    if (
      element.getBoundingClientRect().top >=
      window.innerHeight * REVEAL_LINE
    ) {
      element.dataset.reveal = "pending";
      pending.add(element);
      startListening();
    }
    const timers = RECHECK_DELAYS_MS.map((delay) =>
      window.setTimeout(revealVisible, delay),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      pending.delete(element);
      if (pending.size === 0) stopListening();
    };
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
