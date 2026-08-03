import { Router } from "express";
import {
  createGalleryItemHandler,
  deleteGalleryItemHandler,
  getGalleryItemHandler,
  listAllGalleryHandler,
  listPublicGalleryHandler,
  updateGalleryItemHandler,
} from "../controllers/gallery.controller.js";
import { validate } from "../middlewares/validate.js";
import { collectionIdParamsSchema } from "../validators/common.js";
import {
  createGalleryItemSchema,
  updateGalleryItemSchema,
} from "../validators/gallery.schema.js";

export const galleryPublicRoutes = Router();

/**
 * @openapi
 * /api/v1/gallery:
 *   get:
 *     tags:
 *       - Gallery
 *     operationId: listPublicGallery
 *     summary: List published gallery items
 *     description: Returns published gallery items, featured first, then by display order.
 *     responses:
 *       200:
 *         description: Published gallery items
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
 *                         gallery:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/GalleryItem'
 */
galleryPublicRoutes.get("/", listPublicGalleryHandler);

export const adminGalleryRoutes = Router();

/**
 * @openapi
 * /api/v1/admin/gallery:
 *   get:
 *     tags:
 *       - Admin / Gallery
 *     operationId: listAllGallery
 *     summary: List all gallery items
 *     description: Returns all gallery items (draft and published) for the admin.
 *     responses:
 *       200:
 *         description: All gallery items
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
 *                         gallery:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/GalleryItem'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *   post:
 *     tags:
 *       - Admin / Gallery
 *     operationId: createGalleryItem
 *     summary: Add an item to the gallery
 *     description: Adds a media asset to the gallery. Defaults to the next display order and draft status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/gallery_createGalleryItemSchema'
 *     responses:
 *       201:
 *         description: Gallery item created
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
 *                         galleryItem:
 *                           $ref: '#/components/schemas/GalleryItem'
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
adminGalleryRoutes.get("/", listAllGalleryHandler);
adminGalleryRoutes.post("/", validate(createGalleryItemSchema), createGalleryItemHandler);

/**
 * @openapi
 * /api/v1/admin/gallery/{id}:
 *   get:
 *     tags:
 *       - Admin / Gallery
 *     operationId: getGalleryItem
 *     summary: Get a single gallery item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gallery item UUID
 *     responses:
 *       200:
 *         description: Gallery item
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
 *                         galleryItem:
 *                           $ref: '#/components/schemas/GalleryItem'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Gallery item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid gallery item id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *   patch:
 *     tags:
 *       - Admin / Gallery
 *     operationId: updateGalleryItem
 *     summary: Update a gallery item
 *     description: Partial update. Use null to clear nullable fields.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gallery item UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/gallery_updateGalleryItemSchema'
 *     responses:
 *       200:
 *         description: Gallery item updated
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
 *                         galleryItem:
 *                           $ref: '#/components/schemas/GalleryItem'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Gallery item not found
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
 *       - Admin / Gallery
 *     operationId: deleteGalleryItem
 *     summary: Delete a gallery item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gallery item UUID
 *     responses:
 *       204:
 *         description: Gallery item deleted
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Gallery item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid gallery item id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminGalleryRoutes.get("/:id", validate(collectionIdParamsSchema, "params"), getGalleryItemHandler);
adminGalleryRoutes.patch(
  "/:id",
  validate(collectionIdParamsSchema, "params"),
  validate(updateGalleryItemSchema),
  updateGalleryItemHandler
);
adminGalleryRoutes.delete(
  "/:id",
  validate(collectionIdParamsSchema, "params"),
  deleteGalleryItemHandler
);
