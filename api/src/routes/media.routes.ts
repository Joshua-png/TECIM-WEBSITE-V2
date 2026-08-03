import { Router } from "express";
import { getPublicMediaHandler } from "../controllers/media.controller.js";
import { validate } from "../middlewares/validate.js";
import { idParamsSchema } from "../validators/pages.schema.js";

export const mediaRoutes = Router();

/**
 * @openapi
 * /api/v1/media/{id}:
 *   get:
 *     tags:
 *       - Media
 *     operationId: getPublicMedia
 *     summary: Get a single media record
 *     description: Returns a media record (metadata only — never a client-supplied URL).
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Media UUID
 *     responses:
 *       200:
 *         description: Media record
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
 *                         media:
 *                           $ref: '#/components/schemas/Media'
 *       404:
 *         description: Media not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid media id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
mediaRoutes.get("/:id", validate(idParamsSchema, "params"), getPublicMediaHandler);
