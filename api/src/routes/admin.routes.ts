import { Router } from "express";
import { listActivityHandler } from "../controllers/activity.controller.js";
import {
  createPageHandler,
  deletePageHandler,
  getPageAdminHandler,
  getVersionHandler,
  listPagesAdminHandler,
  listVersionsHandler,
  previewPageHandler,
  publishPageHandler,
  rollbackPageHandler,
  updatePageHandler,
} from "../controllers/page.controller.js";
import {
  addSectionHandler,
  deleteSectionHandler,
  listSectionsHandler,
  listTemplatesHandler,
  reorderSectionsHandler,
  updateSectionHandler,
} from "../controllers/section.controller.js";
import {
  listAllSettingsHandler,
  updateSettingHandler,
} from "../controllers/settings.controller.js";
import {
  replaceNavigationHandler,
} from "../controllers/navigation.controller.js";
import {
  updateGlobalSeoHandler,
  updatePageSeoHandler,
} from "../controllers/seo.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createPageSchema,
  idParamsSchema,
  updatePageSchema,
  versionParamsSchema,
} from "../validators/pages.schema.js";
import {
  createSectionSchema,
  reorderSectionsSchema,
  sectionPageParamsSchema,
  updateSectionSchema,
} from "../validators/sections.schema.js";
import {
  replaceNavigationSchema,
} from "../validators/navigation.schema.js";
import {
  settingKeyParamsSchema,
  updateSettingSchema,
} from "../validators/settings.schema.js";
import {
  updateGlobalSeoSchema,
  updatePageSeoSchema,
} from "../validators/seo.schema.js";

export const adminRoutes = Router();

adminRoutes.get("/templates", listTemplatesHandler);

adminRoutes.get("/pages", listPagesAdminHandler);
adminRoutes.post("/pages", validate(createPageSchema), createPageHandler);
adminRoutes.get("/pages/:id", validate(idParamsSchema, "params"), getPageAdminHandler);
adminRoutes.patch(
  "/pages/:id",
  validate(idParamsSchema, "params"),
  validate(updatePageSchema),
  updatePageHandler
);
adminRoutes.delete(
  "/pages/:id",
  validate(idParamsSchema, "params"),
  deletePageHandler
);
adminRoutes.get(
  "/pages/:id/preview",
  validate(idParamsSchema, "params"),
  previewPageHandler
);
adminRoutes.post(
  "/pages/:id/publish",
  validate(idParamsSchema, "params"),
  publishPageHandler
);
adminRoutes.post(
  "/pages/:id/rollback/:versionId",
  validate(versionParamsSchema, "params"),
  rollbackPageHandler
);
adminRoutes.get(
  "/pages/:id/versions",
  validate(idParamsSchema, "params"),
  listVersionsHandler
);
adminRoutes.get(
  "/pages/:pageId/sections",
  validate(sectionPageParamsSchema, "params"),
  listSectionsHandler
);
adminRoutes.post(
  "/pages/:pageId/sections",
  validate(sectionPageParamsSchema, "params"),
  validate(createSectionSchema),
  addSectionHandler
);
adminRoutes.put(
  "/pages/:pageId/sections/order",
  validate(sectionPageParamsSchema, "params"),
  validate(reorderSectionsSchema),
  reorderSectionsHandler
);
adminRoutes.patch(
  "/sections/:id",
  validate(idParamsSchema, "params"),
  validate(updateSectionSchema),
  updateSectionHandler
);
adminRoutes.delete(
  "/sections/:id",
  validate(idParamsSchema, "params"),
  deleteSectionHandler
);

adminRoutes.get("/versions/:versionId", getVersionHandler);

adminRoutes.get("/activity", listActivityHandler);

adminRoutes.get("/settings", listAllSettingsHandler);
adminRoutes.put(
  "/settings/:key",
  validate(settingKeyParamsSchema, "params"),
  validate(updateSettingSchema),
  updateSettingHandler
);

adminRoutes.put("/navigation", validate(replaceNavigationSchema), replaceNavigationHandler);

adminRoutes.put("/seo", validate(updateGlobalSeoSchema), updateGlobalSeoHandler);
adminRoutes.put(
  "/seo/pages/:pageId",
  validate(sectionPageParamsSchema, "params"),
  validate(updatePageSeoSchema),
  updatePageSeoHandler
);
