export type DbEngine = "sqlite" | "postgres" | "mysql";

export interface AppEnv {
  nodeEnv: string;
  port: number;
  engine: DbEngine;
  databaseUrl: string;
  dbSsl: boolean;
  sqlitePath: string;
  adminKey: string;
  corsOrigins: string[];
  llmProvider: string;
  llmApiKey: string;
  llmModel: string;
  seedOnStart: boolean;
}

function parseEngine(raw: string | undefined): DbEngine {
  const value = (raw ?? "sqlite").toLowerCase();
  if (value === "postgres" || value === "postgresql" || value === "postgis") return "postgres";
  if (value === "mysql" || value === "mariadb") return "mysql";
  return "sqlite";
}

function parseList(raw: string | undefined, fallback: string[]): string[] {
  const value = (raw ?? "").trim();
  if (value === "") return fallback;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

/** Lee y normaliza la configuracion desde variables de entorno. */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return {
    nodeEnv: source.NODE_ENV ?? "development",
    port: Number(source.PORT ?? 4000),
    engine: parseEngine(source.DB_ENGINE),
    databaseUrl: source.DATABASE_URL?.trim() ?? "",
    dbSsl: (source.DB_SSL ?? "true").toLowerCase() !== "false",
    sqlitePath: source.DB_SQLITE_PATH?.trim() || "./data/la-floresta-sur.sqlite",
    adminKey: source.ADMIN_API_KEY?.trim() || "dev-admin-key",
    corsOrigins: parseList(source.CORS_ORIGINS, ["*"]),
    llmProvider: source.LLM_PROVIDER?.trim() ?? "",
    llmApiKey: source.LLM_API_KEY?.trim() ?? "",
    llmModel: source.LLM_MODEL?.trim() || "gpt-4o-mini",
    seedOnStart: (source.SEED_ON_START ?? "false").toLowerCase() === "true",
  };
}
