import type { AppEnv } from "./config/env.js";
import { createDatabase } from "./adapters/db/create-database.js";
import { runMigrations } from "./adapters/db/schema/migrate.js";
import { SqlCadastralRepository } from "./adapters/db/sql/cadastral-repository.js";
import { SqlCategoryRepository } from "./adapters/db/sql/category-repository.js";
import { SqlIncidentRepository } from "./adapters/db/sql/incident-repository.js";
import { SqlLocalityRepository } from "./adapters/db/sql/locality-repository.js";
import { SqlPlaceRepository } from "./adapters/db/sql/place-repository.js";
import { SqlRoadRepository } from "./adapters/db/sql/road-repository.js";
import { seedDatabase } from "./seed/index.js";
import type { Database } from "./domain/ports/database.js";
import { AgentService } from "./agent/agent-service.js";
import { createLlmClient } from "./agent/llm-client.js";
import { PlaceService } from "./services/place-service.js";
import { SecurityService } from "./services/security-service.js";
import { RoadService } from "./services/road-service.js";
import { CadastralService } from "./services/cadastral-service.js";
import { LocalityService } from "./services/locality-service.js";
import { SearchService } from "./services/search-service.js";
import { StatsService } from "./services/stats-service.js";

export interface AppContext {
  db: Database;
  env: AppEnv;
  categories: SqlCategoryRepository;
  places: PlaceService;
  incidents: SecurityService;
  roads: RoadService;
  cadastral: CadastralService;
  localities: LocalityService;
  search: SearchService;
  stats: StatsService;
  agent: AgentService;
}

/** Composition root: unico lugar donde se conectan adaptadores y dominio. */
export async function buildContext(env: AppEnv): Promise<AppContext> {
  const db = createDatabase(env);
  await runMigrations(db);
  if (env.seedOnStart) await seedDatabase(db);

  const categoryRepo = new SqlCategoryRepository(db);
  const placeRepo = new SqlPlaceRepository(db);
  const incidentRepo = new SqlIncidentRepository(db);
  const roadRepo = new SqlRoadRepository(db);
  const cadastralRepo = new SqlCadastralRepository(db);
  const localityRepo = new SqlLocalityRepository(db);

  const readRepos = {
    categories: categoryRepo,
    places: placeRepo,
    incidents: incidentRepo,
    roads: roadRepo,
    cadastral: cadastralRepo,
    localities: localityRepo,
  };

  const search = new SearchService(readRepos);
  return {
    db,
    env,
    categories: categoryRepo,
    places: new PlaceService(placeRepo),
    incidents: new SecurityService(incidentRepo),
    roads: new RoadService(roadRepo),
    cadastral: new CadastralService(cadastralRepo),
    localities: new LocalityService(localityRepo),
    search,
    stats: new StatsService(readRepos),
    agent: new AgentService(readRepos, search, createLlmClient(env)),
  };
}
