import type { Database } from "../../../domain/ports/database.js";
import { cadastreStatements } from "./cadastre.js";
import { coreStatements } from "./core.js";
import { safetyStatements } from "./safety.js";

const INDEXES = [
  "CREATE INDEX idx_places_category ON places (category_slug)",
  "CREATE INDEX idx_places_geo ON places (lat, lon)",
  "CREATE INDEX idx_incidents_kind ON security_incidents (kind, severity)",
  "CREATE INDEX idx_incidents_date ON security_incidents (occurred_at)",
  "CREATE INDEX idx_roads_condition ON road_segments (condition, status)",
  "CREATE INDEX idx_cadastral_upz ON cadastral_properties (upz, stratum)",
];

/** Crea el esquema completo. Idempotente en los tres motores. */
export async function runMigrations(db: Database): Promise<void> {
  const statements = [...coreStatements, ...safetyStatements, ...cadastreStatements];
  for (const statement of statements) {
    await db.exec(statement);
  }
  for (const index of INDEXES) {
    try {
      await db.exec(index.replace("INDEX idx", "INDEX IF NOT EXISTS idx"));
    } catch {
      // MySQL no soporta IF NOT EXISTS en CREATE INDEX: el indice ya existe.
    }
  }
}
