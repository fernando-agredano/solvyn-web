const PRODUCT_CARDS = [
  { cardBg: "bg-white/[0.08]", titleWidth: "w-[70%]", titleBar: "bg-white/30", priceWidth: "w-[40%]" },
  { cardBg: "bg-white/[0.12]", titleWidth: "w-[60%]", titleBar: "bg-white/30", priceWidth: "w-[35%]" },
  { cardBg: "bg-white/[0.08]", titleWidth: "w-[75%]", titleBar: "bg-white/30", priceWidth: "w-[45%]" },
];

export function StorePreview() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-[28%] rounded-[3px] bg-white/50" />
        <div className="h-4 w-[16%] rounded bg-white/85" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {PRODUCT_CARDS.map((card, index) => (
          <div key={index} className="flex flex-col gap-[5px]">
            <div className={`flex-1 rounded-md ${card.cardBg}`} />
            <div className={`h-1.5 rounded-[3px] ${card.titleBar} ${card.titleWidth}`} />
            <div className={`h-1.5 rounded-[3px] bg-white/60 ${card.priceWidth}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
