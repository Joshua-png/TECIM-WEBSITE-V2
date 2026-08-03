import { Router } from "express";
import { listPublicSettingsHandler } from "../controllers/settings.controller.js";

export const settingsRoutes = Router();

settingsRoutes.get("/", listPublicSettingsHandler);
