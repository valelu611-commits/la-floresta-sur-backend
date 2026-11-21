import type { Database } from "../../../domain/ports/database.js";
import type { Place, PlaceFilters, PlaceInput } from "../../../domain/types/place.js";
import { SqlCrudRepository } from "../sql/sql-repository.js";
import type { Row, SqlFragment, TableSpec } from "../sql/table-spec.js";

const COLUMNS = [
  "id", "category_slug", "name", "description", "address", "lat", "lon", "phone",
  "website", "hours", "metadata", "source", "verified", "created_at", "updated_at",
] as const;

function parseMetadata(value: unknown): Record<string, unknown> {
  if (typeof value !== "string" || value.trim() === "") return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export const placeSpec: TableSpec<Place, PlaceInput, PlaceFilters> = {
  table: "places",
  columns: COLUMNS,
  searchColumns: ["name", "description", "address", "category_slug"],
  orderBy: "name ASC",
  insertDefaults: {
    description: "", phone: "", website: "", hours: "", metadata: "{}", source: "", verified: 0,
  },
  toEntity(row: Row): Place {
    return {
      id: String(row.id),
      categorySlug: String(row.category_slug),
      name: String(row.name),
      description: String(row.description ?? ""),
      address: String(row.address),
      lat: Number(row.lat),
      lon: Number(row.lon),
      phone: String(row.phone ?? ""),
      website: String(row.website ?? ""),
      hours: String(row.hours ?? ""),
      metadata: parseMetadata(row.metadata),
      source: String(row.source ?? ""),
      verified: Boolean(row.verified),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  },
  toRow(input: Partial<PlaceInput>): Row {
    const row: Row = {};
    if (input.categorySlug !== undefined) row.category_slug = input.categorySlug;
    if (input.name !== undefined) row.name = input.name;
    if (input.description !== undefined) row.description = input.description;
    if (input.address !== undefined) row.address = input.address;
    if (input.lat !== undefined) row.lat = input.lat;
    if (input.lon !== undefined) row.lon = input.lon;
    if (input.phone !== undefined) row.phone = input.phone;
    if (input.website !== undefined) row.website = input.website;
    if (input.hours !== undefined) row.hours = input.hours;
    if (input.metadata !== undefined) row.metadata = JSON.stringify(input.metadata);
    if (input.source !== undefined) row.source = input.source;
    if (input.verified !== undefined) row.verified = input.verified ? 1 : 0;
    return row;
  },
  filterSql(filters: PlaceFilters): SqlFragment[] {
    const fragments: SqlFragment[] = [];
    if (filters.category) fragments.push({ sql: "category_slug = ?", params: [filters.category] });
    if (filters.bbox) {
      fragments.push({
        sql: "lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?",
        params: [filters.bbox.minLat, filters.bbox.maxLat, filters.bbox.minLon, filters.bbox.maxLon],
      });
    }
    return fragments;
  },
};

export class SqlPlaceRepository extends SqlCrudRepository<Place, PlaceInput, PlaceFilters> {
  constructor(db: Database) {
    super(db, placeSpec);
  }
}
