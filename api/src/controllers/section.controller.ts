import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as templateRepo from "../repositories/template.repo.js";
import * as sectionService from "../services/section.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendCreated, sendNoContent, sendSuccess } from "../utils/ApiResponse.js";
import {
  createSectionSchema,
  reorderSectionsSchema,
  updateSectionSchema,
} from "../validators/sections.schema.js";
import type { z } from "zod";

type CreateSectionBody = z.infer<typeof createSectionSchema>;
type UpdateSectionBody = z.infer<typeof updateSectionSchema>;
type ReorderBody = z.infer<typeof reorderSectionsSchema>;

function actorFrom(req: Request) {
  return { id: requireUser(req).id, ip: req.ip ?? null };
}

export const listTemplatesHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const templates = await templateRepo.listActive();
    sendSuccess(res, { templates });
  }
);

export const listSectionsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const sections = await sectionService.listSections(req.params.pageId);
    sendSuccess(res, { sections });
  }
);

export const addSectionHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { template, layout, label, content } = req.body as CreateSectionBody;
    const section = await sectionService.addSection(
      req.params.pageId,
      {
        template,
        layout,
        label: label ?? null,
        content,
      },
      actorFrom(req)
    );
    sendCreated(res, { section });
  }
);

export const updateSectionHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { content, layout, label } = req.body as UpdateSectionBody;
    const section = await sectionService.updateSection(
      req.params.id,
      { content, layout, label },
      actorFrom(req)
    );
    sendSuccess(res, { section });
  }
);

export const deleteSectionHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await sectionService.deleteSection(req.params.id, actorFrom(req));
    sendNoContent(res);
  }
);

export const reorderSectionsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { sectionIds } = req.body as ReorderBody;
    const sections = await sectionService.reorderSections(
      req.params.pageId,
      sectionIds,
      actorFrom(req)
    );
    sendSuccess(res, { sections });
  }
);
