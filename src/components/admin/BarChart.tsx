const WIDTH = 600;
const HEIGHT = 180;
const TOP = 8;
const BOTTOM = 24;
// Every fifth label keeps the axis readable on a phone without crowding it.
const LABEL_EVERY = 5;

// Hand-drawn SVG: a chart library would be one more dependency for a single bar chart.
export function BarChart({
  data,
  ariaLabel,
}: {
  data: { label: string; value: number }[];
  ariaLabel: string;
}) {
  const max = Math.max(1, ...data.map((item) => item.value));
  const slot = WIDTH / data.length;
  const barWidth = slot * 0.6;
  const plotHeight = HEIGHT - TOP - BOTTOM;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={ariaLabel}
      className="h-44 w-full"
    >
      <line
        x1={0}
        x2={WIDTH}
        y1={HEIGHT - BOTTOM}
        y2={HEIGHT - BOTTOM}
        stroke="#E4E4E7"
      />
      {data.map((item, index) => {
        const height = (plotHeight * item.value) / max;
        const x = index * slot + (slot - barWidth) / 2;
        return (
          <g key={item.label}>
            <rect
              x={x}
              y={HEIGHT - BOTTOM - height}
              width={barWidth}
              height={height}
              rx={2}
              fill="#18181B"
            >
              <title>{`${item.label}: ${item.value}`}</title>
            </rect>
            {index % LABEL_EVERY === 0 && (
              <text
                x={x + barWidth / 2}
                y={HEIGHT - 6}
                textAnchor="middle"
                fontSize={11}
                fill="#71717A"
              >
                {item.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
