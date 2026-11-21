import type { BaseEntity, BaseFilters } from "./common.js";

export type LandUse = "residencial" | "comercial" | "mixto" | "institucional" | "dotacional";

export interface CadastralProperty extends BaseEntity {
  address: string;
  upz: string;
  barrio: string;
  stratum: number;
  landUse: LandUse;
  areaM2: number;
  cadastralRef: string;
  lat: number;
  lon: number;
  notes: string;
  source: string;
}

export type CadastralPropertyInput = Omit<CadastralProperty, keyof BaseEntity>;

export interface CadastralPropertyFilters extends BaseFilters {
  stratum?: number;
  landUse?: LandUse;
  upz?: string;
}

export interface Locality extends BaseEntity {
  name: string;
  code: string;
  mayor: string;
  population: number;
  areaHa: number;
  upz: string;
  description: string;
  lat: number;
  lon: number;
  bbox: string;
  source: string;
}

export type LocalityInput = Omit<Locality, keyof BaseEntity>;

export interface LocalityFilters extends BaseFilters {
  code?: string;
}
