export const DEFAULT_HOURLY_RATE_MXN = 600;

export type TeamSize = "s1" | "s2" | "s3" | "s4";

export const TEAM_SIZES: { id: TeamSize; label: string; multiplier: number }[] = [
  { id: "s1", label: "1–10", multiplier: 1 },
  { id: "s2", label: "11–50", multiplier: 1.05 },
  { id: "s3", label: "51–200", multiplier: 1.15 },
  { id: "s4", label: "200+", multiplier: 1.3 },
];

// Hours below each threshold; anything at or above `medium` is high complexity.
export const COMPLEXITY_THRESHOLDS = { low: 220, medium: 420 } as const;

// Share of the project each phase takes. barFlex sets the segment width in the proposal preview, as in the design.
export const PROJECT_PHASES = [
  { label: "Descubrimiento", share: 0.1, barFlex: 1, barColor: "rgba(255,255,255,0.35)" },
  { label: "Diseño", share: 0.2, barFlex: 2, barColor: "rgba(255,255,255,0.55)" },
  { label: "Desarrollo", share: 0.55, barFlex: 5, barColor: "#FFFFFF" },
  { label: "Pruebas y entrega", share: 0.15, barFlex: 1.5, barColor: "rgba(255,255,255,0.35)" },
] as const;
