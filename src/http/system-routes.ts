import type { Express } from "express";
import { ValidationError } from "../domain/errors.js";
import { asyncHandler } from "./guards.js";
import type { AppContext } from "../composition.js";

export function registerSystemRoutes(app: Express, ctx: AppContext): void {
  app.get("/internal/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "la-floresta-sur-backend",
      engine: ctx.db.engine,
      timestamp: new Date().toISOString(),
    });
  });

  app.get(
    "/internal/categories",
    asyncHandler(async (_req, res) => {
      res.json(await ctx.categories.list({ limit: 50, offset: 0 }));
    }),
  );

  app.get(
    "/internal/search",
    asyncHandler(async (req, res) => {
      const q = typeof req.query.q === "string" ? req.query.q : "";
      const limit = Number(req.query.limit ?? 8);
      res.json(await ctx.search.search(q, Number.isFinite(limit) ? limit : 8));
    }),
  );

  app.get(
    "/internal/stats",
    asyncHandler(async (_req, res) => {
      res.json(await ctx.stats.getStats());
    }),
  );

  app.post(
    "/internal/agent/ask",
    asyncHandler(async (req, res) => {
      const question = (req.body as { question?: unknown } | undefined)?.question;
      if (typeof question !== "string") throw new ValidationError("question es obligatorio");
      res.json(await ctx.agent.ask(question));
    }),
  );
}
