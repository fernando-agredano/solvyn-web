const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";

export function LeadAvatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 flex-none items-center justify-center rounded-full border border-[#E4E4E7] bg-[#F4F4F5] text-xs font-semibold text-[#18181B]"
    >
      {getInitials(name)}
    </span>
  );
}
