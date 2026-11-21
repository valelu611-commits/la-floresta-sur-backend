import type { ReadRepository } from "../domain/ports/read-repository.js";
import type { BaseFilters } from "../domain/types/common.js";
import type { CadastralProperty, CadastralPropertyFilters, Locality, LocalityFilters } from "../domain/types/cadastre.js";
import type { Category, CategoryFilters, Place, PlaceFilters } from "../domain/types/place.js";
import type { RoadSegment, RoadSegmentFilters, SecurityIncident, SecurityIncidentFilters } from "../domain/types/safety.js";
import type { SearchHit } from "../services/search-types.js";
import { cadastralHit, incidentHit, localityHit, placeHit, roadHit } from "../services/search-mappers.js";

export interface AgentRepositories {
  categories: ReadRepository<Category, CategoryFilters>;
  places: ReadRepository<Place, PlaceFilters>;
  incidents: ReadRepository<SecurityIncident, SecurityIncidentFilters>;
  roads: ReadRepository<RoadSegment, RoadSegmentFilters>;
  cadastral: ReadRepository<CadastralProperty, CadastralPropertyFilters>;
  localities: ReadRepository<Locality, LocalityFilters>;
}

const PAGE: BaseFilters = { limit: 5, offset: 0 };

/** Carga los registros de una categoria para responder con datos reales. */
export async function loadCategoryHits(
  repos: AgentRepositories,
  slug: string,
): Promise<SearchHit[]> {
  switch (slug) {
    case "seguridad":
      return (await repos.incidents.list(PAGE)).items.map(incidentHit);
    case "malla-vial":
      return (await repos.roads.list(PAGE)).items.map(roadHit);
    case "catastral":
      return (await repos.cadastral.list(PAGE)).items.map(cadastralHit);
    case "localidad":
      return (await repos.localities.list(PAGE)).items.map(localityHit);
    default:
      return (await repos.places.list({ ...PAGE, category: slug })).items.map(placeHit);
  }
}
