export type DbEngine = "sqlite" | "postgres" | "mysql";

export interface QueryResult {
  changes: number;
}

/**
 * Puerto de base de datos. Los adaptadores traducen el dialecto SQL
 * y la forma de los placeholders, manteniendo el mismo contrato.
 */
export interface Database {
  readonly engine: DbEngine;
  all<T>(sql: string, params?: unknown[]): Promise<T[]>;
  get<T>(sql: string, params?: unknown[]): Promise<T | null>;
  run(sql: string, params?: unknown[]): Promise<QueryResult>;
  exec(sql: string): Promise<void>;
  transaction<T>(fn: () => Promise<T>): Promise<T>;
  close(): Promise<void>;
}
