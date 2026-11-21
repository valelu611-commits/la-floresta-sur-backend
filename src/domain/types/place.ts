import type { BaseEntity, BaseFilters } from "./common.js";

/** Recurso REST al que pertenece cada categoria del barrio. */
export type CategoryResource =
  | "places"
  | "security-incidents"
  | "road-segments"
  | "cadastral-properties"
  | "localities";

export interface Category extends BaseEntity {
  slug: string;
  name: string;
  resource: CategoryResource;
  color: string;
  icon: string;
  description: string;
  sortOrder: number;
}

export type CategoryInput = Omit<Category, keyof BaseEntity>;

export interface CategoryFilters extends BaseFilters {
  resource?: CategoryResource;
}

export interface Place extends BaseEntity {
  categorySlug: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lon: number;
  phone: string;
  website: string;
  hours: string;
  metadata: Record<string, unknown>;
  source: string;
  verified: boolean;
}

export interface PlaceInput {
  categorySlug: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  description?: string;
  phone?: string;
  website?: string;
  hours?: string;
  metadata?: Record<string, unknown>;
  source?: string;
  verified?: boolean;
}

export interface PlaceFilters extends BaseFilters {
  category?: string;
}
