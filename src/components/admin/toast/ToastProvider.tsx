"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

interface ToastInput {
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastItem extends ToastInput {
  id: number;
}

const TOAST_DURATION_MS = 4500;
const MAX_VISIBLE_TOASTS = 3;

// Green is the "ok" indicator of the design system; red only for errors.
const DOT_CLASSES: Record<ToastType, string> = {
  success: "bg-[#059669] shadow-[0_0_8px_rgba(5,150,105,0.5)]",
  error: "bg-[#DC2626]",
  info: "bg-[#71717A]",
};

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++;
      setToasts((current) => [
        ...current.slice(-(MAX_VISIBLE_TOASTS - 1)),
        { ...input, id },
      ]);
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-16 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 sm:right-6"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role={item.type === "error" ? "alert" : "status"}
            className="admin-toast pointer-events-auto flex items-start gap-3 rounded-xl border border-[#E4E4E7] bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          >
            <span
              aria-hidden="true"
              className={`mt-1.5 size-2 flex-none rounded-full ${DOT_CLASSES[item.type]}`}
            />
            <div className="min-w-0 flex-1">
              <p className="m-0 text-sm font-medium text-[#18181B]">
                {item.title}
              </p>
              {item.description && (
                <p className="m-0 mt-0.5 text-xs leading-[1.5] text-[#52525B]">
                  {item.description}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Cerrar notificación"
              onClick={() => dismiss(item.id)}
              className="flex-none cursor-pointer rounded-md px-1.5 text-base leading-none text-[#71717A] hover:text-[#18181B]"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside ToastProvider");
  return toast;
}
