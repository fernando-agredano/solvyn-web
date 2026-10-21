import {
  LEAD_LABELS,
  LEAD_SORTS,
  LEAD_STATUSES,
  type LeadsFilters,
} from "@/src/lib/admin/leads/filters";
import { LABEL_TEXT, STATUS_LABELS } from "@/src/lib/admin/leads/labels";
import { ADMIN_CONTROL_CLASSES, ADMIN_LABEL_CLASSES } from "./styles";

const SORT_TEXT = { fecha: "Más recientes", puntaje: "Mayor puntaje" } as const;

// A plain GET form: filters live in the URL, so they survive reloads and can be shared with yourself.
export function LeadsFilterBar({ filters }: { filters: LeadsFilters }) {
  return (
    <form
      action="/admin/leads"
      method="get"
      className="grid gap-3 min-[860px]:grid-cols-[2fr_1fr_1fr_1fr_auto] min-[860px]:items-end"
    >
      <label className={`flex flex-col gap-1.5 ${ADMIN_LABEL_CLASSES}`}>
        Buscar por nombre o correo
        <input
          name="q"
          type="search"
          defaultValue={filters.q ?? ""}
          maxLength={100}
          className={ADMIN_CONTROL_CLASSES}
        />
      </label>
      <label className={`flex flex-col gap-1.5 ${ADMIN_LABEL_CLASSES}`}>
        Estado
        <select
          name="estado"
          defaultValue={filters.estado ?? ""}
          className={ADMIN_CONTROL_CLASSES}
        >
          <option value="">Todos</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
      <label className={`flex flex-col gap-1.5 ${ADMIN_LABEL_CLASSES}`}>
        Etiqueta
        <select
          name="etiqueta"
          defaultValue={filters.etiqueta ?? ""}
          className={ADMIN_CONTROL_CLASSES}
        >
          <option value="">Todas</option>
          {LEAD_LABELS.map((label) => (
            <option key={label} value={label}>
              {LABEL_TEXT[label]}
            </option>
          ))}
        </select>
      </label>
      <label className={`flex flex-col gap-1.5 ${ADMIN_LABEL_CLASSES}`}>
        Ordenar por
        <select
          name="orden"
          defaultValue={filters.orden}
          className={ADMIN_CONTROL_CLASSES}
        >
          {LEAD_SORTS.map((sort) => (
            <option key={sort} value={sort}>
              {SORT_TEXT[sort]}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-[#18181B] px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#27272A]"
      >
        Filtrar
      </button>
    </form>
  );
}
