import type { Database } from "../../../domain/ports/database.js";
import type {
  RoadSegment,
  RoadSegmentFilters,
  RoadSegmentInput,
} from "../../../domain/types/safety.js";
import { SqlCrudRepository } from "../sql/sql-repository.js";
import type { Row, SqlFragment, TableSpec } from "../sql/table-spec.js";

const COLUMNS = [
  "id", "name", "from_street", "to_street", "condition", "status", "length_m", "lat", "lon",
  "geom_wkt", "last_reported_at", "description", "source", "created_at", "updated_at",
] as const;

export const roadSpec: TableSpec<RoadSegment, RoadSegmentInput, RoadSegmentFilters> = {
  table: "road_segments",
  columns: COLUMNS,
  searchColumns: ["name", "from_street", "to_street", "description"],
  orderBy: "name ASC",
  insertDefaults: { from_street: "", to_street: "", geom_wkt: "", last_reported_at: "", description: "", source: "" },
  toEntity(row: Row): RoadSegment {
    return {
      id: String(row.id),
      name: String(row.name),
      fromStreet: String(row.from_street ?? ""),
      toStreet: String(row.to_street ?? ""),
      condition: String(row.condition) as RoadSegment["condition"],
      status: String(row.status) as RoadSegment["status"],
      lengthM: Number(row.length_m ?? 0),
      lat: Number(row.lat),
      lon: Number(row.lon),
      geomWkt: String(row.geom_wkt ?? ""),
      lastReportedAt: String(row.last_reported_at ?? ""),
      description: String(row.description ?? ""),
      source: String(row.source ?? ""),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  },
  toRow(input: Partial<RoadSegmentInput>): Row {
    const row: Row = {};
    if (input.name !== undefined) row.name = input.name;
    if (input.fromStreet !== undefined) row.from_street = input.fromStreet;
    if (input.toStreet !== undefined) row.to_street = input.toStreet;
    if (input.condition !== undefined) row.condition = input.condition;
    if (input.status !== undefined) row.status = input.status;
    if (input.lengthM !== undefined) row.length_m = input.lengthM;
    if (input.lat !== undefined) row.lat = input.lat;
    if (input.lon !== undefined) row.lon = input.lon;
    if (input.geomWkt !== undefined) row.geom_wkt = input.geomWkt;
    if (input.lastReportedAt !== undefined) row.last_reported_at = input.lastReportedAt;
    if (input.description !== undefined) row.description = input.description;
    if (input.source !== undefined) row.source = input.source;
    return row;
  },
  filterSql(filters: RoadSegmentFilters): SqlFragment[] {
    const fragments: SqlFragment[] = [];
    if (filters.condition) fragments.push({ sql: "condition = ?", params: [filters.condition] });
    if (filters.status) fragments.push({ sql: "status = ?", params: [filters.status] });
    if (filters.bbox) {
      fragments.push({
        sql: "lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?",
        params: [filters.bbox.minLat, filters.bbox.maxLat, filters.bbox.minLon, filters.bbox.maxLon],
      });
    }
    return fragments;
  },
};

export class SqlRoadRepository extends SqlCrudRepository<
  RoadSegment,
  RoadSegmentInput,
  RoadSegmentFilters
> {
  constructor(db: Database) {
    super(db, roadSpec);
  }
}
