import { useEffect, useState } from "react";
import { GENERATION_STEPS, GENERATION_STEP_MS } from "@/src/config/proposal";

const GENERATED_FLAG = "solvyn:proposal-generated";

const hasGeneratedBefore = () => {
  try {
    return window.sessionStorage.getItem(GENERATED_FLAG) === "1";
  } catch {
    return false;
  }
};

const rememberGenerated = () => {
  try {
    window.sessionStorage.setItem(GENERATED_FLAG, "1");
  } catch {
    // Without storage the visitor just sees the animation again.
  }
};

// Editing the answers means a new proposal, so the next visit shows the generating screen again.
export const clearGeneratedFlag = () => {
  try {
    window.sessionStorage.removeItem(GENERATED_FLAG);
  } catch {
    // Nothing to clear without storage.
  }
};

// Drives the "generating" screen: ticks one message at a time and reports when the proposal is ready.
// In Phase 4 the real generation replaces the timer; `stepDurationMs` lets callers match its duration.
export function useProposalGeneration(isEnabled: boolean, stepDurationMs: number = GENERATION_STEP_MS) {
  const [completedSteps, setCompletedSteps] = useState(0);

  const isDone = completedSteps >= GENERATION_STEPS.length;

  useEffect(() => {
    if (!isEnabled || isDone) return;
    // A visitor who already saw the animation in this session goes straight to the proposal.
    if (hasGeneratedBefore()) {
      const skip = setTimeout(() => setCompletedSteps(GENERATION_STEPS.length), 0);
      return () => clearTimeout(skip);
    }
    const timer = setInterval(() => setCompletedSteps((current) => current + 1), stepDurationMs);
    return () => clearInterval(timer);
  }, [isEnabled, isDone, stepDurationMs]);

  useEffect(() => {
    if (isDone && isEnabled) rememberGenerated();
  }, [isDone, isEnabled]);

  return { completedSteps, isDone };
}
