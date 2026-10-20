import Link from "next/link";
import {
  buildLeadsHref,
  type LeadsFilters,
} from "@/src/lib/admin/leads/filters";

const LINK_CLASSES =
  "inline-flex min-h-11 items-center rounded-[10px] border border-white/22 px-4 text-[15px] text-foreground no-underline transition duration-200 hover:border-white/50 hover:bg-white/[0.04]";
const DISABLED_CLASSES =
  "inline-flex min-h-11 items-center rounded-[10px] border border-white/8 px-4 text-[15px] text-muted";

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
      <p className="m-0 text-sm text-label">
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
