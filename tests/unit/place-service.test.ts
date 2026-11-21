import { describe, expect, it } from "vitest";
import { PlaceService } from "../../src/services/place-service.js";
import type { Place, PlaceFilters, PlaceInput } from "../../src/domain/types/place.js";
import { InMemoryRepository } from "../helpers/in-memory-repository.js";

function buildService() {
  const repo = new InMemoryRepository<Place, PlaceInput, PlaceFilters>();
  return { repo, service: new PlaceService(repo) };
}

const validPlace: PlaceInput = {
  categorySlug: "veterinarias",
  name: "Veterinaria de prueba",
  address: "Calle 49 Sur # 87-12",
  lat: 4.6112,
  lon: -74.1508,
  description: "Consulta veterinaria",
};

describe("PlaceService", () => {
  it("crea un lugar valido y asigna id", async () => {
    const { service } = buildService();
    const created = await service.create(validPlace);
    expect(created.id).toBeTruthy();
    expect(created.verified).toBe(false);
    expect(created.source).toBe("Registro ciudadano");
  });

  it("rechaza coordenadas fuera de Bogota", async () => {
    const { service } = buildService();
    await expect(service.create({ ...validPlace, lat: 40.4 })).rejects.toThrow(/lat/);
  });

  it("rechaza categorias que no son de lugares", async () => {
    const { service } = buildService();
    await expect(service.create({ ...validPlace, categorySlug: "seguridad" })).rejects.toThrow(
      /categorySlug/,
    );
  });

  it("actualiza sin perder campos y valida el resultado", async () => {
    const { service } = buildService();
    const created = await service.create(validPlace);
    const updated = await service.update(created.id, { name: "Huellitas Renombrada" });
    expect(updated.name).toBe("Huellitas Renombrada");
    expect(updated.address).toBe(validPlace.address);
  });

  it("lanza NotFound al consultar o borrar un id inexistente", async () => {
    const { service } = buildService();
    await expect(service.get("no-existe")).rejects.toThrow(/no existe/);
    await expect(service.remove("no-existe")).rejects.toThrow(/no existe/);
  });

  it("elimina un lugar existente", async () => {
    const { service } = buildService();
    const created = await service.create(validPlace);
    await service.remove(created.id);
    await expect(service.get(created.id)).rejects.toThrow(/no existe/);
  });
});
