import type { PreviewAccent, PreviewTemplate } from "@/src/config/preview-templates";

const MOBILE_ROW_COUNT = 4;
const TAB_COUNT = 4;

interface MobilePreviewProps {
  template: PreviewTemplate;
  accent: PreviewAccent;
  businessName: string;
}

export function MobilePreview({ template, accent, businessName }: MobilePreviewProps) {
  return (
    <div className="step-in w-[300px] flex-none rounded-[44px] bg-[#1C1C1E] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.14)]">
      <div className="flex h-[600px] flex-col overflow-hidden rounded-[34px] bg-[#F7F7F8] text-[#18181B]">
        <div className="flex h-[30px] items-center justify-center">
          <span className="h-[22px] w-[90px] rounded-full bg-[#1C1C1E]" />
        </div>
        <div className="flex flex-col gap-1 px-[18px] pt-2.5 pb-3.5">
          <span className="text-xs text-[#71717A]">{businessName}</span>
          <span className="text-xl font-bold">{template.title}</span>
        </div>
        <div className="mx-[18px] flex flex-col gap-1 rounded-2xl p-4 text-white" style={{ background: accent.color }}>
          <span className="text-[11.5px] opacity-85">{template.heroLabel}</span>
          <span className="text-[22px] font-bold">{template.heroValue}</span>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 overflow-hidden px-[18px] py-3.5">
          {template.rows.slice(0, MOBILE_ROW_COUNT).map((item) => (
            <div key={item.primary} className="flex items-center gap-2.5 rounded-[14px] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <span
                className="flex size-[34px] flex-none items-center justify-center rounded-[10px] text-xs font-bold"
                style={{ background: accent.soft, color: accent.color }}
              >
                {item.initials}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[13px] font-semibold">{item.primary}</span>
                <span className="text-[11px] text-[#71717A]">{item.secondary}</span>
              </span>
              <span className="text-xs font-semibold" style={{ color: accent.color }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <div className="grid h-16 grid-cols-4 items-center justify-items-center border-t border-[#ECECEE] bg-white">
          {Array.from({ length: TAB_COUNT }, (_, index) => (
            <span key={index} className="h-1 w-[22px] rounded-xs" style={{ background: index === 0 ? accent.color : "#D4D4D8" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
