import type { ErrorRequestHandler, Request, Response } from "express";
import { toErrorPayload } from "../domain/errors.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { code: "not_found", message: "Ruta no encontrada" } });
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const payload = toErrorPayload(error);
  if (payload.statusCode >= 500) {
    console.error("[backend] error", error);
  }
  res.status(payload.statusCode).json(payload.body);
};
