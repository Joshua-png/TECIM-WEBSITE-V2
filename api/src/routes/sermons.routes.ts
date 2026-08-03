import { Router } from "express";
import {
  createSermonHandler,
  deleteSermonHandler,
  getSermonHandler,
  listAllSermonsHandler,
  listPublicSermonsHandler,
  updateSermonHandler,
} from "../controllers/sermons.controller.js";
import { validate } from "../middlewares/validate.js";
import { collectionIdParamsSchema } from "../validators/common.js";
import { createSermonSchema, updateSermonSchema } from "../validators/sermons.schema.js";

export const sermonsPublicRoutes = Router();

/**
 * @openapi
 * /api/v1/sermons:
 *   get:
 *     tags:
 *       - Sermons
 *     operationId: listPublicSermons
 *     summary: List published sermons
 *     description: Returns published sermons, most recently preached first.
 *     responses:
 *       200:
 *         description: Published sermons
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
 *                         sermons:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Sermon'
 */
sermonsPublicRoutes.get("/", listPublicSermonsHandler);

export const adminSermonsRoutes = Router();

/**
 * @openapi
 * /api/v1/admin/sermons:
 *   get:
 *     tags:
 *       - Admin / Sermons
 *     operationId: listAllSermons
 *     summary: List all sermons
 *     description: Returns all sermons (draft and published) for the admin.
 *     responses:
 *       200:
 *         description: All sermons
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
 *                         sermons:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Sermon'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *   post:
 *     tags:
 *       - Admin / Sermons
 *     operationId: createSermon
 *     summary: Create a sermon
 *     description: Creates a sermon as a draft by default.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sermons_createSermonSchema'
 *     responses:
 *       201:
 *         description: Sermon created
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
 *                         sermon:
 *                           $ref: '#/components/schemas/Sermon'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Media not found
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
adminSermonsRoutes.get("/", listAllSermonsHandler);
adminSermonsRoutes.post("/", validate(createSermonSchema), createSermonHandler);

/**
 * @openapi
 * /api/v1/admin/sermons/{id}:
 *   get:
 *     tags:
 *       - Admin / Sermons
 *     operationId: getSermon
 *     summary: Get a single sermon
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Sermon UUID
 *     responses:
 *       200:
 *         description: Sermon
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
 *                         sermon:
 *                           $ref: '#/components/schemas/Sermon'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Sermon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid sermon id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *   patch:
 *     tags:
 *       - Admin / Sermons
 *     operationId: updateSermon
 *     summary: Update a sermon
 *     description: Partial update. Use null to clear nullable fields.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Sermon UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sermons_updateSermonSchema'
 *     responses:
 *       200:
 *         description: Sermon updated
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
 *                         sermon:
 *                           $ref: '#/components/schemas/Sermon'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Sermon not found
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
 *       - Admin / Sermons
 *     operationId: deleteSermon
 *     summary: Delete a sermon
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Sermon UUID
 *     responses:
 *       204:
 *         description: Sermon deleted
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Sermon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid sermon id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminSermonsRoutes.get("/:id", validate(collectionIdParamsSchema, "params"), getSermonHandler);
adminSermonsRoutes.patch(
  "/:id",
  validate(collectionIdParamsSchema, "params"),
  validate(updateSermonSchema),
  updateSermonHandler
);
adminSermonsRoutes.delete(
  "/:id",
  validate(collectionIdParamsSchema, "params"),
  deleteSermonHandler
);
