import {
  COMPLEXITY_THRESHOLDS,
  PROJECT_PHASES,
  TEAM_SIZES,
  type TeamSize,
} from "@/src/config/pricing";

const HOURS_PER_WEEK = 30;

export type Complexity = "baja" | "media" | "alta";

export function getSizeMultiplier(size: TeamSize | null): number {
  return TEAM_SIZES.find((option) => option.id === size)?.multiplier ?? 1;
}

export function calculateTotalHours(moduleHours: number[], size: TeamSize | null): number {
  const baseHours = moduleHours.reduce((total, hours) => total + hours, 0);
  return Math.round(baseHours * getSizeMultiplier(size));
}

// Investment range: 85% to 115% of hours x rate, rounded to the thousand.
export function estimateInvestmentRange(hours: number, hourlyRate: number) {
  const base = hours * hourlyRate;
  return {
    min: Math.round((base * 0.85) / 1000) * 1000,
    max: Math.round((base * 1.15) / 1000) * 1000,
  };
}

export function estimateWeekRange(hours: number) {
  const min = Math.max(2, Math.floor((hours * 0.9) / HOURS_PER_WEEK));
  const max = Math.max(min + 1, Math.ceil((hours * 1.1) / HOURS_PER_WEEK));
  return { min, max };
}

export function getComplexity(hours: number): Complexity {
  if (hours < COMPLEXITY_THRESHOLDS.low) return "baja";
  if (hours < COMPLEXITY_THRESHOLDS.medium) return "media";
  return "alta";
}

export function estimatePhaseWeeks(hours: number, share: number) {
  return Math.max(1, Math.round((hours / HOURS_PER_WEEK) * share));
}

export function estimatePhases(hours: number) {
  return PROJECT_PHASES.map((phase) => ({
    label: phase.label,
    share: phase.share,
    weeks: estimatePhaseWeeks(hours, phase.share),
  }));
}

export function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(
    amount,
  );
}
