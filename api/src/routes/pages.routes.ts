import { Router } from "express";
import {
  getPublishedPageHandler,
  listPublishedPagesHandler,
} from "../controllers/page.controller.js";
import { validate } from "../middlewares/validate.js";
import { pageParamsSchema } from "../validators/pages.schema.js";

export const pageRoutes = Router();

/**
 * @openapi
 * /api/v1/pages:
 *   get:
 *     tags:
 *       - Pages
 *     operationId: listPublishedPages
 *     summary: List all published pages
 *     description: Returns metadata for every published page. Section content is not included.
 *     security: []
 *     responses:
 *       200:
 *         description: List of published pages
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
 *                         pages:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Page'
 */
pageRoutes.get("/", listPublishedPagesHandler);

/**
 * @openapi
 * /api/v1/pages/{slug}:
 *   get:
 *     tags:
 *       - Pages
 *     operationId: getPublishedPage
 *     summary: Get a published page with its sections
 *     description: Returns a published page by slug together with its ordered sections. Draft content is never exposed here.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Page slug, e.g. "home"
 *     responses:
 *       200:
 *         description: Published page with sections
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PageWithSections'
 *       404:
 *         description: Page not found or not published
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid slug parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
pageRoutes.get("/:slug", validate(pageParamsSchema, "params"), getPublishedPageHandler);
