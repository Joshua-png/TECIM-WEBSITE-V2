import { Router } from "express";
import {
  getPublishedPageHandler,
  listPublishedPagesHandler,
} from "../controllers/page.controller.js";
import { validate } from "../middlewares/validate.js";
import { pageParamsSchema } from "../validators/pages.schema.js";

export const pageRoutes = Router();

pageRoutes.get("/", listPublishedPagesHandler);
pageRoutes.get("/:slug", validate(pageParamsSchema, "params"), getPublishedPageHandler);
