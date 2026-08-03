import { Router } from "express";
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  resetPasswordHandler,
  verifyOtpHandler,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { authEmailLimiter, authIpLimiter } from "../middlewares/rateLimit.js";
import { validate } from "../middlewares/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../validators/auth.schema.js";

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
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     operationId: forgotPassword
 *     summary: Request a password reset code
 *     description: Generates a 6-digit OTP, stores it in Redis for 5 minutes, sends it via SendGrid, and records an audit row. Always returns 200 so email existence cannot be enumerated.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth_forgotPasswordSchema'
 *     responses:
 *       200:
 *         description: Reset code requested (or no such account)
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
 *                         message:
 *                           type: string
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
authRoutes.post(
  "/forgot-password",
  authIpLimiter,
  authEmailLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordHandler
);

/**
 * @openapi
 * /api/v1/auth/verify-otp:
 *   post:
 *     tags:
 *       - Auth
 *     operationId: verifyOtp
 *     summary: Verify a password reset OTP
 *     description: Confirms the OTP is valid and not expired. The OTP remains valid for the reset-password step. Failed attempts are rate-limited and the code is invalidated after too many tries.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth_verifyOtpSchema'
 *     responses:
 *       200:
 *         description: OTP verified
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
 *                         message:
 *                           type: string
 *       400:
 *         description: OTP invalid or expired
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
authRoutes.post("/verify-otp", authIpLimiter, validate(verifyOtpSchema), verifyOtpHandler);

/**
 * @openapi
 * /api/v1/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     operationId: resetPassword
 *     summary: Reset the admin password with an OTP
 *     description: Verifies the OTP (single-use), hashes the new password (bcrypt cost 12), marks the reset audit row resolved, and invalidates the code.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth_resetPasswordSchema'
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                         message:
 *                           type: string
 *       400:
 *         description: OTP invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorEnvelope'
 *       401:
 *         description: Account no longer exists
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
authRoutes.post(
  "/reset-password",
  authIpLimiter,
  authEmailLimiter,
  validate(resetPasswordSchema),
  resetPasswordHandler
);

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
