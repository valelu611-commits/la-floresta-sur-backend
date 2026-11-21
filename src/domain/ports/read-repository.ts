import type { BaseFilters, Page } from "../types/common.js";

/**
 * Vista de solo lectura para consumidores que no escriben
 * (buscador, estadisticas, agente). Interface Segregation.
 */
export interface ReadRepository<T, F extends BaseFilters = BaseFilters> {
  list(filters: F): Promise<Page<T>>;
  findById(id: string): Promise<T | null>;
}
