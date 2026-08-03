import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as galleryService from "../services/gallery.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendCreated, sendNoContent, sendSuccess } from "../utils/ApiResponse.js";
import { serializeGalleryItem } from "../utils/serializers.js";
import {
  createGalleryItemSchema,
  updateGalleryItemSchema,
} from "../validators/gallery.schema.js";
import type { z } from "zod";

type CreateGalleryBody = z.infer<typeof createGalleryItemSchema>;
type UpdateGalleryBody = z.infer<typeof updateGalleryItemSchema>;

function actorFrom(req: Request) {
  return { id: requireUser(req).id, ip: req.ip ?? null };
}

export const listPublicGalleryHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const items = await galleryService.listPublished();
    sendSuccess(res, { gallery: items.map(serializeGalleryItem) });
  }
);

export const listAllGalleryHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const items = await galleryService.listAll();
    sendSuccess(res, { gallery: items.map(serializeGalleryItem) });
  }
);

export const getGalleryItemHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const item = await galleryService.getById(req.params.id);
    sendSuccess(res, { galleryItem: serializeGalleryItem(item) });
  }
);

export const createGalleryItemHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const item = await galleryService.create(req.body as CreateGalleryBody, actorFrom(req));
    sendCreated(res, { galleryItem: serializeGalleryItem(item) });
  }
);

export const updateGalleryItemHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const item = await galleryService.update(
      req.params.id,
      req.body as UpdateGalleryBody,
      actorFrom(req)
    );
    sendSuccess(res, { galleryItem: serializeGalleryItem(item) });
  }
);

export const deleteGalleryItemHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await galleryService.remove(req.params.id, actorFrom(req));
    sendNoContent(res);
  }
);
