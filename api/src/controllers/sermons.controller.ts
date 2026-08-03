import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as sermonsService from "../services/sermons.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendCreated, sendNoContent, sendSuccess } from "../utils/ApiResponse.js";
import { serializeSermon } from "../utils/serializers.js";
import { createSermonSchema, updateSermonSchema } from "../validators/sermons.schema.js";
import type { z } from "zod";

type CreateSermonBody = z.infer<typeof createSermonSchema>;
type UpdateSermonBody = z.infer<typeof updateSermonSchema>;

function actorFrom(req: Request) {
  return { id: requireUser(req).id, ip: req.ip ?? null };
}

export const listPublicSermonsHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const sermons = await sermonsService.listPublished();
    sendSuccess(res, { sermons: sermons.map(serializeSermon) });
  }
);

export const listAllSermonsHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const sermons = await sermonsService.listAll();
    sendSuccess(res, { sermons: sermons.map(serializeSermon) });
  }
);

export const getSermonHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const sermon = await sermonsService.getById(req.params.id);
    sendSuccess(res, { sermon: serializeSermon(sermon) });
  }
);

export const createSermonHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const sermon = await sermonsService.create(req.body as CreateSermonBody, actorFrom(req));
    sendCreated(res, { sermon: serializeSermon(sermon) });
  }
);

export const updateSermonHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const sermon = await sermonsService.update(
      req.params.id,
      req.body as UpdateSermonBody,
      actorFrom(req)
    );
    sendSuccess(res, { sermon: serializeSermon(sermon) });
  }
);

export const deleteSermonHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await sermonsService.remove(req.params.id, actorFrom(req));
    sendNoContent(res);
  }
);
