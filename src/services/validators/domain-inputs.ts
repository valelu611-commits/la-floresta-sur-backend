import { ValidationError } from "../../domain/errors.js";
import {
  INCIDENT_KINDS,
  LAND_USES,
  ROAD_CONDITIONS,
  ROAD_STATUSES,
  SEVERITIES,
} from "../../domain/constants.js";
import {
  optionalText,
  requireBogotaCoords,
  requireNumber,
  requireOneOf,
  requireText,
} from "../../domain/validation.js";
import type {
  CadastralPropertyInput,
  LocalityInput,
} from "../../domain/types/cadastre.js";
import type {
  RoadSegmentInput,
  SecurityIncidentInput,
} from "../../domain/types/safety.js";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

export function validateIncidentCreate(input: SecurityIncidentInput): SecurityIncidentInput {
  if (!ISO_DATE.test(String(input.occurredAt))) {
    throw new ValidationError("occurredAt debe tener formato YYYY-MM-DD");
  }
  return {
    title: requireText(input.title, "title", 4, 180),
    kind: requireOneOf(input.kind, "kind", INCIDENT_KINDS),
    occurredAt: input.occurredAt,
    timeRange: optionalText(input.timeRange, "timeRange", 40),
    placeHint: requireText(input.placeHint, "placeHint", 3, 180),
    ...requireBogotaCoords(input.lat, input.lon),
    severity: requireOneOf(input.severity, "severity", SEVERITIES),
    weapon: optionalText(input.weapon, "weapon", 60),
    description: optionalText(input.description, "description", 2000),
    source: optionalText(input.source, "source", 240) || "Reporte ciudadano",
  };
}

export function validateRoadCreate(input: RoadSegmentInput): RoadSegmentInput {
  return {
    name: requireText(input.name, "name", 3, 160),
    fromStreet: optionalText(input.fromStreet, "fromStreet", 160),
    toStreet: optionalText(input.toStreet, "toStreet", 160),
    condition: requireOneOf(input.condition, "condition", ROAD_CONDITIONS),
    status: requireOneOf(input.status, "status", ROAD_STATUSES),
    lengthM: requireNumber(input.lengthM, "lengthM", 1, 50000),
    ...requireBogotaCoords(input.lat, input.lon),
    geomWkt: optionalText(input.geomWkt, "geomWkt", 2000),
    lastReportedAt: optionalText(input.lastReportedAt, "lastReportedAt", 32),
    description: optionalText(input.description, "description", 2000),
    source: optionalText(input.source, "source", 240) || "Reporte ciudadano",
  };
}

export function validateCadastralCreate(input: CadastralPropertyInput): CadastralPropertyInput {
  return {
    address: requireText(input.address, "address", 3, 240),
    upz: optionalText(input.upz, "upz", 60) || "UPZ 79 Caldas",
    barrio: optionalText(input.barrio, "barrio", 120) || "La Floresta Sur",
    stratum: requireNumber(input.stratum, "stratum", 1, 6),
    landUse: requireOneOf(input.landUse, "landUse", LAND_USES),
    areaM2: requireNumber(input.areaM2, "areaM2", 1, 500000),
    cadastralRef: requireText(input.cadastralRef, "cadastralRef", 4, 60),
    ...requireBogotaCoords(input.lat, input.lon),
    notes: optionalText(input.notes, "notes", 2000),
    source: optionalText(input.source, "source", 240) || "Datos de ejemplo",
  };
}

export function validateLocalityCreate(input: LocalityInput): LocalityInput {
  return {
    name: requireText(input.name, "name", 3, 160),
    code: requireText(input.code, "code", 1, 20),
    mayor: optionalText(input.mayor, "mayor", 160),
    population: requireNumber(input.population, "population", 0, 5000000),
    areaHa: requireNumber(input.areaHa, "areaHa", 1, 20000),
    upz: optionalText(input.upz, "upz", 120),
    description: optionalText(input.description, "description", 2000),
    ...requireBogotaCoords(input.lat, input.lon),
    bbox: optionalText(input.bbox, "bbox", 120),
    source: optionalText(input.source, "source", 240) || "Datos de ejemplo",
  };
}
