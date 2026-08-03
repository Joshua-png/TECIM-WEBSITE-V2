import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendCreated, sendNoContent, sendSuccess } from "../utils/ApiResponse.js";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
} from "../validators/auth.schema.js";
import type { z } from "zod";

type LoginBody = z.infer<typeof loginSchema>;
type TokenBody = z.infer<typeof refreshSchema> & z.infer<typeof logoutSchema>;

export const loginHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginBody;
    const result = await authService.login(email, password, req.ip ?? null);
    sendCreated(res, result);
  }
);

export const refreshHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body as TokenBody;
    const tokens = await authService.refresh(refreshToken, req.ip ?? null);
    sendSuccess(res, tokens);
  }
);

export const logoutHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body as TokenBody;
    await authService.logout(refreshToken, req.user?.id ?? null, req.ip ?? null);
    sendNoContent(res);
  }
);

export const meHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await authService.getMe(requireUser(req).id);
    sendSuccess(res, { user });
  }
);
