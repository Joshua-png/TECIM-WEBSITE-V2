import { Request, Response } from "express";
import { requireUser } from "../middlewares/auth.js";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendCreated, sendNoContent, sendSuccess } from "../utils/ApiResponse.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../validators/auth.schema.js";
import type { z } from "zod";

type LoginBody = z.infer<typeof loginSchema>;
type TokenBody = z.infer<typeof refreshSchema> & z.infer<typeof logoutSchema>;
type OtpBody = z.infer<typeof verifyOtpSchema>;
type ResetBody = z.infer<typeof resetPasswordSchema>;
type ChangePasswordBody = z.infer<typeof changePasswordSchema>;

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

export const forgotPasswordHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body as z.infer<typeof forgotPasswordSchema>;
    await authService.forgotPassword(email, req.ip ?? null);
    sendSuccess(res, { message: "If that email exists, a reset code has been sent." });
  }
);

export const verifyOtpHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body as OtpBody;
    await authService.verifyOtp(email, otp);
    sendSuccess(res, { message: "OTP verified" });
  }
);

export const resetPasswordHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, otp, newPassword } = req.body as ResetBody;
    await authService.resetPassword(email, otp, newPassword, req.ip ?? null);
    sendSuccess(res, { message: "Password has been reset. You can now log in." });
  }
);

export const changePasswordHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body as ChangePasswordBody;
    await authService.changePassword(
      requireUser(req).id,
      currentPassword,
      newPassword,
      req.ip ?? null
    );
    sendSuccess(res, { message: "Password updated." });
  }
);
