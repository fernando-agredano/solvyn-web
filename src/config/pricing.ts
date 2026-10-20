export const DEFAULT_HOURLY_RATE_MXN = 600;

// Share of the project each phase takes. barFlex sets the segment width in the proposal preview, as in the design.
export const PROJECT_PHASES = [
  { label: "Descubrimiento", share: 0.1, barFlex: 1, barColor: "rgba(255,255,255,0.35)" },
  { label: "Diseño", share: 0.2, barFlex: 2, barColor: "rgba(255,255,255,0.55)" },
  { label: "Desarrollo", share: 0.55, barFlex: 5, barColor: "#FFFFFF" },
  { label: "Pruebas y entrega", share: 0.15, barFlex: 1.5, barColor: "rgba(255,255,255,0.35)" },
] as const;
