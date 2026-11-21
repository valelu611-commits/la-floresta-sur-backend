import type { Database } from "../../../domain/ports/database.js";
import type {
  CadastralProperty,
  CadastralPropertyFilters,
  CadastralPropertyInput,
} from "../../../domain/types/cadastre.js";
import { SqlCrudRepository } from "../sql/sql-repository.js";
import type { Row, SqlFragment, TableSpec } from "../sql/table-spec.js";

const COLUMNS = [
  "id", "address", "upz", "barrio", "stratum", "land_use", "area_m2", "cadastral_ref",
  "lat", "lon", "notes", "source", "created_at", "updated_at",
] as const;

export const cadastralSpec: TableSpec<
  CadastralProperty,
  CadastralPropertyInput,
  CadastralPropertyFilters
> = {
  table: "cadastral_properties",
  columns: COLUMNS,
  searchColumns: ["address", "upz", "barrio", "cadastral_ref", "land_use"],
  orderBy: "address ASC",
  insertDefaults: { upz: "", barrio: "", notes: "", source: "" },
  toEntity(row: Row): CadastralProperty {
    return {
      id: String(row.id),
      address: String(row.address),
      upz: String(row.upz ?? ""),
      barrio: String(row.barrio ?? ""),
      stratum: Number(row.stratum ?? 0),
      landUse: String(row.land_use) as CadastralProperty["landUse"],
      areaM2: Number(row.area_m2 ?? 0),
      cadastralRef: String(row.cadastral_ref ?? ""),
      lat: Number(row.lat),
      lon: Number(row.lon),
      notes: String(row.notes ?? ""),
      source: String(row.source ?? ""),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  },
  toRow(input: Partial<CadastralPropertyInput>): Row {
    const row: Row = {};
    if (input.address !== undefined) row.address = input.address;
    if (input.upz !== undefined) row.upz = input.upz;
    if (input.barrio !== undefined) row.barrio = input.barrio;
    if (input.stratum !== undefined) row.stratum = input.stratum;
    if (input.landUse !== undefined) row.land_use = input.landUse;
    if (input.areaM2 !== undefined) row.area_m2 = input.areaM2;
    if (input.cadastralRef !== undefined) row.cadastral_ref = input.cadastralRef;
    if (input.lat !== undefined) row.lat = input.lat;
    if (input.lon !== undefined) row.lon = input.lon;
    if (input.notes !== undefined) row.notes = input.notes;
    if (input.source !== undefined) row.source = input.source;
    return row;
  },
  filterSql(filters: CadastralPropertyFilters): SqlFragment[] {
    const fragments: SqlFragment[] = [];
    if (filters.stratum !== undefined) fragments.push({ sql: "stratum = ?", params: [filters.stratum] });
    if (filters.landUse) fragments.push({ sql: "land_use = ?", params: [filters.landUse] });
    if (filters.upz) fragments.push({ sql: "upz = ?", params: [filters.upz] });
    return fragments;
  },
};

export class SqlCadastralRepository extends SqlCrudRepository<
  CadastralProperty,
  CadastralPropertyInput,
  CadastralPropertyFilters
> {
  constructor(db: Database) {
    super(db, cadastralSpec);
  }
}
