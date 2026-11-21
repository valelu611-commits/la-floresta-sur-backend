import type { ReadRepository } from "../domain/ports/read-repository.js";
import type { CadastralProperty, CadastralPropertyFilters, Locality, LocalityFilters } from "../domain/types/cadastre.js";
import type { Category, CategoryFilters, Place, PlaceFilters } from "../domain/types/place.js";
import type { RoadSegment, RoadSegmentFilters, SecurityIncident, SecurityIncidentFilters } from "../domain/types/safety.js";

export interface StatsResponse {
  barrio: string;
  center: { lat: number; lon: number };
  totalRecords: number;
  categories: Array<{
    slug: string;
    name: string;
    color: string;
    icon: string;
    resource: string;
    count: number;
  }>;
}

export interface StatsRepositories {
  categories: ReadRepository<Category, CategoryFilters>;
  places: ReadRepository<Place, PlaceFilters>;
  incidents: ReadRepository<SecurityIncident, SecurityIncidentFilters>;
  roads: ReadRepository<RoadSegment, RoadSegmentFilters>;
  cadastral: ReadRepository<CadastralProperty, CadastralPropertyFilters>;
  localities: ReadRepository<Locality, LocalityFilters>;
}

/** Conteos por categoria para la portada, los filtros y el agente. */
export class StatsService {
  constructor(private readonly repos: StatsRepositories) {}

  async getStats(): Promise<StatsResponse> {
    const categories = await this.repos.categories.list({ limit: 50, offset: 0 });
    const withCounts = await Promise.all(
      categories.items.map(async (category) => ({
        slug: category.slug,
        name: category.name,
        color: category.color,
        icon: category.icon,
        resource: category.resource,
        count: await this.countCategory(category.slug),
      })),
    );

    return {
      barrio: "La Floresta Sur",
      center: { lat: 4.6112, lon: -74.1508 },
      totalRecords: withCounts.reduce((sum, item) => sum + item.count, 0),
      categories: withCounts,
    };
  }

  private async countCategory(slug: string): Promise<number> {
    const filter = { limit: 1, offset: 0 };
    switch (slug) {
      case "seguridad":
        return (await this.repos.incidents.list(filter)).total;
      case "malla-vial":
        return (await this.repos.roads.list(filter)).total;
      case "catastral":
        return (await this.repos.cadastral.list(filter)).total;
      case "localidad":
        return (await this.repos.localities.list(filter)).total;
      default:
        return (await this.repos.places.list({ ...filter, category: slug })).total;
    }
  }
}
