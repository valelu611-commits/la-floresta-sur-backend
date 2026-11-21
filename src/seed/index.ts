import type { Database } from "../domain/ports/database.js";
import { SqlCadastralRepository } from "../adapters/db/sql/cadastral-repository.js";
import { SqlCategoryRepository } from "../adapters/db/sql/category-repository.js";
import { SqlIncidentRepository } from "../adapters/db/sql/incident-repository.js";
import { SqlLocalityRepository } from "../adapters/db/sql/locality-repository.js";
import { SqlPlaceRepository } from "../adapters/db/sql/place-repository.js";
import { SqlRoadRepository } from "../adapters/db/sql/road-repository.js";
import { runMigrations } from "../adapters/db/schema/migrate.js";
import { cadastralSeeds, localitySeeds } from "./cadastre.js";
import { categoriesCore } from "./categories-core.js";
import { categoriesExtra } from "./categories-extra.js";
import { incidentSeeds } from "./incidents.js";
import { communityPlaces } from "./places-community.js";
import { foodPlaces } from "./places-food.js";
import { mobilityPlaces } from "./places-mobility.js";
import { recreationPlaces } from "./places-recreation.js";
import { roadSeeds } from "./roads.js";

const TABLES = [
  "security_incidents", "road_segments", "cadastral_properties", "localities", "places", "categories",
];

async function clearTables(db: Database): Promise<void> {
  for (const table of TABLES) await db.run(`DELETE FROM ${table}`);
}

/** Migra y carga datos realistas de ejemplo (idempotente). */
export async function seedDatabase(db: Database): Promise<{ inserted: number }> {
  await runMigrations(db);
  await clearTables(db);

  const categories = new SqlCategoryRepository(db);
  const places = new SqlPlaceRepository(db);
  const incidents = new SqlIncidentRepository(db);
  const roads = new SqlRoadRepository(db);
  const cadastral = new SqlCadastralRepository(db);
  const localities = new SqlLocalityRepository(db);

  for (const category of [...categoriesCore, ...categoriesExtra]) {
    await categories.create(category);
  }

  const placeSeeds = [
    ...communityPlaces,
    ...mobilityPlaces,
    ...foodPlaces,
    ...recreationPlaces,
  ];
  for (const place of placeSeeds) await places.create(place);
  for (const incident of incidentSeeds) await incidents.create(incident);
  for (const road of roadSeeds) await roads.create(road);
  for (const property of cadastralSeeds) await cadastral.create(property);
  for (const locality of localitySeeds) await localities.create(locality);

  return {
    inserted:
      categoriesCore.length + categoriesExtra.length + placeSeeds.length +
      incidentSeeds.length + roadSeeds.length + cadastralSeeds.length + localitySeeds.length,
  };
}
