import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { authEmailLimiter, authIpLimiter } from "../middlewares/rateLimit.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, logoutSchema, refreshSchema } from "../validators/auth.schema.js";

export const authRoutes = Router();

authRoutes.post(
  "/login",
  authIpLimiter,
  authEmailLimiter,
  validate(loginSchema),
  loginHandler
);

authRoutes.post("/refresh", authIpLimiter, validate(refreshSchema), refreshHandler);

authRoutes.post("/logout", authIpLimiter, validate(logoutSchema), logoutHandler);

authRoutes.get("/me", requireAuth, meHandler);
