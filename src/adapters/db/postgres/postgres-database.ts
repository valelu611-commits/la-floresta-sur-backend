import pg from "pg";
import type { Database, QueryResult } from "../../../domain/ports/database.js";

const { Pool } = pg;

/** Traduce los placeholders `?` al estilo posicional `$1..$n` de PostgreSQL. */
export function toPostgresPlaceholders(sql: string): string {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

export class PostgresDatabase implements Database {
  readonly engine = "postgres" as const;
  private readonly pool: pg.Pool;

  constructor(connectionString: string, ssl = false) {
    this.pool = new Pool({
      connectionString,
      max: 10,
      ssl: ssl ? { rejectUnauthorized: false } : undefined,
    });
  }

  async all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const result = await this.pool.query(toPostgresPlaceholders(sql), params);
    return result.rows as T[];
  }

  async get<T>(sql: string, params: unknown[] = []): Promise<T | null> {
    const rows = await this.all<T>(sql, params);
    return rows[0] ?? null;
  }

  async run(sql: string, params: unknown[] = []): Promise<QueryResult> {
    const result = await this.pool.query(toPostgresPlaceholders(sql), params);
    return { changes: result.rowCount ?? 0 };
  }

  async exec(sql: string): Promise<void> {
    await this.pool.query(sql);
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await fn();
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
