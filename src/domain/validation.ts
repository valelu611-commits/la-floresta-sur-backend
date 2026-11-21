import { ValidationError } from "./errors.js";
import type { BBox } from "./types/common.js";

export const BOGOTA_BBOX: BBox = { minLat: 4.45, maxLat: 4.84, minLon: -74.25, maxLon: -74.0 };
export const BARRIO_CENTER = { lat: 4.6112, lon: -74.1508 };
export const BARRIO_BBOX: BBox = { minLat: 4.598, maxLat: 4.625, minLon: -74.166, maxLon: -74.138 };

export function requireText(value: unknown, field: string, min = 1, max = 600): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} es obligatorio`);
  }
  const text = value.trim();
  if (text.length < min || text.length > max) {
    throw new ValidationError(`${field} debe tener entre ${min} y ${max} caracteres`);
  }
  return text;
}

export function optionalText(value: unknown, field: string, max = 2000): string {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") throw new ValidationError(`${field} debe ser texto`);
  const text = value.trim();
  if (text.length > max) throw new ValidationError(`${field} supera ${max} caracteres`);
  return text;
}

export function requireNumber(
  value: unknown,
  field: string,
  min: number,
  max: number,
): number {
  const num = typeof value === "string" ? Number(value.replace(",", ".")) : value;
  if (typeof num !== "number" || !Number.isFinite(num)) {
    throw new ValidationError(`${field} debe ser numerico`);
  }
  if (num < min || num > max) {
    throw new ValidationError(`${field} debe estar entre ${min} y ${max}`);
  }
  return num;
}

export function requireOneOf<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new ValidationError(`${field} debe ser uno de: ${allowed.join(", ")}`);
  }
  return value as T;
}

export function requireBogotaCoords(lat: unknown, lon: unknown): { lat: number; lon: number } {
  const latitude = requireNumber(lat, "lat", BOGOTA_BBOX.minLat, BOGOTA_BBOX.maxLat);
  const longitude = requireNumber(lon, "lon", BOGOTA_BBOX.minLon, BOGOTA_BBOX.maxLon);
  return { lat: latitude, lon: longitude };
}

export function normalizeLimit(value: unknown, fallback = 20, max = 100): number {
  const num = Number(value ?? fallback);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(Math.max(Math.trunc(num), 1), max);
}

export function normalizeOffset(value: unknown): number {
  const num = Number(value ?? 0);
  return Number.isFinite(num) && num > 0 ? Math.trunc(num) : 0;
}

export function parseBBox(raw: unknown): BBox | undefined {
  if (typeof raw !== "string" || raw.trim() === "") return undefined;
  const parts = raw.split(",").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) {
    throw new ValidationError("bbox debe tener el formato minLon,minLat,maxLon,maxLat");
  }
  const [minLon, minLat, maxLon, maxLat] = parts as [number, number, number, number];
  if (minLat >= maxLat || minLon >= maxLon) {
    throw new ValidationError("bbox invalido: min debe ser menor que max");
  }
  return { minLat, minLon, maxLat, maxLon };
}
