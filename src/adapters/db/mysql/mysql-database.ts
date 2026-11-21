import mysql from "mysql2/promise";
import type { Database, QueryResult } from "../../../domain/ports/database.js";

/** Adaptador MySQL/MariaDB. Usa `?` nativo y transacciones por conexion. */
export class MysqlDatabase implements Database {
  readonly engine = "mysql" as const;
  private readonly pool: mysql.Pool;

  constructor(connectionUri: string) {
    this.pool = mysql.createPool({ uri: connectionUri, connectionLimit: 10 });
  }

  async all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const [rows] = await this.pool.query(sql, params);
    return rows as T[];
  }

  async get<T>(sql: string, params: unknown[] = []): Promise<T | null> {
    const rows = await this.all<T>(sql, params);
    return rows[0] ?? null;
  }

  async run(sql: string, params: unknown[] = []): Promise<QueryResult> {
    const [result] = await this.pool.query(sql, params);
    return { changes: (result as mysql.ResultSetHeader).affectedRows ?? 0 };
  }

  async exec(sql: string): Promise<void> {
    await this.pool.query(sql);
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await fn();
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
