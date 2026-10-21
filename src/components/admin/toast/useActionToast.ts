import { useEffect, useRef } from "react";
import { useToast } from "./ToastProvider";

interface ToastMessage {
  title: string;
  description?: string;
}

// Shows a toast each time a form action settles. The initial state, and re-renders with the same state, stay silent.
export function useActionToast(
  state: { status: "idle" | "saved" | "error" },
  messages: { saved: ToastMessage; error: ToastMessage },
) {
  const toast = useToast();
  const handledState = useRef(state);

  useEffect(() => {
    if (handledState.current === state) return;
    handledState.current = state;
    if (state.status === "saved") toast({ type: "success", ...messages.saved });
    if (state.status === "error") toast({ type: "error", ...messages.error });
  }, [state, messages, toast]);
}
