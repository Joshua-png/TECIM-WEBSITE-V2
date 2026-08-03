import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as navigationService from "../services/navigation.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { serializeNavNode } from "../utils/serializers.js";
import { replaceNavigationSchema } from "../validators/navigation.schema.js";
import type { z } from "zod";

type NavigationBody = z.infer<typeof replaceNavigationSchema>;

export const getNavigationTreeHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const tree = await navigationService.getTree();
    sendSuccess(res, { navigation: tree.map(serializeNavNode) });
  }
);

export const replaceNavigationHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { items } = req.body as NavigationBody;
    const normalized = items.map((item) => ({
      label: item.label,
      url: item.url?.trim() ? item.url : null,
      pageId: item.pageId ?? null,
      target: item.target,
      parentId: item.parentId ?? null,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    }));
    await navigationService.replaceNavigation(normalized, {
      id: requireUser(req).id,
      ip: req.ip ?? null,
    });
    const tree = await navigationService.getTree();
    sendSuccess(res, { navigation: tree.map(serializeNavNode) });
  }
);
