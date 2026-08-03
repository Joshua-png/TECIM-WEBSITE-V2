import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as seoService from "../services/seo.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { serializeSeo } from "../utils/serializers.js";
import {
  updateGlobalSeoSchema,
  updatePageSeoSchema,
} from "../validators/seo.schema.js";
import type { z } from "zod";

type GlobalSeoBody = z.infer<typeof updateGlobalSeoSchema>;
type PageSeoBody = z.infer<typeof updatePageSeoSchema>;

export const getGlobalSeoHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const seo = await seoService.getGlobal();
    sendSuccess(res, { seo: seo ? serializeSeo(seo) : null });
  }
);

export const getPageSeoHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const seo = await seoService.getByPageSlug(req.params.slug);
    sendSuccess(res, { seo: serializeSeo(seo) });
  }
);

export const updateGlobalSeoHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const seo = await seoService.updateGlobal(
      req.body as GlobalSeoBody,
      { id: requireUser(req).id, ip: req.ip ?? null }
    );
    sendSuccess(res, { seo: serializeSeo(seo) });
  }
);

export const updatePageSeoHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const seo = await seoService.updateForPage(
      req.params.pageId,
      req.body as PageSeoBody,
      { id: requireUser(req).id, ip: req.ip ?? null }
    );
    sendSuccess(res, { seo: serializeSeo(seo) });
  }
);
