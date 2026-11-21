import { createRequire } from "node:module";
import type { Database, QueryResult } from "../../../domain/ports/database.js";

type SqliteValue = string | number | null;

interface SqliteStatement {
  all(...params: SqliteValue[]): unknown[];
  get(...params: SqliteValue[]): unknown;
  run(...params: SqliteValue[]): { changes: number | bigint };
}

interface SqliteHandle {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
  close(): void;
}

const nodeRequire = createRequire(import.meta.url);
const { DatabaseSync } = nodeRequire("node:sqlite") as {
  DatabaseSync: new (path: string) => SqliteHandle;
};

function toSqliteValue(value: unknown): SqliteValue {
  if (value === undefined || value === null) return null;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number" || typeof value === "string") return value;
  return JSON.stringify(value);
}

/** Adaptador SQLite basado en node:sqlite (sin dependencias nativas). */
export class SqliteDatabase implements Database {
  readonly engine = "sqlite" as const;
  private readonly db: SqliteHandle;

  constructor(path: string) {
    this.db = new DatabaseSync(path);
    this.db.exec("PRAGMA foreign_keys = ON;");
    if (path !== ":memory:") this.db.exec("PRAGMA journal_mode = WAL;");
  }

  async all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.db.prepare(sql).all(...params.map(toSqliteValue)) as T[];
  }

  async get<T>(sql: string, params: unknown[] = []): Promise<T | null> {
    const row = this.db.prepare(sql).get(...params.map(toSqliteValue));
    return (row ?? null) as T | null;
  }

  async run(sql: string, params: unknown[] = []): Promise<QueryResult> {
    const result = this.db.prepare(sql).run(...params.map(toSqliteValue));
    return { changes: Number(result.changes) };
  }

  async exec(sql: string): Promise<void> {
    this.db.exec(sql);
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    this.db.exec("BEGIN");
    try {
      const result = await fn();
      this.db.exec("COMMIT");
      return result;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  async close(): Promise<void> {
    this.db.close();
  }
}
