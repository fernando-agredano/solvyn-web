import Image from "next/image";
import type { ReactNode } from "react";
import { CheckIcon } from "@/src/components/ui/icons";
import { SITE } from "@/src/config/site";
import { ADMIN_PANEL_CLASSES } from "@/src/components/admin/styles";

interface AdminCardProps {
  title: string;
  description: string;
  // Small pill above the icon that names the state of the screen.
  badge: string;
  icon: ReactNode;
  // Short reassurances shown as badges at the bottom, each with a green check.
  perks?: string[];
  children?: ReactNode;
}

// Faint dots plus circuit traces that fade out toward the center, so the card keeps all the attention.
function BackgroundPattern() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(24,24,27,0.28) 1.2px, transparent 1.7px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 50%, transparent 20%, #000 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 50%, transparent 20%, #000 70%)",
        }}
      />
      <svg
        className="absolute inset-0 size-full text-[#18181B]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: 0.2,
          maskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 25%, #000 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 25%, #000 70%)",
        }}
      >
        <path d="M0 150 H140 L190 200 H330 L370 160 H470" />
        <path d="M0 310 H90 L140 360 H260" />
        <path d="M60 800 V640 L110 590 H250 L290 550 V470" />
        <path d="M1200 120 H1060 L1010 170 H880 L840 130 H740" />
        <path d="M1200 290 H1110 L1060 340 H940" />
        <path d="M1140 800 V660 L1090 610 H960 L920 570 V480" />
        <g fill="currentColor" stroke="none">
          <circle cx="470" cy="160" r="4.5" />
          <circle cx="260" cy="360" r="4.5" />
          <circle cx="290" cy="470" r="4.5" />
          <circle cx="740" cy="130" r="4.5" />
          <circle cx="940" cy="340" r="4.5" />
          <circle cx="920" cy="480" r="4.5" />
        </g>
      </svg>
    </div>
  );
}

// Centered card shared by the screens shown before a session exists (login, confirmation).
export function AdminCard({
  title,
  description,
  badge,
  icon,
  perks,
  children,
}: AdminCardProps) {
  return (
    <div className="relative min-h-screen">
    <BackgroundPattern />
    <main
      id="contenido"
      className="relative mx-auto flex min-h-screen max-w-[520px] flex-col justify-center gap-8 px-5 py-12"
    >
      <Image
        src="/brand/solvyn-logo-dark.png"
        alt={SITE.name}
        width={1100}
        height={262}
        priority
        sizes="200px"
        className="block h-11 w-auto self-center"
      />
      <div
        className={`${ADMIN_PANEL_CLASSES} flex flex-col items-center gap-6 p-7 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-8`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-[#FAFAFA] px-2.5 py-1 text-xs font-medium text-[#52525B]">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#059669]"
          />
          {badge}
        </span>

        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] text-[#18181B] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          {icon}
        </span>

        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-xl font-semibold text-[#18181B]">{title}</h1>
          <p className="m-0 text-sm leading-[1.6] text-[#52525B]">
            {description}
          </p>
        </div>

        {children}

        {perks && perks.length > 0 && (
          <ul className="m-0 flex w-full list-none flex-wrap justify-center gap-2 border-t border-[#F4F4F5] p-0 pt-5">
            {perks.map((perk) => (
              <li
                key={perk}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs text-[#52525B]"
              >
                <span className="text-[#059669]">
                  <CheckIcon size={13} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
    </div>
  );
}
