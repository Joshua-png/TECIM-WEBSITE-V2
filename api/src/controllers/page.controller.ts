import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as pageService from "../services/page.service.js";
import * as publishService from "../services/publish.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendCreated, sendNoContent, sendSuccess } from "../utils/ApiResponse.js";
import { createPageSchema, type updatePageSchema } from "../validators/pages.schema.js";
import type { z } from "zod";

type CreatePageBody = z.infer<typeof createPageSchema>;
type UpdatePageBody = z.infer<typeof updatePageSchema>;

function actorFrom(req: Request) {
  return { id: requireUser(req).id, ip: req.ip ?? null };
}

export const listPublishedPagesHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const pages = await pageService.listPublishedPages();
    sendSuccess(res, { pages });
  }
);

export const getPublishedPageHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = await pageService.getPublishedPageBySlug(req.params.slug);
    sendSuccess(res, page);
  }
);

export const listPagesAdminHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const pages = await pageService.listPages();
    sendSuccess(res, { pages });
  }
);

export const getPageAdminHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = await pageService.getPageWithSections(req.params.id);
    sendSuccess(res, page);
  }
);

export const createPageHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug, title } = req.body as CreatePageBody;
    const page = await pageService.createPage({ slug, title }, actorFrom(req));
    sendCreated(res, { page });
  }
);

export const updatePageHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as UpdatePageBody;
    const page = await pageService.updatePage(req.params.id, body, actorFrom(req));
    sendSuccess(res, { page });
  }
);

export const deletePageHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await pageService.deletePage(req.params.id, actorFrom(req));
    sendNoContent(res);
  }
);

export const previewPageHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await publishService.preview(req.params.id);
    sendSuccess(res, result);
  }
);

export const publishPageHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await publishService.publish(req.params.id, actorFrom(req));
    sendSuccess(res, result);
  }
);

export const rollbackPageHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await publishService.rollback(
      req.params.id,
      req.params.versionId,
      actorFrom(req)
    );
    sendSuccess(res, result);
  }
);

export const listVersionsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const versions = await publishService.listVersions(req.params.id);
    sendSuccess(res, { versions });
  }
);

export const getVersionHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const version = await publishService.getVersion(req.params.versionId);
    sendSuccess(res, { version });
  }
);
