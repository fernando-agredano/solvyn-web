const KPI_CARDS = [
  { labelWidth: "w-1/2", valueWidth: "w-[70%]" },
  { labelWidth: "w-[40%]", valueWidth: "w-[55%]" },
  { labelWidth: "w-[60%]", valueWidth: "w-[45%]" },
];

const CHART_BARS = [
  { height: "35%", className: "bg-white/20" },
  { height: "50%", className: "bg-white/25" },
  { height: "42%", className: "bg-white/20" },
  { height: "65%", className: "bg-white/35" },
  { height: "58%", className: "bg-white/30" },
  { height: "82%", className: "bg-white/85" },
];

export function DashboardPreview() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-2">
        {KPI_CARDS.map((card, index) => (
          <div key={index} className="flex flex-col gap-[5px] rounded-md bg-white/[0.06] p-2">
            <div className={`h-[5px] rounded-[3px] bg-white/30 ${card.labelWidth}`} />
            <div className={`h-2.5 rounded-[3px] bg-white/80 ${card.valueWidth}`} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-1.5 rounded-md bg-white/[0.04] p-2.5">
        {CHART_BARS.map((bar, index) => (
          <div
            key={index}
            className={`flex-1 rounded-[3px] ${bar.className}`}
            style={{ height: bar.height }}
          />
        ))}
      </div>
    </div>
  );
}
