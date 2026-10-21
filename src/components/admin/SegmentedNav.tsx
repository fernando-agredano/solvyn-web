import Link from "next/link";

// A segmented control of links: the white indicator slides to the current item. Every item has the same width, so
// the indicator moves by whole multiples of its own width and needs no measuring. Shared by the header and the
// Leads view switch.
export function SegmentedNav({
  items,
  activeIndex,
  ariaLabel,
  itemWidthClass,
}: {
  items: readonly { href: string; label: string }[];
  activeIndex: number;
  ariaLabel: string;
  itemWidthClass: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className="relative grid rounded-full border border-[#E4E4E7] bg-[#F4F4F5] p-1"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {activeIndex >= 0 && (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out motion-reduce:transition-none"
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
          className={`relative z-10 inline-flex min-h-8 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors duration-200 ${itemWidthClass} ${
            index === activeIndex
              ? "text-[#18181B]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
