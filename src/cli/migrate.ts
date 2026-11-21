import { createDatabase } from "../adapters/db/create-database.js";
import { runMigrations } from "../adapters/db/schema/migrate.js";
import { loadEnv } from "../config/env.js";

const env = loadEnv();
const db = createDatabase(env);
try {
  await runMigrations(db);
  console.log(`Esquema aplicado en ${db.engine} (${env.databaseUrl || env.sqlitePath})`);
} finally {
  await db.close();
}
