import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AppContext } from "../../src/composition.js";
import { createTestContext } from "../helpers/test-context.js";

let ctx: AppContext;

beforeAll(async () => {
  ctx = await createTestContext();
});

afterAll(async () => {
  if (ctx) await ctx.db.close();
});

describe("semillas y filtros", () => {
  it("carga las 13 categorias y mas de 50 registros", async () => {
    const stats = await ctx.stats.getStats();
    expect(stats.categories).toHaveLength(13);
    expect(stats.totalRecords).toBeGreaterThan(50);
  });

  it("filtra lugares por categoria y caja geografica", async () => {
    const vets = await ctx.places.list({ limit: 10, offset: 0, category: "veterinarias" });
    expect(vets.items.length).toBeGreaterThanOrEqual(3);
    expect(vets.items.every((item) => item.categorySlug === "veterinarias")).toBe(true);

    const bbox = await ctx.places.list({
      limit: 50,
      offset: 0,
      bbox: { minLat: 4.61, maxLat: 4.62, minLon: -74.155, maxLon: -74.145 },
    });
    expect(bbox.items.every((item) => item.lat >= 4.61 && item.lat <= 4.62)).toBe(true);
  });

  it("filtra incidentes, vias, predios y localidades", async () => {
    const incidents = await ctx.incidents.list({ limit: 20, offset: 0, severity: "alta" });
    expect(incidents.items.every((item) => item.severity === "alta")).toBe(true);

    const roads = await ctx.roads.list({ limit: 5, offset: 0, condition: "deteriorado" });
    expect(roads.total).toBeGreaterThan(0);

    const cadastral = await ctx.cadastral.list({ limit: 5, offset: 0, landUse: "comercial" });
    expect(cadastral.items.every((item) => item.landUse === "comercial")).toBe(true);

    const localities = await ctx.localities.list({ limit: 5, offset: 0 });
    expect(localities.total).toBe(2);
  });

  it("pagina resultados sin duplicados", async () => {
    const page1 = await ctx.places.list({ limit: 5, offset: 0 });
    const page2 = await ctx.places.list({ limit: 5, offset: 5 });
    const ids = new Set([...page1.items, ...page2.items].map((item) => item.id));
    expect(page1.items).toHaveLength(5);
    expect(ids.size).toBe(10);
  });
});
