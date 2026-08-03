import { Router } from "express";
import {
  createAnnouncementHandler,
  deleteAnnouncementHandler,
  getAnnouncementHandler,
  listAllAnnouncementsHandler,
  listPublicAnnouncementsHandler,
  updateAnnouncementHandler,
} from "../controllers/announcements.controller.js";
import { validate } from "../middlewares/validate.js";
import { collectionIdParamsSchema } from "../validators/common.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../validators/announcements.schema.js";

export const announcementsPublicRoutes = Router();

/**
 * @openapi
 * /api/v1/announcements:
 *   get:
 *     tags:
 *       - Announcements
 *     operationId: listPublicAnnouncements
 *     summary: List active announcements
 *     description: Returns published announcements currently within their active window.
 *     responses:
 *       200:
 *         description: Active announcements
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
 *                         announcements:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Announcement'
 */
announcementsPublicRoutes.get("/", listPublicAnnouncementsHandler);

export const adminAnnouncementsRoutes = Router();

/**
 * @openapi
 * /api/v1/admin/announcements:
 *   get:
 *     tags:
 *       - Admin / Announcements
 *     operationId: listAllAnnouncements
 *     summary: List all announcements
 *     description: Returns all announcements (draft and published, including expired) for the admin.
 *     responses:
 *       200:
 *         description: All announcements
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
 *                         announcements:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Announcement'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *   post:
 *     tags:
 *       - Admin / Announcements
 *     operationId: createAnnouncement
 *     summary: Create an announcement
 *     description: Creates an announcement as a draft by default.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/announcements_createAnnouncementSchema'
 *     responses:
 *       201:
 *         description: Announcement created
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
 *                         announcement:
 *                           $ref: '#/components/schemas/Announcement'
 *       401:
 *         description: Invalid or missing access token
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
adminAnnouncementsRoutes.get("/", listAllAnnouncementsHandler);
adminAnnouncementsRoutes.post("/", validate(createAnnouncementSchema), createAnnouncementHandler);

/**
 * @openapi
 * /api/v1/admin/announcements/{id}:
 *   get:
 *     tags:
 *       - Admin / Announcements
 *     operationId: getAnnouncement
 *     summary: Get a single announcement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Announcement UUID
 *     responses:
 *       200:
 *         description: Announcement
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
 *                         announcement:
 *                           $ref: '#/components/schemas/Announcement'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Announcement not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid announcement id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *   patch:
 *     tags:
 *       - Admin / Announcements
 *     operationId: updateAnnouncement
 *     summary: Update an announcement
 *     description: Partial update. Use null to clear nullable fields.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Announcement UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/announcements_updateAnnouncementSchema'
 *     responses:
 *       200:
 *         description: Announcement updated
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
 *                         announcement:
 *                           $ref: '#/components/schemas/Announcement'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Announcement not found
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
 *       - Admin / Announcements
 *     operationId: deleteAnnouncement
 *     summary: Delete an announcement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Announcement UUID
 *     responses:
 *       204:
 *         description: Announcement deleted
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Announcement not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid announcement id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminAnnouncementsRoutes.get(
  "/:id",
  validate(collectionIdParamsSchema, "params"),
  getAnnouncementHandler
);
adminAnnouncementsRoutes.patch(
  "/:id",
  validate(collectionIdParamsSchema, "params"),
  validate(updateAnnouncementSchema),
  updateAnnouncementHandler
);
adminAnnouncementsRoutes.delete(
  "/:id",
  validate(collectionIdParamsSchema, "params"),
  deleteAnnouncementHandler
);
