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

export function createRoutes(): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.set("Content-Type", "text/html").send(`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TECIM API</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #e2e8f0; padding: 2rem; }
      .card { max-width: 600px; text-align: center; padding: 3rem 2rem; border: 1px solid #1e293b; border-radius: 12px; background: #1e293b; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
      h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .subtitle { color: #94a3b8; margin-bottom: 2rem; font-size: 1.125rem; }
      .links { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem; }
      a { color: #60a5fa; text-decoration: none; padding: 0.625rem 1.25rem; border: 1px solid #334155; border-radius: 8px; transition: all 0.2s; }
      a:hover { background: #1e293b; border-color: #60a5fa; }
      .version { margin-top: 2rem; color: #64748b; font-size: 0.875rem; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>TECIM API</h1>
      <p class="subtitle">Backend for the TECIM public website and admin CMS</p>
      <div class="links">
        <a href="/api-docs">API Documentation</a>
        <a href="/api/v1/health">Health Check</a>
      </div>
      <p class="version">v1.0.0</p>
    </div>
  </body>
</html>
    `);
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
