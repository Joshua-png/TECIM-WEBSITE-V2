import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { authEmailLimiter, authIpLimiter } from "../middlewares/rateLimit.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, logoutSchema, refreshSchema } from "../validators/auth.schema.js";

export const authRoutes = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     operationId: login
 *     summary: Log in as the admin
 *     description: Validates admin credentials and returns a short-lived access token and a rotating refresh token. Rate-limited per IP and per email.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth_loginSchema'
 *           examples:
 *             validLogin:
 *               summary: Valid admin login
 *               value:
 *                 email: admin@tecim.org
 *                 password: changeme123
 *     responses:
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       required: [tokens, user]
 *                       properties:
 *                         tokens:
 *                           $ref: '#/components/schemas/TokenPair'
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
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
 *       429:
 *         description: Too many login attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
authRoutes.post(
  "/login",
  authIpLimiter,
  authEmailLimiter,
  validate(loginSchema),
  loginHandler
);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     operationId: refresh
 *     summary: Rotate a refresh token
 *     description: Issues a new access token and refresh token from a valid refresh token. The presented refresh token is blacklisted and cannot be reused.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth_refreshSchema'
 *     responses:
 *       200:
 *         description: Tokens rotated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TokenPair'
 *       401:
 *         description: Invalid, expired, or already-used refresh token
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
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
authRoutes.post("/refresh", authIpLimiter, validate(refreshSchema), refreshHandler);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     operationId: logout
 *     summary: Log out and blacklist the refresh token
 *     description: Blacklists the presented refresh token so it can no longer be used to obtain new tokens. Requires a valid access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth_logoutSchema'
 *     responses:
 *       204:
 *         description: Logged out successfully
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
authRoutes.post("/logout", authIpLimiter, validate(logoutSchema), logoutHandler);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     operationId: me
 *     summary: Get the current admin profile
 *     description: Returns the profile of the authenticated admin. Requires a valid access token.
 *     responses:
 *       200:
 *         description: Current admin profile
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
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 */
authRoutes.get("/me", requireAuth, meHandler);
