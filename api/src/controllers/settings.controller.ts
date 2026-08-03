import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as settingsService from "../services/settings.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { updateSettingSchema } from "../validators/settings.schema.js";
import type { z } from "zod";

type SettingBody = z.infer<typeof updateSettingSchema>;

export const listPublicSettingsHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const settings = await settingsService.listPublic();
    sendSuccess(res, { settings });
  }
);

export const listAllSettingsHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const settings = await settingsService.listAll();
    sendSuccess(res, { settings });
  }
);

export const updateSettingHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { value } = req.body as SettingBody;
    const setting = await settingsService.updateSetting(req.params.key, value, {
      id: requireUser(req).id,
      ip: req.ip ?? null,
    });
    sendSuccess(res, { setting });
  }
);
