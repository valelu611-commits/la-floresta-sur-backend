export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(message: string, statusCode = 500, code = "internal_error") {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message, 400, "validation_error");
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} con id "${id}" no existe`, 404, "not_found");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "conflict");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Credenciales invalidas") {
    super(message, 401, "unauthorized");
  }
}

export function toErrorPayload(error: unknown): {
  statusCode: number;
  body: { error: { code: string; message: string; details?: unknown } };
} {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: {
          code: error.code,
          message: error.message,
          ...(error instanceof ValidationError && error.details ? { details: error.details } : {}),
        },
      },
    };
  }
  return {
    statusCode: 500,
    body: { error: { code: "internal_error", message: "Error interno del servidor" } },
  };
}
