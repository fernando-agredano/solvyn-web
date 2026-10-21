// Ranked bars for a few categories. Each row keeps its number, so the chart never hides the exact value.
export function HorizontalBars({
  rows,
}: {
  rows: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));

  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {rows.map((row) => (
        <li
          key={row.label}
          className="grid grid-cols-[8rem_1fr_2.5rem] items-center gap-3 text-sm"
        >
          <span className="truncate text-[#52525B]">{row.label}</span>
          <span aria-hidden="true" className="h-2 rounded-full bg-[#F4F4F5]">
            <span
              className="block h-2 rounded-full bg-[#18181B]"
              style={{ width: `${(row.value / max) * 100}%` }}
            />
          </span>
          <span className="text-right font-medium tabular-nums text-[#18181B]">
            {row.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
