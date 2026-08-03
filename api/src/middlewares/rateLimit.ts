import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { getStore } from "../utils/store.js";

export interface RateLimitOptions {
  windowSeconds: number;
  max: number;
  keyGenerator?: (req: Request) => string;
}

const rateLimitKeys = new Set<string>();

export function rateLimit(options: RateLimitOptions): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    void (async () => {
      try {
        const store = getStore();
        const key = options.keyGenerator
          ? options.keyGenerator(req)
          : `ip:${req.ip ?? "unknown"}`;
        const windowKey = `rl:${key}:${Math.floor(
          Date.now() / (options.windowSeconds * 1000)
        )}`;
        rateLimitKeys.add(windowKey);
        const count = await store.incr(windowKey, options.windowSeconds);
        if (count > options.max) {
          next(new ApiError(429, "RATE_LIMITED", "Too many requests"));
          return;
        }
        next();
      } catch (err) {
        next(err);
      }
    })();
  };
}

export async function resetRateLimits(): Promise<void> {
  const store = getStore();
  for (const key of rateLimitKeys) {
    await store.del(key);
  }
  rateLimitKeys.clear();
}

export const authIpLimiter = rateLimit({
  windowSeconds: 15 * 60,
  max: 20,
});

export const authEmailLimiter = rateLimit({
  windowSeconds: 15 * 60,
  max: 5,
  keyGenerator: (req) => {
    const email = (req.body as Record<string, unknown> | undefined)?.email;
    return typeof email === "string" ? email : "unknown";
  },
});
