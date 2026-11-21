import { createDatabase } from "../adapters/db/create-database.js";
import { loadEnv } from "../config/env.js";
import { seedDatabase } from "../seed/index.js";

const env = loadEnv();
const db = createDatabase(env);
try {
  const result = await seedDatabase(db);
  console.log(`Semillas cargadas: ${result.inserted} registros en ${db.engine}`);
} finally {
  await db.close();
}
