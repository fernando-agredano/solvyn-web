type SectionHeadingProps = {
  title: string;
  description: string;
  className?: string;
};

export function SectionHeading({ title, description, className = "" }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h2 className="semi m-0 text-[clamp(2rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      <p className="m-0 text-lg leading-[1.6] text-text-secondary">{description}</p>
    </div>
  );
}
