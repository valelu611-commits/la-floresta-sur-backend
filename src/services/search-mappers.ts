import { INCIDENT_KIND_LABELS } from "../domain/constants.js";
import type { CadastralProperty, Locality } from "../domain/types/cadastre.js";
import type { Place } from "../domain/types/place.js";
import type { RoadSegment, SecurityIncident } from "../domain/types/safety.js";
import type { SearchHit } from "./search-types.js";

export function placeHit(place: Place): SearchHit {
  return {
    id: place.id,
    resource: "places",
    title: place.name,
    subtitle: place.address,
    categorySlug: place.categorySlug,
    lat: place.lat,
    lon: place.lon,
    meta: { verified: place.verified ? "si" : "no", hours: place.hours },
  };
}

export function incidentHit(incident: SecurityIncident): SearchHit {
  return {
    id: incident.id,
    resource: "security-incidents",
    title: incident.title,
    subtitle: `${INCIDENT_KIND_LABELS[incident.kind] ?? incident.kind} · ${incident.occurredAt}`,
    categorySlug: "seguridad",
    lat: incident.lat,
    lon: incident.lon,
    meta: { severity: incident.severity, place: incident.placeHint },
  };
}

export function roadHit(road: RoadSegment): SearchHit {
  return {
    id: road.id,
    resource: "road-segments",
    title: road.name,
    subtitle: `${road.condition} · ${road.status}`,
    categorySlug: "malla-vial",
    lat: road.lat,
    lon: road.lon,
    meta: { lengthM: road.lengthM, reported: road.lastReportedAt },
  };
}

export function cadastralHit(property: CadastralProperty): SearchHit {
  return {
    id: property.id,
    resource: "cadastral-properties",
    title: property.address,
    subtitle: `Estrato ${property.stratum} · ${property.landUse}`,
    categorySlug: "catastral",
    lat: property.lat,
    lon: property.lon,
    meta: { areaM2: property.areaM2, ref: property.cadastralRef },
  };
}

export function localityHit(locality: Locality): SearchHit {
  return {
    id: locality.id,
    resource: "localities",
    title: locality.name,
    subtitle: locality.upz,
    categorySlug: "localidad",
    lat: locality.lat,
    lon: locality.lon,
    meta: { code: locality.code, population: locality.population },
  };
}
