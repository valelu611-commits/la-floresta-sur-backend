import express, { type Express } from "express";
import type { AppContext } from "../composition.js";
import { errorHandler, notFoundHandler } from "./error-handler.js";
import {
  parseCadastralFilters,
  parseIncidentFilters,
  parseLocalityFilters,
  parsePlaceFilters,
  parseRoadFilters,
} from "./filters.js";
import { registerResourceRoutes } from "./resource-routes.js";
import { registerSystemRoutes } from "./system-routes.js";

/** Construye la app Express interna (solo la consume la API publica). */
export function createServer(ctx: AppContext): Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "100kb" }));

  registerSystemRoutes(app, ctx);
  registerResourceRoutes(app, "places", ctx.places, parsePlaceFilters, ctx.env.adminKey);
  registerResourceRoutes(app, "security-incidents", ctx.incidents, parseIncidentFilters, ctx.env.adminKey);
  registerResourceRoutes(app, "road-segments", ctx.roads, parseRoadFilters, ctx.env.adminKey);
  registerResourceRoutes(app, "cadastral-properties", ctx.cadastral, parseCadastralFilters, ctx.env.adminKey);
  registerResourceRoutes(app, "localities", ctx.localities, parseLocalityFilters, ctx.env.adminKey);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
