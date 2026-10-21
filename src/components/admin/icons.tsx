import type { ReactNode } from "react";

// Panel icons: 24px grid, 1.8 stroke, drawn in currentColor so the parent decides the color.
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const UsersIcon = () => (
  <Icon>
    <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
    <circle cx="10" cy="8" r="3.5" />
    <path d="M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.65a3.5 3.5 0 0 1 0 6.7" />
  </Icon>
);

export const UserPlusIcon = () => (
  <Icon>
    <path d="M15 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 3 18.5V20" />
    <circle cx="9" cy="8" r="3.5" />
    <path d="M19 8v6M16 11h6" />
  </Icon>
);

export const CalendarIcon = () => (
  <Icon>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </Icon>
);

export const FlameIcon = () => (
  <Icon>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Icon>
);

export const BarChartIcon = () => (
  <Icon>
    <path d="M4 20V11M10 20V5M16 20v-7M20 20H3" />
  </Icon>
);

export const TagIcon = () => (
  <Icon>
    <path d="M3 12.5V4h8.5L21 13.5 13.5 21 3 12.5z" />
    <circle cx="7.5" cy="8.5" r="1.2" />
  </Icon>
);

export const FunnelIcon = () => (
  <Icon>
    <path d="M3 5h18l-7 8.5V19l-4 1.5v-7L3 5z" />
  </Icon>
);

export const ClockIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const SearchIcon = () => (
  <Icon>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
);
