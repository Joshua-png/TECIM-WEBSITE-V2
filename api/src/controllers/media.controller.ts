import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as mediaRepo from "../repositories/media.repo.js";
import * as mediaService from "../services/media.service.js";
import { NotFoundError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "../utils/ApiResponse.js";
import { parsePagination } from "../utils/pagination.js";
import { serializeMedia } from "../utils/serializers.js";

function actorFrom(req: Request) {
  return { id: requireUser(req).id, ip: req.ip ?? null };
}

export const uploadMediaHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new NotFoundError("No file provided");
    }
    const rawAlt = (req.body as { alt?: unknown }).alt;
    const alt = typeof rawAlt === "string" ? rawAlt : null;
    const media = await mediaService.upload(
      { buffer: req.file.buffer, mimetype: req.file.mimetype, alt },
      actorFrom(req)
    );
    sendCreated(res, { media: serializeMedia(media) });
  }
);

export const listMediaHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, perPage, offset } = parsePagination(req.query.page, req.query.perPage);
    const { rows, total } = await mediaRepo.list({ limit: perPage, offset });
    sendPaginated(
      res,
      rows.map(serializeMedia),
      { page, perPage, total }
    );
  }
);

export const getPublicMediaHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const media = await mediaRepo.findById(req.params.id);
    if (!media) {
      throw new NotFoundError("Media not found");
    }
    sendSuccess(res, { media: serializeMedia(media) });
  }
);

export const deleteMediaHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await mediaService.remove(req.params.id, actorFrom(req));
    sendNoContent(res);
  }
);
