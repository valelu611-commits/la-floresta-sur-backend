import { buildContext } from "../../src/composition.js";
import type { AppContext } from "../../src/composition.js";
import { loadEnv } from "../../src/config/env.js";

/** Contexto de pruebas: SQLite en memoria con semillas cargadas. */
export function createTestContext(): Promise<AppContext> {
  return buildContext(
    loadEnv({
      ...process.env,
      DB_ENGINE: "sqlite",
      DB_SQLITE_PATH: ":memory:",
      SEED_ON_START: "true",
      ADMIN_API_KEY: "test-key",
    }),
  );
}
