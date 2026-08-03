import { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ValidationError } from "../utils/ApiError.js";

type Source = "body" | "params" | "query";

export function validate(schema: ZodType<unknown>, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (result.success) {
      if (source === "body") {
        req.body = result.data;
      } else {
        Object.assign(req[source], result.data);
      }
      next();
      return;
    }
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || source,
      message: issue.message,
    }));
    next(new ValidationError(details));
  };
}
