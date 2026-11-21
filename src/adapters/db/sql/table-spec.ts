import type { BaseFilters } from "../../../domain/types/common.js";

export type Row = Record<string, unknown>;

export interface SqlFragment {
  sql: string;
  params: unknown[];
}

/**
 * Metadatos que describen como mapear una entidad a su tabla.
 * Cada entidad concreta aporta su propio spec (Open/Closed).
 */
export interface TableSpec<T, TInput, F extends BaseFilters> {
  table: string;
  columns: readonly string[];
  searchColumns: readonly string[];
  orderBy: string;
  /** Valores por defecto para columnas NOT NULL que la entrada omita. */
  insertDefaults?: Row;
  toEntity(row: Row): T;
  toRow(input: Partial<TInput>): Row;
  filterSql?(filters: F): SqlFragment[];
}
