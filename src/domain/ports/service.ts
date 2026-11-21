import type { BaseFilters, Page } from "../types/common.js";

/**
 * Contrato que consumen la capa HTTP y la API publica.
 * Permite sustituir la implementacion (SQL, memoria, remota) sin tocar rutas.
 */
export interface ResourceService<T, TInput, F extends BaseFilters = BaseFilters> {
  list(filters: F): Promise<Page<T>>;
  get(id: string): Promise<T>;
  create(input: TInput): Promise<T>;
  update(id: string, patch: Partial<TInput>): Promise<T>;
  remove(id: string): Promise<void>;
}
