import type { CategoryResource } from "../domain/types/place.js";

/** Proyeccion uniforme para buscador, mapa, listados y agente. */
export interface SearchHit {
  id: string;
  resource: CategoryResource;
  title: string;
  subtitle: string;
  categorySlug: string;
  lat: number;
  lon: number;
  meta?: Record<string, string | number>;
}

export interface SearchResponse {
  query: string;
  total: number;
  hits: SearchHit[];
  countsByCategory: Record<string, number>;
}

export type { CategoryResource };
