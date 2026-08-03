import { Router } from "express";
import { listActivityHandler } from "../controllers/activity.controller.js";
import {
  deleteMediaHandler,
  listMediaHandler,
  uploadMediaHandler,
} from "../controllers/media.controller.js";
import {
  createPageHandler,
  deletePageHandler,
  getPageAdminHandler,
  getVersionHandler,
  listPagesAdminHandler,
  listVersionsHandler,
  previewPageHandler,
  publishPageHandler,
  rollbackPageHandler,
  updatePageHandler,
} from "../controllers/page.controller.js";
import {
  addSectionHandler,
  deleteSectionHandler,
  listSectionsHandler,
  listTemplatesHandler,
  reorderSectionsHandler,
  updateSectionHandler,
} from "../controllers/section.controller.js";
import {
  listAllSettingsHandler,
  updateSettingHandler,
} from "../controllers/settings.controller.js";
import {
  replaceNavigationHandler,
} from "../controllers/navigation.controller.js";
import {
  updateGlobalSeoHandler,
  updatePageSeoHandler,
} from "../controllers/seo.controller.js";
import { uploadSingle } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import {
  createPageSchema,
  idParamsSchema,
  updatePageSchema,
  versionParamsSchema,
} from "../validators/pages.schema.js";
import {
  createSectionSchema,
  reorderSectionsSchema,
  sectionPageParamsSchema,
  updateSectionSchema,
} from "../validators/sections.schema.js";
import {
  replaceNavigationSchema,
} from "../validators/navigation.schema.js";
import {
  settingKeyParamsSchema,
  updateSettingSchema,
} from "../validators/settings.schema.js";
import {
  updateGlobalSeoSchema,
  updatePageSeoSchema,
} from "../validators/seo.schema.js";
import { adminAnnouncementsRoutes } from "./announcements.routes.js";
import { adminEventsRoutes } from "./events.routes.js";
import { adminGalleryRoutes } from "./gallery.routes.js";
import { adminSermonsRoutes } from "./sermons.routes.js";

export const adminRoutes = Router();

/**
 * @openapi
 * /api/v1/admin/templates:
 *   get:
 *     tags:
 *       - Admin
 *     operationId: listSectionTemplates
 *     summary: List section templates
 *     description: Returns the active section templates the admin can drop onto a page, including their JSON content schemas.
 *     responses:
 *       200:
 *         description: List of section templates
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
 *                         templates:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/SectionTemplate'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get("/templates", listTemplatesHandler);

/**
 * @openapi
 * /api/v1/admin/pages:
 *   get:
 *     tags:
 *       - Admin / Pages
 *     operationId: listPagesAdmin
 *     summary: List all pages
 *     description: Returns every page (draft and published) with metadata.
 *     responses:
 *       200:
 *         description: List of pages
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
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get("/pages", listPagesAdminHandler);

/**
 * @openapi
 * /api/v1/admin/pages:
 *   post:
 *     tags:
 *       - Admin / Pages
 *     operationId: createPage
 *     summary: Create a page
 *     description: Creates a new page in draft state.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/pages_createPageSchema'
 *     responses:
 *       201:
 *         description: Page created
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
 *                         page:
 *                           $ref: '#/components/schemas/Page'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       409:
 *         description: A page with this slug already exists
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
adminRoutes.post("/pages", validate(createPageSchema), createPageHandler);

/**
 * @openapi
 * /api/v1/admin/pages/{id}:
 *   get:
 *     tags:
 *       - Admin / Pages
 *     operationId: getPageAdmin
 *     summary: Get a page with its sections
 *     description: Returns a page (draft or published) with its sections in display order.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     responses:
 *       200:
 *         description: Page with sections
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PageWithSections'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid page id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get("/pages/:id", validate(idParamsSchema, "params"), getPageAdminHandler);

/**
 * @openapi
 * /api/v1/admin/pages/{id}:
 *   patch:
 *     tags:
 *       - Admin / Pages
 *     operationId: updatePage
 *     summary: Update a page
 *     description: Updates the slug and/or title of a page.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/pages_updatePageSchema'
 *     responses:
 *       200:
 *         description: Page updated
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
 *                         page:
 *                           $ref: '#/components/schemas/Page'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       409:
 *         description: A page with this slug already exists
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
adminRoutes.patch(
  "/pages/:id",
  validate(idParamsSchema, "params"),
  validate(updatePageSchema),
  updatePageHandler
);

/**
 * @openapi
 * /api/v1/admin/pages/{id}:
 *   delete:
 *     tags:
 *       - Admin / Pages
 *     operationId: deletePage
 *     summary: Delete a page
 *     description: Permanently deletes a page and its sections.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     responses:
 *       204:
 *         description: Page deleted
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.delete(
  "/pages/:id",
  validate(idParamsSchema, "params"),
  deletePageHandler
);

/**
 * @openapi
 * /api/v1/admin/pages/{id}/preview:
 *   get:
 *     tags:
 *       - Admin / Publishing
 *     operationId: previewPage
 *     summary: Preview a page draft
 *     description: Returns the current draft sections of a page for preview purposes.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     responses:
 *       200:
 *         description: Draft page with sections
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PageWithSections'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get(
  "/pages/:id/preview",
  validate(idParamsSchema, "params"),
  previewPageHandler
);

/**
 * @openapi
 * /api/v1/admin/pages/{id}/publish:
 *   post:
 *     tags:
 *       - Admin / Publishing
 *     operationId: publishPage
 *     summary: Publish a page
 *     description: Snapshots the page and its current sections into an immutable version and marks the page as published. Triggers on-demand revalidation of the public site when configured.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     responses:
 *       200:
 *         description: Page published
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       required: [page, sections, version]
 *                       properties:
 *                         page:
 *                           $ref: '#/components/schemas/Page'
 *                         sections:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Section'
 *                         version:
 *                           type: object
 *                           required: [id, number]
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             number:
 *                               type: integer
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.post(
  "/pages/:id/publish",
  validate(idParamsSchema, "params"),
  publishPageHandler
);

/**
 * @openapi
 * /api/v1/admin/pages/{id}/rollback/{versionId}:
 *   post:
 *     tags:
 *       - Admin / Publishing
 *     operationId: rollbackPage
 *     summary: Roll back a page to a previous version
 *     description: Restores a page and its sections from an immutable version snapshot, creates a new version, and re-publishes.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *       - in: path
 *         name: versionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Version UUID to restore
 *     responses:
 *       200:
 *         description: Page rolled back and re-published
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       required: [page, sections, version]
 *                       properties:
 *                         page:
 *                           $ref: '#/components/schemas/Page'
 *                         sections:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Section'
 *                         version:
 *                           type: object
 *                           required: [id, number]
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             number:
 *                               type: integer
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page or version not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Invalid id or versionId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.post(
  "/pages/:id/rollback/:versionId",
  validate(versionParamsSchema, "params"),
  rollbackPageHandler
);

/**
 * @openapi
 * /api/v1/admin/pages/{id}/versions:
 *   get:
 *     tags:
 *       - Admin / Publishing
 *     operationId: listVersions
 *     summary: List page versions
 *     description: Returns the immutable version history for a page, newest first.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     responses:
 *       200:
 *         description: List of versions
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
 *                         versions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Version'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get(
  "/pages/:id/versions",
  validate(idParamsSchema, "params"),
  listVersionsHandler
);

/**
 * @openapi
 * /api/v1/admin/pages/{pageId}/sections:
 *   get:
 *     tags:
 *       - Admin / Sections
 *     operationId: listSections
 *     summary: List a page's sections
 *     description: Returns the sections of a page ordered by display order.
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     responses:
 *       200:
 *         description: List of sections
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
 *                         sections:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Section'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get(
  "/pages/:pageId/sections",
  validate(sectionPageParamsSchema, "params"),
  listSectionsHandler
);

/**
 * @openapi
 * /api/v1/admin/pages/{pageId}/sections:
 *   post:
 *     tags:
 *       - Admin / Sections
 *     operationId: addSection
 *     summary: Add a section to a page
 *     description: Adds a new section to the end of a page. The content must validate against the chosen template's schema.
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sections_createSectionSchema'
 *     responses:
 *       201:
 *         description: Section added
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
 *                         section:
 *                           $ref: '#/components/schemas/Section'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Validation failed (unknown template or content does not match the template schema)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.post(
  "/pages/:pageId/sections",
  validate(sectionPageParamsSchema, "params"),
  validate(createSectionSchema),
  addSectionHandler
);

/**
 * @openapi
 * /api/v1/admin/pages/{pageId}/sections/order:
 *   put:
 *     tags:
 *       - Admin / Sections
 *     operationId: reorderSections
 *     summary: Reorder a page's sections
 *     description: Sets the display order of all sections on a page. Every section id must be provided exactly once.
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sections_reorderSectionsSchema'
 *     responses:
 *       200:
 *         description: Sections reordered
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
 *                         sections:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Section'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
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
adminRoutes.put(
  "/pages/:pageId/sections/order",
  validate(sectionPageParamsSchema, "params"),
  validate(reorderSectionsSchema),
  reorderSectionsHandler
);

/**
 * @openapi
 * /api/v1/admin/sections/{id}:
 *   patch:
 *     tags:
 *       - Admin / Sections
 *     operationId: updateSection
 *     summary: Update a section
 *     description: Updates a section's content, layout, and/or label. Content is validated against the section's template schema.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Section UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sections_updateSectionSchema'
 *     responses:
 *       200:
 *         description: Section updated
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
 *                         section:
 *                           $ref: '#/components/schemas/Section'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Section not found
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
adminRoutes.patch(
  "/sections/:id",
  validate(idParamsSchema, "params"),
  validate(updateSectionSchema),
  updateSectionHandler
);

/**
 * @openapi
 * /api/v1/admin/sections/{id}:
 *   delete:
 *     tags:
 *       - Admin / Sections
 *     operationId: deleteSection
 *     summary: Delete a section
 *     description: Permanently removes a section from its page.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Section UUID
 *     responses:
 *       204:
 *         description: Section deleted
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.delete(
  "/sections/:id",
  validate(idParamsSchema, "params"),
  deleteSectionHandler
);

/**
 * @openapi
 * /api/v1/admin/versions/{versionId}:
 *   get:
 *     tags:
 *       - Admin / Publishing
 *     operationId: getVersion
 *     summary: Get a single version snapshot
 *     description: Returns a specific immutable version including its full snapshot.
 *     parameters:
 *       - in: path
 *         name: versionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Version UUID
 *     responses:
 *       200:
 *         description: Version snapshot
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
 *                         version:
 *                           $ref: '#/components/schemas/Version'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Version not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get("/versions/:versionId", getVersionHandler);

/**
 * @openapi
 * /api/v1/admin/activity:
 *   get:
 *     tags:
 *       - Admin
 *     operationId: listActivity
 *     summary: List admin activity log
 *     description: Returns the paginated activity log (logins, page/section changes, publishes, rollbacks, settings updates).
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: Paginated activity log
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActivityEntry'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get("/activity", listActivityHandler);

/**
 * @openapi
 * /api/v1/admin/settings:
 *   get:
 *     tags:
 *       - Admin / Settings
 *     operationId: listAllSettings
 *     summary: List all settings
 *     description: Returns every setting row (public and internal) managed by the admin.
 *     responses:
 *       200:
 *         description: List of settings
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
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get("/settings", listAllSettingsHandler);

/**
 * @openapi
 * /api/v1/admin/settings/{key}:
 *   put:
 *     tags:
 *       - Admin / Settings
 *     operationId: updateSetting
 *     summary: Create or update a setting
 *     description: Upserts a setting by key. The key prefix determines its public group (e.g. "site_", "contact_", "social_", "service_times", "announcement").
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Setting key, e.g. "site_name" or "contact_email"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/settings_updateSettingSchema'
 *           examples:
 *             exampleSetting:
 *               summary: Set the site name
 *               value:
 *                 value:
 *                   brand: TECIM
 *     responses:
 *       200:
 *         description: Setting updated
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
 *                         setting:
 *                           $ref: '#/components/schemas/Setting'
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
adminRoutes.put(
  "/settings/:key",
  validate(settingKeyParamsSchema, "params"),
  validate(updateSettingSchema),
  updateSettingHandler
);

/**
 * @openapi
 * /api/v1/admin/navigation:
 *   put:
 *     tags:
 *       - Admin / Navigation
 *     operationId: replaceNavigation
 *     summary: Replace the navigation tree
 *     description: Replaces the entire navigation with the provided ordered items. Provide an empty array to clear it.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/navigation_replaceNavigationSchema'
 *     responses:
 *       200:
 *         description: Navigation replaced
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
 *                         navigation:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/NavItem'
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
adminRoutes.put("/navigation", validate(replaceNavigationSchema), replaceNavigationHandler);

/**
 * @openapi
 * /api/v1/admin/seo:
 *   put:
 *     tags:
 *       - Admin / SEO
 *     operationId: updateGlobalSeo
 *     summary: Update global SEO settings
 *     description: Upserts the global SEO defaults. Only provided fields are updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/seo_updateGlobalSeoSchema'
 *     responses:
 *       200:
 *         description: Global SEO updated
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
adminRoutes.put("/seo", validate(updateGlobalSeoSchema), updateGlobalSeoHandler);

/**
 * @openapi
 * /api/v1/admin/seo/pages/{pageId}:
 *   put:
 *     tags:
 *       - Admin / SEO
 *     operationId: updatePageSeo
 *     summary: Update SEO settings for a page
 *     description: Upserts page-specific SEO settings. Only provided fields are updated.
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Page UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/seo_updatePageSeoSchema'
 *     responses:
 *       200:
 *         description: Page SEO updated
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
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       404:
 *         description: Page not found
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
adminRoutes.put(
  "/seo/pages/:pageId",
  validate(sectionPageParamsSchema, "params"),
  validate(updatePageSeoSchema),
  updatePageSeoHandler
);

/**
 * @openapi
 * /api/v1/admin/media:
 *   get:
 *     tags:
 *       - Admin / Media
 *     operationId: listMedia
 *     summary: List the media library
 *     description: Returns paginated media records (newest first).
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: Paginated media list
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Media'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.get("/media", listMediaHandler);

/**
 * @openapi
 * /api/v1/admin/media/upload:
 *   post:
 *     tags:
 *       - Admin / Media
 *     operationId: uploadMedia
 *     summary: Upload a media asset
 *     description: Uploads an image or video to Cloudinary and stores its metadata. Multipart form with a "file" field (max 10MB). Derives all metadata from the Cloudinary response — client-supplied URLs are never trusted.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image or video file (jpeg, png, webp, gif, svg, mp4, webm, mov)
 *               alt:
 *                 type: string
 *                 description: Optional accessibility alt text
 *     responses:
 *       201:
 *         description: Media uploaded
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
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       422:
 *         description: Unsupported file type or file too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       500:
 *         description: Cloudinary is not configured or the upload failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.post("/media/upload", uploadSingle("file"), uploadMediaHandler);

/**
 * @openapi
 * /api/v1/admin/media/{id}:
 *   delete:
 *     tags:
 *       - Admin / Media
 *     operationId: deleteMedia
 *     summary: Delete a media asset
 *     description: Removes the asset from Cloudinary (when configured) and deletes the media record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Media UUID
 *     responses:
 *       204:
 *         description: Media deleted
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
 *         description: Invalid media id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
adminRoutes.delete(
  "/media/:id",
  validate(idParamsSchema, "params"),
  deleteMediaHandler
);

adminRoutes.use("/events", adminEventsRoutes);
adminRoutes.use("/gallery", adminGalleryRoutes);
adminRoutes.use("/sermons", adminSermonsRoutes);
adminRoutes.use("/announcements", adminAnnouncementsRoutes);
