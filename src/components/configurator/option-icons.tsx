import type { ReactNode } from "react";
import {
  CalendarIcon,
  CartIcon,
  ChartIcon,
  LayersIcon,
  MobileIcon,
  PencilIcon,
  SparklesIcon,
  ZapIcon,
} from "@/src/components/ui/icons";
import { INDUSTRIES as LANDING_INDUSTRIES } from "@/src/config/industries";

// One icon per goal, keyed by the catalog ids.
export const GOAL_ICONS: Record<string, ReactNode> = {
  vender: <CartIcon />,
  citas: <CalendarIcon />,
  operar: <LayersIcon />,
  app: <MobileIcon />,
  datos: <ChartIcon />,
  auto: <ZapIcon />,
  ia: <SparklesIcon />,
  otra: <PencilIcon />,
};

// The landing already draws an icon per industry: reuse them, matched by name.
export function IndustryIcon({ label }: { label: string }) {
  const industry = LANDING_INDUSTRIES.find((item) => item.name === label);
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none"
    >
      {industry?.icon ?? <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />}
    </svg>
  );
}
