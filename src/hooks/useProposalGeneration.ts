import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { GENERATION_STEPS, GENERATION_STEP_MS } from "@/src/config/proposal";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import {
  buildProposalRequest,
  getRequestSignature,
  readGeneratedSlug,
  rememberGeneratedSlug,
  requestProposalSlug,
} from "@/src/lib/proposals/client";

// The last message stays pending until the real response arrives, so the screen never claims to be done early.
const STEPS_BEFORE_RESPONSE = GENERATION_STEPS.length - 1;
const FINISH_DELAY_MS = 500;

export const getProposalPath = (slug: string) => `/propuesta/${slug}`;

// Drives the "generating" screen: asks the server for the proposal, ticks the messages with a minimum pace
// and navigates to the saved proposal once both the response and the animation are done.
export function useProposalGeneration(isEnabled: boolean) {
  const router = useRouter();
  const [ticks, setTicks] = useState(0);
  // `isReused`: the same answers were already generated in this session, so there is nothing to wait for.
  const [result, setResult] = useState<{ slug: string; isReused: boolean } | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Strict mode runs effects twice: this keeps each attempt to one request (every request counts towards the rate limit).
  const startedAttempt = useRef<number | null>(null);

  useEffect(() => {
    if (!isEnabled || startedAttempt.current === attempt) return;
    startedAttempt.current = attempt;

    const generate = async () => {
      const body = buildProposalRequest(useConfiguratorStore.getState());
      if (!body) throw new Error("Incomplete answers");
      const signature = getRequestSignature(body);
      const reusedSlug = readGeneratedSlug(signature);
      if (reusedSlug) return { slug: reusedSlug, isReused: true };
      const slug = await requestProposalSlug(body);
      rememberGeneratedSlug(signature, slug);
      return { slug, isReused: false };
    };
    generate().then(setResult, () => setHasFailed(true));
  }, [isEnabled, attempt]);

  useEffect(() => {
    if (!isEnabled || hasFailed || ticks >= STEPS_BEFORE_RESPONSE) return;
    const timer = setTimeout(() => setTicks((current) => current + 1), GENERATION_STEP_MS);
    return () => clearTimeout(timer);
  }, [isEnabled, hasFailed, ticks]);

  const isFinished = result !== null && (result.isReused || ticks >= STEPS_BEFORE_RESPONSE);
  const slug = result?.slug;

  useEffect(() => {
    if (!isFinished || !slug) return;
    const timer = setTimeout(() => router.replace(getProposalPath(slug)), result?.isReused ? 0 : FINISH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isFinished, slug, result?.isReused, router]);

  const retry = useCallback(() => {
    setHasFailed(false);
    setResult(null);
    setTicks(0);
    setAttempt((current) => current + 1);
  }, []);

  return { completedSteps: isFinished ? GENERATION_STEPS.length : ticks, hasFailed, retry };
}
