import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email required"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Valid email required"),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit code"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Valid email required"),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit code"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(200),
});
