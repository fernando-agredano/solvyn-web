"use client";

import Cal, { getCalApi, type EmbedEvent } from "@calcom/embed-react";
import { useEffect } from "react";
import { CAL_LINK, CAL_LOAD_TIMEOUT_MS } from "@/src/config/scheduling";

interface CalendarEmbedProps {
  name: string;
  email: string;
  isLoaded: boolean;
  onBooked: (startTime: string) => void;
  onUnavailable: () => void;
  onReady: () => void;
}

// Black and white like the rest of the site; the embed lives in its own iframe, so it is themed through Cal's CSS variables.
const DARK_THEME_VARS = {
  "cal-bg": "#000000",
  "cal-bg-muted": "#0A0A0A",
  "cal-bg-subtle": "#141414",
  "cal-bg-emphasis": "#1F1F1F",
  "cal-border": "rgba(255,255,255,0.14)",
  "cal-border-subtle": "rgba(255,255,255,0.08)",
  "cal-text": "#F5F5F5",
  "cal-text-emphasis": "#FFFFFF",
  "cal-text-subtle": "#A3A3A3",
  "cal-brand": "#FFFFFF",
  "cal-brand-emphasis": "#E5E5E5",
  "cal-brand-text": "#000000",
};

export function CalendarEmbed({ name, email, isLoaded, onBooked, onUnavailable, onReady }: CalendarEmbedProps) {
  useEffect(() => {
    let isActive = true;
    const cleanups: (() => void)[] = [];

    getCalApi().then((cal) => {
      if (!isActive) return;
      cal("ui", { theme: "dark", hideEventTypeDetails: false, cssVarsPerTheme: { dark: DARK_THEME_VARS, light: DARK_THEME_VARS } });

      const handleReady = () => onReady();
      const handleFailed = () => onUnavailable();
      const handleBooked = (event: EmbedEvent<"bookingSuccessfulV2">) => {
        const startTime = event.detail.data.startTime;
        if (startTime) onBooked(startTime);
      };
      cal("on", { action: "linkReady", callback: handleReady });
      cal("on", { action: "linkFailed", callback: handleFailed });
      cal("on", { action: "bookingSuccessfulV2", callback: handleBooked });
      cleanups.push(() => {
        cal("off", { action: "linkReady", callback: handleReady });
        cal("off", { action: "linkFailed", callback: handleFailed });
        cal("off", { action: "bookingSuccessfulV2", callback: handleBooked });
      });
    }, onUnavailable);

    return () => {
      isActive = false;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [onBooked, onReady, onUnavailable]);

  // Blocked scripts or a slow network never fire an event, so waiting is bounded.
  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(onUnavailable, CAL_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoaded, onUnavailable]);

  return (
    <div className="min-h-[560px] overflow-hidden rounded-2xl border border-white/14 bg-black lg:h-full lg:min-h-0 lg:overflow-y-auto">
      <Cal calLink={CAL_LINK} style={{ width: "100%", height: "100%" }} config={{ name, email, theme: "dark", layout: "month_view" }} />
    </div>
  );
}
