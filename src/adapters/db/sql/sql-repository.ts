import { randomUUID } from "node:crypto";
import type { Database } from "../../../domain/ports/database.js";
import type { Repository } from "../../../domain/ports/repository.js";
import type { BaseFilters, Page } from "../../../domain/types/common.js";
import type { Row, TableSpec } from "./table-spec.js";

/** Repositorio CRUD generico sobre SQL: una sola implementacion para 3 motores. */
export class SqlCrudRepository<T, TInput, F extends BaseFilters = BaseFilters>
  implements Repository<T, TInput, F>
{
  constructor(
    protected readonly db: Database,
    protected readonly spec: TableSpec<T, TInput, F>,
  ) {}

  async list(filters: F): Promise<Page<T>> {
    const { where, params } = this.buildWhere(filters);
    const countRow = await this.db.get<{ total: number | string }>(
      `SELECT COUNT(*) AS total FROM ${this.spec.table} ${where}`,
      params,
    );
    const rows = await this.db.all<Row>(
      `SELECT ${this.spec.columns.join(", ")} FROM ${this.spec.table} ${where} ` +
        `ORDER BY ${this.spec.orderBy} LIMIT ? OFFSET ?`,
      [...params, filters.limit, filters.offset],
    );
    return {
      items: rows.map((row) => this.spec.toEntity(row)),
      total: Number(countRow?.total ?? 0),
      limit: filters.limit,
      offset: filters.offset,
    };
  }

  async findById(id: string): Promise<T | null> {
    const row = await this.db.get<Row>(
      `SELECT ${this.spec.columns.join(", ")} FROM ${this.spec.table} WHERE id = ?`,
      [id],
    );
    return row ? this.spec.toEntity(row) : null;
  }

  async create(input: TInput): Promise<T> {
    const now = new Date().toISOString();
    const row: Row = {
      ...this.spec.insertDefaults,
      ...this.spec.toRow(input),
      id: randomUUID(),
      created_at: now,
      updated_at: now,
    };
    const keys = Object.keys(row);
    await this.db.run(
      `INSERT INTO ${this.spec.table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
      keys.map((key) => row[key]),
    );
    const created = await this.findById(String(row.id));
    if (!created) throw new Error(`No se pudo leer ${this.spec.table} recien creado`);
    return created;
  }

  async update(id: string, patch: Partial<TInput>): Promise<T | null> {
    const row = this.spec.toRow(patch);
    const keys = Object.keys(row);
    if (keys.length > 0) {
      await this.db.run(
        `UPDATE ${this.spec.table} SET ${keys.map((key) => `${key} = ?`).join(", ")}, ` +
          `updated_at = ? WHERE id = ?`,
        [...keys.map((key) => row[key]), new Date().toISOString(), id],
      );
    } else {
      const exists = await this.findById(id);
      if (!exists) return null;
    }
    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.db.run(`DELETE FROM ${this.spec.table} WHERE id = ?`, [id]);
    return result.changes > 0;
  }

  private buildWhere(filters: F): { where: string; params: unknown[] } {
    const fragments = this.spec.filterSql?.(filters) ?? [];
    const clauses = fragments.map((fragment) => `(${fragment.sql})`);
    const params = fragments.flatMap((fragment) => fragment.params);

    if (filters.q) {
      const like = this.db.engine === "postgres" ? "ILIKE" : "LIKE";
      const columns = this.spec.searchColumns;
      clauses.push(`(${columns.map((column) => `${column} ${like} ?`).join(" OR ")})`);
      params.push(...columns.map(() => `%${filters.q}%`));
    }

    return { where: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "", params };
  }
}
