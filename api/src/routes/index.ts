import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { adminRoutes } from "./admin.routes.js";
import { announcementsPublicRoutes } from "./announcements.routes.js";
import { authRoutes } from "./auth.routes.js";
import { eventsPublicRoutes } from "./events.routes.js";
import { galleryPublicRoutes } from "./gallery.routes.js";
import { mediaRoutes } from "./media.routes.js";
import { navigationRoutes } from "./navigation.routes.js";
import { pageRoutes } from "./pages.routes.js";
import { seoRoutes } from "./seo.routes.js";
import { sermonsPublicRoutes } from "./sermons.routes.js";
import { settingsRoutes } from "./settings.routes.js";
import { landingHtml } from "../utils/landing.js";

export function createRoutes(): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.set("Content-Type", "text/html").send(landingHtml);
  });

  /**
   * @openapi
   * /api/v1/health:
   *   get:
   *     tags:
   *       - System
   *     operationId: healthCheck
   *     summary: Health check
   *     description: Returns the service health status. No authentication required.
   *     security: []
   *     responses:
   *       200:
   *         description: Service is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               required: [success, data]
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     status:
   *                       type: string
   *                       example: ok
   */
  router.get("/health", (_req, res) => {
    res.status(200).json({ success: true, data: { status: "ok" } });
  });

  router.use("/auth", authRoutes);
  router.use("/pages", pageRoutes);
  router.use("/settings", settingsRoutes);
  router.use("/navigation", navigationRoutes);
  router.use("/seo", seoRoutes);
  router.use("/media", mediaRoutes);
  router.use("/events", eventsPublicRoutes);
  router.use("/gallery", galleryPublicRoutes);
  router.use("/sermons", sermonsPublicRoutes);
  router.use("/announcements", announcementsPublicRoutes);
  router.use("/admin", requireAuth, adminRoutes);

  return router;
}
