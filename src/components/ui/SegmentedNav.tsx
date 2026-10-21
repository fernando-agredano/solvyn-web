import Link from "next/link";

type Tone = "light" | "dark";

// Colors per theme: the admin panel is light, the public site is dark.
const TONE_CLASSES: Record<
  Tone,
  { track: string; indicator: string; active: string; inactive: string }
> = {
  light: {
    track: "border-[#E4E4E7] bg-[#F4F4F5]",
    indicator:
      "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]",
    active: "text-[#18181B]",
    inactive: "text-[#71717A] hover:text-[#18181B]",
  },
  dark: {
    track: "border-white/10 bg-white/[0.04]",
    indicator:
      "bg-white/[0.12] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),0_1px_6px_rgba(0,0,0,0.4)]",
    active: "text-white",
    inactive: "text-text-secondary hover:text-white",
  },
};

// A segmented control of links: the indicator slides to the current item. Every item has the same width, so the
// indicator moves by whole multiples of its own width and needs no measuring. Shared by the admin header, the
// Leads view switch and the landing header.
export function SegmentedNav({
  items,
  activeIndex,
  ariaLabel,
  itemWidthClass,
  tone = "light",
  textSizeClass = "text-sm",
  itemMinHeightClass = "min-h-8",
}: {
  items: readonly { href: string; label: string }[];
  activeIndex: number;
  ariaLabel: string;
  itemWidthClass: string;
  tone?: Tone;
  textSizeClass?: string;
  itemMinHeightClass?: string;
}) {
  const colors = TONE_CLASSES[tone];

  return (
    <nav
      aria-label={ariaLabel}
      className={`relative grid rounded-full border p-1 ${colors.track}`}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {activeIndex >= 0 && (
        <span
          aria-hidden="true"
          className={`absolute inset-y-1 left-1 rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none ${colors.indicator}`}
          style={{
            width: `calc((100% - 0.5rem) / ${items.length})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      )}
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={index === activeIndex ? "page" : undefined}
          className={`relative z-10 inline-flex items-center justify-center rounded-full px-3 font-medium whitespace-nowrap transition-colors duration-200 ${textSizeClass} ${itemMinHeightClass} ${itemWidthClass} ${
            index === activeIndex ? colors.active : colors.inactive
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
