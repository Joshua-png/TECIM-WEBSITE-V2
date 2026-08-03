import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, "NOT_FOUND", `Route not found: ${req.method} ${req.path}`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    });
    return;
  }
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    res.status(422).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Validation failed", details },
    });
    return;
  }
  logger.error("Unhandled error", err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL", message: "Internal server error" },
  });
}
