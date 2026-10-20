import type { PreviewAccent, PreviewTemplate, StatusTone } from "@/src/config/preview-templates";

// The preview paints its own light interface with fixed colors, so it never depends on the site's dark theme.
const NEUTRAL_PILL = { background: "#F4F4F5", color: "#52525B" };
const WARNING_PILL = { background: "#FEF3C7", color: "#92400E" };

interface DesktopPreviewProps {
  template: PreviewTemplate;
  accent: PreviewAccent;
  businessName: string;
  url: string;
}

export function DesktopPreview({ template, accent, businessName, url }: DesktopPreviewProps) {
  const pillStyle = (tone: StatusTone) =>
    tone === "ok" ? { background: accent.soft, color: accent.color } : tone === "warn" ? WARNING_PILL : NEUTRAL_PILL;

  return (
    <div className="step-in w-[880px] flex-none rounded-xl bg-[#E8E8EA] px-2.5 pt-2.5 text-[#18181B] shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.12)]">
      <div className="flex items-center gap-1.5 px-1.5 pt-0.5 pb-2.5">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-2.5 rounded-full bg-[#C7C7CC]" />
        ))}
        <span className="ml-3 flex h-[22px] flex-1 items-center rounded-md bg-white pl-2.5 text-[11px] text-[#6B6B6B]">{url}</span>
      </div>
      <div className="flex h-[470px] overflow-hidden rounded-t-md bg-[#F7F7F8]">
        <div className="flex w-[190px] flex-none flex-col gap-1 border-r border-[#ECECEE] bg-white px-3.5 py-[18px]">
          <div className="flex items-center gap-2 px-1.5 pb-4">
            <span className="size-6 rounded-[7px]" style={{ background: accent.color }} />
            <span className="truncate text-[13px] font-bold">{businessName}</span>
          </div>
          {template.nav.map((label, index) => (
            <span
              key={label}
              className={`block rounded-[7px] px-2.5 py-2 text-[12.5px] ${index === 1 ? "font-semibold" : "font-medium"}`}
              style={index === 1 ? { background: accent.soft, color: accent.color } : { color: "#52525B" }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 px-6 py-[22px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[17px] font-bold">{template.title}</span>
              <span className="text-[11.5px] text-[#71717A]">{template.subtitle}</span>
            </div>
            <span className="rounded-lg px-3.5 py-2 text-xs font-semibold text-white" style={{ background: accent.color }}>
              {template.action}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {template.stats.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 rounded-[10px] border border-[#ECECEE] bg-white px-3.5 py-3">
                <span className="text-[11px] text-[#71717A]">{item.label}</span>
                <span className="text-lg font-bold">{item.value}</span>
                <span className="text-[10.5px] font-semibold" style={{ color: accent.color }}>
                  {item.delta}
                </span>
              </div>
            ))}
          </div>
          <div className="flex min-h-0 flex-1 flex-col rounded-[10px] border border-[#ECECEE] bg-white px-3.5 py-1.5">
            {template.rows.map((item) => (
              <div key={item.primary} className="flex items-center gap-3 border-b border-[#F1F1F3] py-[9px] text-xs">
                <span
                  className="flex size-7 flex-none items-center justify-center rounded-lg text-[11px] font-bold"
                  style={{ background: accent.soft, color: accent.color }}
                >
                  {item.initials}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-semibold">{item.primary}</span>
                  <span className="text-[11px] text-[#71717A]">{item.secondary}</span>
                </span>
                <span className="font-medium text-[#52525B]">{item.value}</span>
                <span className="rounded-full px-[9px] py-[3px] text-[10.5px] font-semibold" style={pillStyle(item.tone)}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
