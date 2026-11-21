import type { Express } from "express";
import type { BaseEntity, BaseFilters } from "../domain/types/common.js";
import type { ResourceService } from "../domain/ports/service.js";
import { asyncHandler, requireAdmin } from "./guards.js";

type Query = (raw: Record<string, unknown>) => BaseFilters;

/** Monta CRUD completo para cualquier recurso que cumpla ResourceService. */
export function registerResourceRoutes<T extends BaseEntity, TInput, F extends BaseFilters>(
  app: Express,
  resource: string,
  service: ResourceService<T, TInput, F>,
  parseFilters: (raw: Record<string, unknown>) => F,
  adminKey: string,
): void {
  const base = `/internal/${resource}`;

  app.get(
    base,
    asyncHandler(async (req, res) => {
      const filters = parseFilters(req.query as Record<string, unknown>);
      res.json(await service.list(filters));
    }),
  );

  app.get(
    `${base}/:id`,
    asyncHandler(async (req, res) => {
      res.json({ data: await service.get(req.params.id) });
    }),
  );

  app.post(
    base,
    requireAdmin(adminKey),
    asyncHandler(async (req, res) => {
      const created = await service.create(req.body as TInput);
      res.status(201).json({ data: created });
    }),
  );

  app.patch(
    `${base}/:id`,
    requireAdmin(adminKey),
    asyncHandler(async (req, res) => {
      res.json({ data: await service.update(req.params.id, req.body as Partial<TInput>) });
    }),
  );

  app.delete(
    `${base}/:id`,
    requireAdmin(adminKey),
    asyncHandler(async (req, res) => {
      await service.remove(req.params.id);
      res.status(204).send();
    }),
  );
}

export type { Query };
