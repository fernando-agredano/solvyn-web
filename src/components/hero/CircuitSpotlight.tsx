"use client";

import { useEffect, useRef } from "react";
import { CIRCUIT_TRACES } from "./circuit-paths";

const HIDDEN_POSITION = -9999;

export function CircuitSpotlight() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    // Like the design, listen on the whole hero section, so the beam also follows the cursor over the copy.
    const section = layer?.closest("section");
    if (!layer || !section) return;

    let frameId = 0;
    let pointerX = HIDDEN_POSITION;
    let pointerY = HIDDEN_POSITION;

    // Writes CSS variables directly: moving the cursor never re-renders React.
    const paintPointer = () => {
      frameId = 0;
      layer.style.setProperty("--spot-x", `${pointerX}px`);
      layer.style.setProperty("--spot-y", `${pointerY}px`);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = layer.getBoundingClientRect();
      pointerX = Math.round(event.clientX - rect.left);
      pointerY = Math.round(event.clientY - rect.top);
      if (!frameId) frameId = requestAnimationFrame(paintPointer);
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(frameId);
      pointerX = HIDDEN_POSITION;
      pointerY = HIDDEN_POSITION;
      paintPointer();
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={layerRef} aria-hidden="true" className="circuit-spotlight absolute inset-0">
      <svg viewBox="0 0 1440 900" className="absolute inset-0 block size-full">
        <g fill="none" strokeWidth={1.4} stroke="rgba(255,255,255,0.75)">
          {CIRCUIT_TRACES.map((trace) => (
            <path key={trace.d} d={trace.d} />
          ))}
        </g>
      </svg>
    </div>
  );
}
