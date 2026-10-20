type CellBar = {
  height: string;
  className: string;
  marginTop?: string;
};

const CELLS: readonly { bar?: CellBar }[] = [
  {},
  { bar: { height: "30%", className: "bg-white/60" } },
  {},
  { bar: { height: "22%", className: "bg-white/30", marginTop: "40%" } },
  {},
  { bar: { height: "40%", className: "bg-white/30" } },
  {},
  { bar: { height: "30%", className: "bg-white/60", marginTop: "20%" } },
  {},
  {},
];

export function AgendaPreview() {
  return (
    <div className="flex h-full gap-2.5">
      <div className="flex w-[22%] flex-col gap-2">
        <div className="h-2.5 w-[70%] rounded-[3px] bg-white/50" />
        <div className="mt-2 h-2 rounded-[3px] bg-white/[0.18]" />
        <div className="h-2 rounded-[3px] bg-white/10" />
        <div className="h-2 rounded-[3px] bg-white/10" />
      </div>
      <div className="grid flex-1 grid-cols-5 gap-[5px]">
        {CELLS.map((cell, index) => (
          <div key={index} className={`rounded bg-white/5 ${cell.bar ? "p-1" : ""}`}>
            {cell.bar && (
              <div
                className={`rounded-[3px] ${cell.bar.className}`}
                style={{ height: cell.bar.height, marginTop: cell.bar.marginTop }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
