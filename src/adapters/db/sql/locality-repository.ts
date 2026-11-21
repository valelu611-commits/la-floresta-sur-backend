import type { Database } from "../../../domain/ports/database.js";
import type {
  Locality,
  LocalityFilters,
  LocalityInput,
} from "../../../domain/types/cadastre.js";
import { SqlCrudRepository } from "../sql/sql-repository.js";
import type { Row, SqlFragment, TableSpec } from "../sql/table-spec.js";

const COLUMNS = [
  "id", "name", "code", "mayor", "population", "area_ha", "upz", "description",
  "lat", "lon", "bbox", "source", "created_at", "updated_at",
] as const;

export const localitySpec: TableSpec<Locality, LocalityInput, LocalityFilters> = {
  table: "localities",
  columns: COLUMNS,
  searchColumns: ["name", "code", "upz", "description"],
  orderBy: "name ASC",
  insertDefaults: { mayor: "", upz: "", description: "", bbox: "", source: "" },
  toEntity(row: Row): Locality {
    return {
      id: String(row.id),
      name: String(row.name),
      code: String(row.code ?? ""),
      mayor: String(row.mayor ?? ""),
      population: Number(row.population ?? 0),
      areaHa: Number(row.area_ha ?? 0),
      upz: String(row.upz ?? ""),
      description: String(row.description ?? ""),
      lat: Number(row.lat),
      lon: Number(row.lon),
      bbox: String(row.bbox ?? ""),
      source: String(row.source ?? ""),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  },
  toRow(input: Partial<LocalityInput>): Row {
    const row: Row = {};
    if (input.name !== undefined) row.name = input.name;
    if (input.code !== undefined) row.code = input.code;
    if (input.mayor !== undefined) row.mayor = input.mayor;
    if (input.population !== undefined) row.population = input.population;
    if (input.areaHa !== undefined) row.area_ha = input.areaHa;
    if (input.upz !== undefined) row.upz = input.upz;
    if (input.description !== undefined) row.description = input.description;
    if (input.lat !== undefined) row.lat = input.lat;
    if (input.lon !== undefined) row.lon = input.lon;
    if (input.bbox !== undefined) row.bbox = input.bbox;
    if (input.source !== undefined) row.source = input.source;
    return row;
  },
  filterSql(filters: LocalityFilters): SqlFragment[] {
    const fragments: SqlFragment[] = [];
    if (filters.code) fragments.push({ sql: "code = ?", params: [filters.code] });
    return fragments;
  },
};

export class SqlLocalityRepository extends SqlCrudRepository<
  Locality,
  LocalityInput,
  LocalityFilters
> {
  constructor(db: Database) {
    super(db, localitySpec);
  }
}
