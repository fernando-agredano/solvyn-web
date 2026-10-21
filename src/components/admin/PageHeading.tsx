// The page title as a badge, with optional tags next to it: titles never float on the page background.
export function PageHeading({
  title,
  tags = [],
}: {
  title: string;
  tags?: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <h1 className="m-0 inline-flex items-center rounded-full bg-[#18181B] px-3 py-1 text-xs font-semibold tracking-wide text-white">
        {title}
      </h1>
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs text-[#52525B]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
