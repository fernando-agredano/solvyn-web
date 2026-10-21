type SectionHeadingProps = {
  title: string;
  description: string;
  className?: string;
};

// Centered, for every section of the landing. Width and margin are fixed here, callers only add spacing.
export function SectionHeading({
  title,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mx-auto flex max-w-[680px] flex-col items-center gap-3 text-center ${className}`}
    >
      <h2 className="m-0 text-balance text-[clamp(1.625rem,2.6vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      <p className="m-0 text-base leading-[1.6] text-text-secondary">
        {description}
      </p>
    </div>
  );
}
