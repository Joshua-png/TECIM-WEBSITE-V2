import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import swaggerRouter from "./config/swagger/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.js";
import { createRoutes } from "./routes/index.js";
import { landingHtml } from "./utils/landing.js";

export function createApp(): express.Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(express.json({ limit: "2mb" }));

  app.get("/", (_req, res) => {
    res.set("Content-Type", "text/html").send(landingHtml);
  });

  app.use("/api/v1", createRoutes());
  app.use(swaggerRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
