import { Router } from "express";
import { listPublicSettingsHandler } from "../controllers/settings.controller.js";

export const settingsRoutes = Router();

/**
 * @openapi
 * /api/v1/settings:
 *   get:
 *     tags:
 *       - Settings
 *     operationId: listPublicSettings
 *     summary: Get public site settings
 *     description: Returns the public settings (site, contact, social, service times, announcements) as an array of key/value rows.
 *     security: []
 *     responses:
 *       200:
 *         description: Public settings
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
 *                         settings:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Setting'
 */
settingsRoutes.get("/", listPublicSettingsHandler);
