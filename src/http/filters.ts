import type { ParsedQs } from "qs";
import type { BaseFilters } from "../domain/types/common.js";
import type {
  CadastralPropertyFilters,
  LandUse,
  LocalityFilters,
} from "../domain/types/cadastre.js";
import type { PlaceFilters } from "../domain/types/place.js";
import type {
  RoadCondition,
  RoadSegmentFilters,
  RoadStatus,
  SecurityIncidentFilters,
  Severity,
} from "../domain/types/safety.js";
import { normalizeLimit, normalizeOffset, parseBBox } from "../domain/validation.js";

type Query = ParsedQs | Record<string, unknown>;

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function num(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function common(query: Query): BaseFilters {
  return {
    q: text(query.q),
    limit: normalizeLimit(query.limit),
    offset: normalizeOffset(query.offset),
    bbox: parseBBox(query.bbox),
  };
}

export function parsePlaceFilters(query: Query): PlaceFilters {
  return { ...common(query), category: text(query.category) };
}

export function parseIncidentFilters(query: Query): SecurityIncidentFilters {
  return {
    ...common(query),
    kind: text(query.kind),
    severity: text(query.severity) as Severity | undefined,
    from: text(query.from),
    to: text(query.to),
  };
}

export function parseRoadFilters(query: Query): RoadSegmentFilters {
  return {
    ...common(query),
    condition: text(query.condition) as RoadCondition | undefined,
    status: text(query.status) as RoadStatus | undefined,
  };
}

export function parseCadastralFilters(query: Query): CadastralPropertyFilters {
  return {
    ...common(query),
    stratum: num(query.stratum),
    landUse: text(query.landUse) as LandUse | undefined,
    upz: text(query.upz),
  };
}

export function parseLocalityFilters(query: Query): LocalityFilters {
  return { ...common(query), code: text(query.code) };
}
