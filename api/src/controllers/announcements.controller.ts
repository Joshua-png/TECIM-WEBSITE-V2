import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as announcementsService from "../services/announcements.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendCreated, sendNoContent, sendSuccess } from "../utils/ApiResponse.js";
import { serializeAnnouncement } from "../utils/serializers.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../validators/announcements.schema.js";
import type { z } from "zod";

type CreateAnnouncementBody = z.infer<typeof createAnnouncementSchema>;
type UpdateAnnouncementBody = z.infer<typeof updateAnnouncementSchema>;

function actorFrom(req: Request) {
  return { id: requireUser(req).id, ip: req.ip ?? null };
}

export const listPublicAnnouncementsHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const announcements = await announcementsService.listPublished();
    sendSuccess(res, { announcements: announcements.map(serializeAnnouncement) });
  }
);

export const listAllAnnouncementsHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const announcements = await announcementsService.listAll();
    sendSuccess(res, { announcements: announcements.map(serializeAnnouncement) });
  }
);

export const getAnnouncementHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const announcement = await announcementsService.getById(req.params.id);
    sendSuccess(res, { announcement: serializeAnnouncement(announcement) });
  }
);

export const createAnnouncementHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const announcement = await announcementsService.create(
      req.body as CreateAnnouncementBody,
      actorFrom(req)
    );
    sendCreated(res, { announcement: serializeAnnouncement(announcement) });
  }
);

export const updateAnnouncementHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const announcement = await announcementsService.update(
      req.params.id,
      req.body as UpdateAnnouncementBody,
      actorFrom(req)
    );
    sendSuccess(res, { announcement: serializeAnnouncement(announcement) });
  }
);

export const deleteAnnouncementHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await announcementsService.remove(req.params.id, actorFrom(req));
    sendNoContent(res);
  }
);
