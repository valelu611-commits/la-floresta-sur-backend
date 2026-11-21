import type { BaseFilters } from "../domain/types/common.js";
import type { ReadRepository } from "../domain/ports/read-repository.js";
import type { CadastralProperty, CadastralPropertyFilters, Locality, LocalityFilters } from "../domain/types/cadastre.js";
import type { Place, PlaceFilters } from "../domain/types/place.js";
import type { RoadSegment, RoadSegmentFilters, SecurityIncident, SecurityIncidentFilters } from "../domain/types/safety.js";
import { cadastralHit, incidentHit, localityHit, placeHit, roadHit } from "./search-mappers.js";
import type { SearchHit, SearchResponse } from "./search-types.js";

export interface SearchRepositories {
  places: ReadRepository<Place, PlaceFilters>;
  incidents: ReadRepository<SecurityIncident, SecurityIncidentFilters>;
  roads: ReadRepository<RoadSegment, RoadSegmentFilters>;
  cadastral: ReadRepository<CadastralProperty, CadastralPropertyFilters>;
  localities: ReadRepository<Locality, LocalityFilters>;
}

function filters(query: string, limit: number): BaseFilters {
  return { q: query, limit, offset: 0 };
}

/** Busqueda transversal de las 13 categorias con hits uniformes. */
export class SearchService {
  constructor(private readonly repos: SearchRepositories) {}

  async search(query: string, limitPerSource = 8): Promise<SearchResponse> {
    const q = query.trim();
    if (q === "") return { query: q, total: 0, hits: [], countsByCategory: {} };
    const filter = filters(q, limitPerSource);

    const [places, incidents, roads, cadastral, localities] = await Promise.all([
      this.repos.places.list(filter),
      this.repos.incidents.list(filter),
      this.repos.roads.list(filter),
      this.repos.cadastral.list(filter),
      this.repos.localities.list(filter),
    ]);

    const hits: SearchHit[] = [
      ...places.items.map(placeHit),
      ...incidents.items.map(incidentHit),
      ...roads.items.map(roadHit),
      ...cadastral.items.map(cadastralHit),
      ...localities.items.map(localityHit),
    ];

    const countsByCategory: Record<string, number> = {};
    for (const hit of hits) {
      countsByCategory[hit.categorySlug] = (countsByCategory[hit.categorySlug] ?? 0) + 1;
    }

    return { query: q, total: hits.length, hits, countsByCategory };
  }
}
