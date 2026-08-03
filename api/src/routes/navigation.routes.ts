import { Router } from "express";
import { getNavigationTreeHandler } from "../controllers/navigation.controller.js";

export const navigationRoutes = Router();

navigationRoutes.get("/", getNavigationTreeHandler);
