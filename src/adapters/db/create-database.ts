import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { Database } from "../../domain/ports/database.js";
import type { AppEnv } from "../../config/env.js";
import { MysqlDatabase } from "./mysql/mysql-database.js";
import { PostgresDatabase } from "./postgres/postgres-database.js";
import { SqliteDatabase } from "./sqlite/sqlite-database.js";

/**
 * Factory de motores (Dependency Inversion + Open/Closed):
 * agregar un motor nuevo solo requiere un adaptador que implemente Database.
 */
export function createDatabase(env: AppEnv): Database {
  if (env.engine === "postgres") {
    if (!env.databaseUrl) throw new Error("DATABASE_URL es obligatorio para PostgreSQL");
    return new PostgresDatabase(env.databaseUrl, env.dbSsl);
  }

  if (env.engine === "mysql") {
    if (!env.databaseUrl) throw new Error("DATABASE_URL es obligatorio para MySQL");
    return new MysqlDatabase(env.databaseUrl);
  }

  if (env.sqlitePath !== ":memory:") {
    mkdirSync(dirname(env.sqlitePath), { recursive: true });
  }
  return new SqliteDatabase(env.sqlitePath);
}
