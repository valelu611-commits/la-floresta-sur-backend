import type { Database } from "../../../domain/ports/database.js";
import type {
  SecurityIncident,
  SecurityIncidentFilters,
  SecurityIncidentInput,
} from "../../../domain/types/safety.js";
import { SqlCrudRepository } from "../sql/sql-repository.js";
import type { Row, SqlFragment, TableSpec } from "../sql/table-spec.js";

const COLUMNS = [
  "id", "title", "kind", "occurred_at", "time_range", "place_hint", "lat", "lon",
  "severity", "weapon", "description", "source", "created_at", "updated_at",
] as const;

export const incidentSpec: TableSpec<
  SecurityIncident,
  SecurityIncidentInput,
  SecurityIncidentFilters
> = {
  table: "security_incidents",
  columns: COLUMNS,
  searchColumns: ["title", "kind", "place_hint", "description"],
  orderBy: "occurred_at DESC",
  insertDefaults: { time_range: "", weapon: "", description: "", source: "" },
  toEntity(row: Row): SecurityIncident {
    return {
      id: String(row.id),
      title: String(row.title),
      kind: String(row.kind),
      occurredAt: String(row.occurred_at),
      timeRange: String(row.time_range ?? ""),
      placeHint: String(row.place_hint ?? ""),
      lat: Number(row.lat),
      lon: Number(row.lon),
      severity: String(row.severity) as SecurityIncident["severity"],
      weapon: String(row.weapon ?? ""),
      description: String(row.description ?? ""),
      source: String(row.source ?? ""),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  },
  toRow(input: Partial<SecurityIncidentInput>): Row {
    const row: Row = {};
    if (input.title !== undefined) row.title = input.title;
    if (input.kind !== undefined) row.kind = input.kind;
    if (input.occurredAt !== undefined) row.occurred_at = input.occurredAt;
    if (input.timeRange !== undefined) row.time_range = input.timeRange;
    if (input.placeHint !== undefined) row.place_hint = input.placeHint;
    if (input.lat !== undefined) row.lat = input.lat;
    if (input.lon !== undefined) row.lon = input.lon;
    if (input.severity !== undefined) row.severity = input.severity;
    if (input.weapon !== undefined) row.weapon = input.weapon;
    if (input.description !== undefined) row.description = input.description;
    if (input.source !== undefined) row.source = input.source;
    return row;
  },
  filterSql(filters: SecurityIncidentFilters): SqlFragment[] {
    const fragments: SqlFragment[] = [];
    if (filters.kind) fragments.push({ sql: "kind = ?", params: [filters.kind] });
    if (filters.severity) fragments.push({ sql: "severity = ?", params: [filters.severity] });
    if (filters.from) fragments.push({ sql: "occurred_at >= ?", params: [filters.from] });
    if (filters.to) fragments.push({ sql: "occurred_at <= ?", params: [filters.to] });
    if (filters.bbox) {
      fragments.push({
        sql: "lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?",
        params: [filters.bbox.minLat, filters.bbox.maxLat, filters.bbox.minLon, filters.bbox.maxLon],
      });
    }
    return fragments;
  },
};

export class SqlIncidentRepository extends SqlCrudRepository<
  SecurityIncident,
  SecurityIncidentInput,
  SecurityIncidentFilters
> {
  constructor(db: Database) {
    super(db, incidentSpec);
  }
}
