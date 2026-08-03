import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { adminRoutes } from "./admin.routes.js";
import { authRoutes } from "./auth.routes.js";
import { navigationRoutes } from "./navigation.routes.js";
import { pageRoutes } from "./pages.routes.js";
import { seoRoutes } from "./seo.routes.js";
import { settingsRoutes } from "./settings.routes.js";

export function createRoutes(): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.status(200).json({ success: true, data: { status: "ok" } });
  });

  router.use("/auth", authRoutes);
  router.use("/pages", pageRoutes);
  router.use("/settings", settingsRoutes);
  router.use("/navigation", navigationRoutes);
  router.use("/seo", seoRoutes);
  router.use("/admin", requireAuth, adminRoutes);

  return router;
}
