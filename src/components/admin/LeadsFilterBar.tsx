import type { ReactNode } from "react";
import {
  hasActiveFilters,
  LEAD_LABELS,
  LEAD_SORTS,
  LEAD_STATUSES,
  type LeadsFilters,
} from "@/src/lib/admin/leads/filters";
import { LABEL_TEXT, STATUS_LABELS } from "@/src/lib/admin/leads/labels";
import { AdminButton } from "./AdminButton";
import { SearchIcon } from "./icons";
import { Select } from "./Select";
import { ADMIN_CONTROL_CLASSES, ADMIN_LABEL_CLASSES } from "./styles";

const SORT_TEXT = { fecha: "Más recientes", puntaje: "Mayor puntaje" } as const;

// A plain GET form: filters live in the URL, so they survive reloads and can be shared with yourself.
export function LeadsFilterBar({ filters }: { filters: LeadsFilters }) {
  return (
    <form
      action="/admin/leads"
      method="get"
      className="grid gap-3 p-4 min-[860px]:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto] min-[860px]:items-end"
    >
      <Field label="Buscar" htmlFor="lead-search">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#71717A]">
            <SearchIcon />
          </span>
          <input
            id="lead-search"
            name="q"
            type="search"
            placeholder="Nombre o correo"
            defaultValue={filters.q ?? ""}
            maxLength={100}
            className={`${ADMIN_CONTROL_CLASSES} pl-10`}
          />
        </div>
      </Field>

      <Field label="Estado" htmlFor="lead-status">
        <Select
          id="lead-status"
          name="estado"
          defaultValue={filters.estado ?? ""}
          options={[
            { value: "", label: "Todos" },
            ...LEAD_STATUSES.map((status) => ({
              value: status,
              label: STATUS_LABELS[status],
            })),
          ]}
        />
      </Field>

      <Field label="Etiqueta" htmlFor="lead-label">
        <Select
          id="lead-label"
          name="etiqueta"
          defaultValue={filters.etiqueta ?? ""}
          options={[
            { value: "", label: "Todas" },
            ...LEAD_LABELS.map((label) => ({
              value: label,
              label: LABEL_TEXT[label],
            })),
          ]}
        />
      </Field>

      <Field label="Ordenar por" htmlFor="lead-sort">
        <Select
          id="lead-sort"
          name="orden"
          defaultValue={filters.orden}
          options={LEAD_SORTS.map((sort) => ({
            value: sort,
            label: SORT_TEXT[sort],
          }))}
        />
      </Field>

      <div className="flex gap-2">
        <AdminButton type="submit">Filtrar</AdminButton>
        {hasActiveFilters(filters) && (
          <AdminButton href="/admin/leads" variant="secondary">
            Limpiar
          </AdminButton>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className={ADMIN_LABEL_CLASSES}>
        {label}
      </label>
      {children}
    </div>
  );
}
