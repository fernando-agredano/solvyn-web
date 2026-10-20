"use client";

import { useId, useState } from "react";
import { FAQ_ITEMS } from "@/src/config/faq";

export function FaqList() {
  // The first question starts open, as in the design. Opening one closes the others.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const idPrefix = useId();

  return (
    <div className="border-t border-white/10">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${idPrefix}-question-${index}`;
        const panelId = `${idPrefix}-answer-${index}`;

        return (
          <div key={item.question} className="border-b border-white/10">
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-5 border-0 bg-transparent px-1 py-5 text-left text-[18px] font-medium text-foreground"
              >
                <span>{item.question}</span>
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  aria-hidden="true"
                  className={`flex-none transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="m-0 max-w-[620px] px-1 pb-6 text-base leading-[1.65] text-text-secondary animate-[fadein_.35s_ease]">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
