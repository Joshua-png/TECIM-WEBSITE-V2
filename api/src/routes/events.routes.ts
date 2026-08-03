import { Router } from "express";
import {
  createEventHandler,
  deleteEventHandler,
  getEventHandler,
  listAllEventsHandler,
  listPublicEventsHandler,
  updateEventHandler,
} from "../controllers/events.controller.js";
import { validate } from "../middlewares/validate.js";
import { collectionIdParamsSchema } from "../validators/common.js";
import { createEventSchema, updateEventSchema } from "../validators/events.schema.js";

export const eventsPublicRoutes = Router();

/**
 * @openapi
 * /api/v1/events:
 *   get:
 *     tags:
 *       - Events
 *     operationId: listPublicEvents
 *     summary: List published events
 *     description: Returns published events ordered by start date (soonest first).
 *     responses:
 *       200:
 *         description: Published events
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         events:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Event'
 */
eventsPublicRoutes.get("/", listPublicEventsHandler);

export const adminEventsRoutes = Router();

/**
 * @openapi
 * /api/v1/admin/events:
 *   get:
 *     tags:
 *       - Admin / Events
 *     operationId: listAllEvents
 *     summary: List all events
 *     description: Returns all events (draft and published) for the admin.
 *     responses:
 *       200:
 *         description: All events
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         events:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Event'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *   post:
 *     tags:
 *       - Admin / Events
 *     operationId: createEvent
 *     summary: Create an event
 *     description: Creates an event as a draft by default. If no slug is provided it is generated from the title.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/events_createEventSchema'
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         event:
 *                           $ref: '#/components/schemas/Event'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       409:
 *         description: Slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminEventsRoutes.get("/", listAllEventsHandler);
adminEventsRoutes.post("/", validate(createEventSchema), createEventHandler);

/**
 * @openapi
 * /api/v1/admin/events/{id}:
 *   get:
 *     tags:
 *       - Admin / Events
 *     operationId: getEvent
 *     summary: Get a single event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event UUID
 *     responses:
 *       200:
 *         description: Event
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         event:
 *                           $ref: '#/components/schemas/Event'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid event id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *   patch:
 *     tags:
 *       - Admin / Events
 *     operationId: updateEvent
 *     summary: Update an event
 *     description: Partial update. Use null to clear nullable fields.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/events_updateEventSchema'
 *     responses:
 *       200:
 *         description: Event updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         event:
 *                           $ref: '#/components/schemas/Event'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       409:
 *         description: Slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *   delete:
 *     tags:
 *       - Admin / Events
 *     operationId: deleteEvent
 *     summary: Delete an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event UUID
 *     responses:
 *       204:
 *         description: Event deleted
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid event id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminEventsRoutes.get("/:id", validate(collectionIdParamsSchema, "params"), getEventHandler);
adminEventsRoutes.patch(
  "/:id",
  validate(collectionIdParamsSchema, "params"),
  validate(updateEventSchema),
  updateEventHandler
);
adminEventsRoutes.delete(
  "/:id",
  validate(collectionIdParamsSchema, "params"),
  deleteEventHandler
);
