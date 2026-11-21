import type { BaseFilters, Page } from "../types/common.js";

/**
 * Puerto de persistencia (Dependency Inversion).
 * La logica de negocio depende de esta interfaz, nunca de un motor concreto.
 */
export interface Repository<T, TInput, F extends BaseFilters = BaseFilters> {
  list(filters: F): Promise<Page<T>>;
  findById(id: string): Promise<T | null>;
  create(input: TInput): Promise<T>;
  update(id: string, patch: Partial<TInput>): Promise<T | null>;
  remove(id: string): Promise<boolean>;
}
