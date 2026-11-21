import type { BaseEntity, BaseFilters } from "./common.js";

export type Severity = "baja" | "media" | "alta";

export interface SecurityIncident extends BaseEntity {
  title: string;
  kind: string;
  occurredAt: string;
  timeRange: string;
  placeHint: string;
  lat: number;
  lon: number;
  severity: Severity;
  weapon: string;
  description: string;
  source: string;
}

export type SecurityIncidentInput = Omit<SecurityIncident, keyof BaseEntity>;

export interface SecurityIncidentFilters extends BaseFilters {
  kind?: string;
  severity?: Severity;
  from?: string;
  to?: string;
}

export type RoadCondition = "bueno" | "regular" | "deteriorado";
export type RoadStatus = "transitable" | "obras" | "cerrada";

export interface RoadSegment extends BaseEntity {
  name: string;
  fromStreet: string;
  toStreet: string;
  condition: RoadCondition;
  status: RoadStatus;
  lengthM: number;
  lat: number;
  lon: number;
  geomWkt: string;
  lastReportedAt: string;
  description: string;
  source: string;
}

export type RoadSegmentInput = Omit<RoadSegment, keyof BaseEntity>;

export interface RoadSegmentFilters extends BaseFilters {
  condition?: RoadCondition;
  status?: RoadStatus;
}
