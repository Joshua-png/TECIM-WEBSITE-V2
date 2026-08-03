import { Router } from "express";
import {
  getGlobalSeoHandler,
  getPageSeoHandler,
} from "../controllers/seo.controller.js";
import { validate } from "../middlewares/validate.js";
import { pageParamsSchema } from "../validators/pages.schema.js";

export const seoRoutes = Router();

seoRoutes.get("/", getGlobalSeoHandler);
seoRoutes.get("/pages/:slug", validate(pageParamsSchema, "params"), getPageSeoHandler);
