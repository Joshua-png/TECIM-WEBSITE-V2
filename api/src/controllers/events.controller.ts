import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as eventsService from "../services/events.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendCreated, sendNoContent, sendSuccess } from "../utils/ApiResponse.js";
import { serializeEvent } from "../utils/serializers.js";
import { createEventSchema, updateEventSchema } from "../validators/events.schema.js";
import type { z } from "zod";

type CreateEventBody = z.infer<typeof createEventSchema>;
type UpdateEventBody = z.infer<typeof updateEventSchema>;

function actorFrom(req: Request) {
  return { id: requireUser(req).id, ip: req.ip ?? null };
}

export const listPublicEventsHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const events = await eventsService.listPublished();
    sendSuccess(res, { events: events.map(serializeEvent) });
  }
);

export const listAllEventsHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const events = await eventsService.listAll();
    sendSuccess(res, { events: events.map(serializeEvent) });
  }
);

export const getEventHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const event = await eventsService.getById(req.params.id);
    sendSuccess(res, { event: serializeEvent(event) });
  }
);

export const createEventHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const event = await eventsService.create(req.body as CreateEventBody, actorFrom(req));
    sendCreated(res, { event: serializeEvent(event) });
  }
);

export const updateEventHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const event = await eventsService.update(
      req.params.id,
      req.body as UpdateEventBody,
      actorFrom(req)
    );
    sendSuccess(res, { event: serializeEvent(event) });
  }
);

export const deleteEventHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await eventsService.remove(req.params.id, actorFrom(req));
    sendNoContent(res);
  }
);
