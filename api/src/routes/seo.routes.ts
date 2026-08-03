import { Router } from "express";
import {
  getGlobalSeoHandler,
  getPageSeoHandler,
} from "../controllers/seo.controller.js";
import { validate } from "../middlewares/validate.js";
import { pageParamsSchema } from "../validators/pages.schema.js";

export const seoRoutes = Router();

/**
 * @openapi
 * /api/v1/seo:
 *   get:
 *     tags:
 *       - SEO
 *     operationId: getGlobalSeo
 *     summary: Get global SEO settings
 *     description: Returns the global SEO defaults (meta title, meta description, canonical URL, OG image).
 *     security: []
 *     responses:
 *       200:
 *         description: Global SEO settings
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
 *                         seo:
 *                           $ref: '#/components/schemas/Seo'
 */
seoRoutes.get("/", getGlobalSeoHandler);

/**
 * @openapi
 * /api/v1/seo/pages/{slug}:
 *   get:
 *     tags:
 *       - SEO
 *     operationId: getPageSeo
 *     summary: Get SEO settings for a published page
 *     description: Returns the page-specific SEO settings for a published page identified by slug.
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
 *         description: Page SEO settings
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
 *                         seo:
 *                           $ref: '#/components/schemas/Seo'
 *       404:
 *         description: Page not found, not published, or has no SEO record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
seoRoutes.get("/pages/:slug", validate(pageParamsSchema, "params"), getPageSeoHandler);
