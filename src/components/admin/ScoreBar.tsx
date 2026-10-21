// The score (0 to 100) as a number and a thin bar, so a column of leads can be compared at a glance.
export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 text-right text-sm font-medium tabular-nums text-[#18181B]">
        {score}
      </span>
      <span aria-hidden="true" className="h-1.5 w-16 rounded-full bg-[#F4F4F5]">
        <span
          className="block h-1.5 rounded-full bg-[#18181B]"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </span>
    </div>
  );
}
