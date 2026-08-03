import { Router } from "express";
import { getNavigationTreeHandler } from "../controllers/navigation.controller.js";

export const navigationRoutes = Router();

/**
 * @openapi
 * /api/v1/navigation:
 *   get:
 *     tags:
 *       - Navigation
 *     operationId: getNavigationTree
 *     summary: Get the navigation tree
 *     description: Returns the ordered navigation tree including nested children. Only active items are returned.
 *     security: []
 *     responses:
 *       200:
 *         description: Navigation tree
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
 */
navigationRoutes.get("/", getNavigationTreeHandler);
