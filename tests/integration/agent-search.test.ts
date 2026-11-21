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

describe("buscador y agente", () => {
  it("busca transversalmente en varias categorias", async () => {
    const results = await ctx.search.search("veterinaria");
    expect(results.total).toBeGreaterThan(0);
    expect(results.hits[0]?.resource).toBe("places");
    expect(results.countsByCategory.veterinarias).toBeGreaterThan(0);
  });

  it("devuelve vacio si la consulta esta en blanco", async () => {
    const results = await ctx.search.search("   ");
    expect(results.total).toBe(0);
  });

  it("responde preguntas por categoria con datos reales", async () => {
    const answer = await ctx.agent.ask("donde hay veterinarias en el barrio");
    expect(answer.intents).toContain("veterinarias");
    expect(answer.generatedBy).toBe("rules");
    expect(answer.answer).toMatch(/veterinaria/i);
    expect(answer.groups[0]?.items.length).toBeGreaterThan(0);
    expect(answer.suggestions.length).toBeGreaterThan(0);
  });

  it("cruza categorias en una sola pregunta", async () => {
    const answer = await ctx.agent.ask("hay robos y camaras de seguridad cerca");
    expect(answer.intents).toEqual(expect.arrayContaining(["seguridad", "camaras"]));
    expect(answer.groups.length).toBeGreaterThanOrEqual(2);
  });

  it("responde con busqueda libre cuando no detecta categoria", async () => {
    const answer = await ctx.agent.ask("panaderia");
    expect(answer.groups.length).toBeGreaterThan(0);
    expect(answer.answer).toContain("Panaderia");
  });

  it("rechaza preguntas demasiado cortas", async () => {
    await expect(ctx.agent.ask("ok")).rejects.toThrow(/corta/);
  });
});
