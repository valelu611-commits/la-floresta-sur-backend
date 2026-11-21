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

describe("CRUD de lugares sobre SQLite", () => {
  it("crea, lee, actualiza y borra un lugar", async () => {
    const created = await ctx.places.create({
      categorySlug: "comida",
      name: "Tamaleria de prueba",
      address: "Calle 50 Sur # 87-99",
      lat: 4.6118,
      lon: -74.1502,
    });
    expect(created.id).toBeTruthy();

    const updated = await ctx.places.update(created.id, { hours: "Lun-Sab 6:00-14:00" });
    expect(updated.hours).toBe("Lun-Sab 6:00-14:00");

    const found = await ctx.places.get(created.id);
    expect(found.name).toBe("Tamaleria de prueba");

    await ctx.places.remove(created.id);
    await expect(ctx.places.get(created.id)).rejects.toThrow(/no existe/);
  });

  it("valida la entrada antes de escribir", async () => {
    await expect(
      ctx.places.create({ categorySlug: "cai", name: "X", address: "", lat: 4.6, lon: -74.1 }),
    ).rejects.toThrow(/name|address/);
  });

  it("CRUD de incidentes con validacion de fecha y severidad", async () => {
    const incident = await ctx.incidents.create({
      title: "Prueba de hurto",
      kind: "hurto_persona",
      occurredAt: "2026-11-01",
      timeRange: "20:00-21:00",
      placeHint: "Parque principal",
      lat: 4.6113,
      lon: -74.151,
      severity: "media",
      weapon: "sin arma",
      description: "Caso de prueba",
      source: "test",
    });
    expect(incident.id).toBeTruthy();
    await ctx.incidents.remove(incident.id);
    await expect(ctx.incidents.get(incident.id)).rejects.toThrow(/no existe/);

    await expect(
      ctx.incidents.create({
        title: "Prueba con fecha invalida",
        kind: "hurto_persona",
        occurredAt: "ayer",
        timeRange: "20:00-21:00",
        placeHint: "Parque principal",
        lat: 4.6113,
        lon: -74.151,
        severity: "media",
        weapon: "sin arma",
        description: "Caso de prueba",
        source: "test",
      }),
    ).rejects.toThrow(/occurredAt/);
  });
});
