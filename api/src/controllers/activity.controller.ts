import { Request, Response } from "express";
import * as activityService from "../services/activity.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendPaginated } from "../utils/ApiResponse.js";

export const listActivityHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { rows, meta } = await activityService.list(
      req.query.page,
      req.query.perPage
    );
    sendPaginated(res, rows, meta);
  }
);
