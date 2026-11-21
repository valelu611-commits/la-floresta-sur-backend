import type { NextFunction, Request, RequestHandler, Response } from "express";
import { UnauthorizedError } from "../domain/errors.js";

export type AsyncHandler = (req: Request, res: Response) => Promise<void>;

/** Envuelve handlers async para que Express capture los rechazos. */
export function asyncHandler(handler: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    handler(req, res).catch(next);
  };
}

/** Defensa en profundidad: el backend tambien exige la clave de escritura. */
export function requireAdmin(adminKey: string): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.header("x-admin-key") !== adminKey) {
      next(new UnauthorizedError("x-admin-key invalida o ausente"));
      return;
    }
    next();
  };
}
