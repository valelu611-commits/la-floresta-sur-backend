export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface BBox {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

/** Filtros comunes a todos los recursos. */
export interface BaseFilters {
  q?: string;
  limit: number;
  offset: number;
  bbox?: BBox;
}
