import Link from "next/link";
import {
  buildLeadsHref,
  type LeadsFilters,
} from "@/src/lib/admin/leads/filters";

const LINK_CLASSES =
  "inline-flex min-h-10 items-center rounded-lg border border-[#D4D4D8] bg-white px-4 text-sm font-medium text-[#18181B] no-underline transition-colors duration-150 hover:bg-[#F4F4F5]";
const DISABLED_CLASSES =
  "inline-flex min-h-10 items-center rounded-lg border border-[#E4E4E7] px-4 text-sm text-[#A1A1AA]";

interface PaginationProps {
  filters: LeadsFilters;
  pageCount: number;
}

export function Pagination({ filters, pageCount }: PaginationProps) {
  const current = Math.min(filters.pagina, pageCount);
  const hasPrevious = current > 1;
  const hasNext = current < pageCount;

  return (
    <nav
      aria-label="Paginación de leads"
      className="flex items-center justify-between gap-4"
    >
      {hasPrevious ? (
        <Link
          href={buildLeadsHref({ ...filters, pagina: current - 1 })}
          className={LINK_CLASSES}
          rel="prev"
        >
          Anterior
        </Link>
      ) : (
        <span aria-disabled="true" className={DISABLED_CLASSES}>
          Anterior
        </span>
      )}
      <p className="m-0 text-xs text-[#71717A]">
        Página {current} de {pageCount}
      </p>
      {hasNext ? (
        <Link
          href={buildLeadsHref({ ...filters, pagina: current + 1 })}
          className={LINK_CLASSES}
          rel="next"
        >
          Siguiente
        </Link>
      ) : (
        <span aria-disabled="true" className={DISABLED_CLASSES}>
          Siguiente
        </span>
      )}
    </nav>
  );
}
