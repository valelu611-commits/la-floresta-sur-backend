import type { PlaceInput } from "../domain/types/place.js";

/** Constructor corto para semillas legibles (cada registro en una linea). */
export function place(
  categorySlug: string,
  name: string,
  address: string,
  lat: number,
  lon: number,
  description: string,
  extra: Partial<PlaceInput> = {},
): PlaceInput {
  return {
    categorySlug,
    name,
    address,
    lat,
    lon,
    description,
    source: "Datos de ejemplo generados para la demo",
    verified: true,
    ...extra,
  };
}
