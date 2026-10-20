import { describe, expect, it } from "vitest";
import { buildLeadsHref, parseLeadsFilters, sanitizeSearch } from "./filters";

describe("parseLeadsFilters", () => {
  it("uses safe defaults when nothing is given", () => {
    expect(parseLeadsFilters({})).toEqual({
      estado: undefined,
      etiqueta: undefined,
      q: undefined,
      orden: "fecha",
      pagina: 1,
    });
  });

  it("ignores invalid values instead of failing", () => {
    const filters = parseLeadsFilters({
      estado: "borrado",
      etiqueta: "hirviendo",
      orden: "nombre",
      pagina: "-4",
    });
    expect(filters).toMatchObject({
      estado: undefined,
      etiqueta: undefined,
      orden: "fecha",
      pagina: 1,
    });
  });

  it("keeps the first value when a key repeats", () => {
    expect(parseLeadsFilters({ estado: ["nuevo", "cerrado"] }).estado).toBe(
      "nuevo",
    );
  });

  it("accepts a valid page and sort", () => {
    expect(parseLeadsFilters({ pagina: "3", orden: "puntaje" })).toMatchObject({
      pagina: 3,
      orden: "puntaje",
    });
  });
});

describe("sanitizeSearch", () => {
  it("removes characters that change the PostgREST filter", () => {
    expect(sanitizeSearch("ana,correo.eq.x)(")).toBe("ana correo.eq.x");
  });

  it("keeps names and emails readable", () => {
    expect(sanitizeSearch("  María  José  ")).toBe("María José");
    expect(sanitizeSearch("ana+test@mail.mx")).toBe("ana+test@mail.mx");
  });
});

describe("buildLeadsHref", () => {
  it("omits defaults so the URL stays short", () => {
    expect(buildLeadsHref({ orden: "fecha", pagina: 1 })).toBe("/admin/leads");
  });

  it("keeps the filters when changing page", () => {
    expect(
      buildLeadsHref({
        estado: "nuevo",
        etiqueta: "caliente",
        q: "ana",
        orden: "puntaje",
        pagina: 2,
      }),
    ).toBe(
      "/admin/leads?estado=nuevo&etiqueta=caliente&q=ana&orden=puntaje&pagina=2",
    );
  });
});
