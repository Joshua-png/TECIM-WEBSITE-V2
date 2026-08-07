import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import * as activityRepo from "../repositories/activity.repo.js";
import * as passwordResetRepo from "../repositories/passwordReset.repo.js";
import * as userRepo from "../repositories/user.repo.js";
import { UnauthorizedError } from "../utils/ApiError.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendOtpEmail } from "../utils/mailer.js";
import { generateOtp, storeOtp, verifyStoredOtp } from "../utils/otp.js";
import { getStore } from "../utils/store.js";

const REFRESH_BLACKLIST_PREFIX = "refresh:blacklist:";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function toAuthUser(
  user: Pick<userRepo.UserRow, "id" | "email" | "name" | "role">
): AuthUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function issueTokens(user: AuthUser): TokenPair {
  const jti = crypto.randomUUID();
  const refreshToken = signRefreshToken(user.id, jti);
  return { accessToken: signAccessToken(user), refreshToken };
}

export async function login(
  email: string,
  password: string,
  ip: string | null
): Promise<{ tokens: TokenPair; user: AuthUser }> {
  const user = await userRepo.findByEmail(email.toLowerCase().trim());
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new UnauthorizedError("Invalid credentials");
  }
  await userRepo.updateLastLogin(user.id);
  await activityRepo.create({
    userId: user.id,
    action: "login",
    entityType: "auth",
    ip,
  });
  const authUser = toAuthUser(user);
  return { tokens: issueTokens(authUser), user: authUser };
}

export async function refresh(
  refreshToken: string,
  ip: string | null
): Promise<TokenPair> {
  const payload = verifyRefreshToken(refreshToken);
  const store = getStore();
  const blacklistKey = `${REFRESH_BLACKLIST_PREFIX}${payload.jti}`;
  const revoked = await store.get(blacklistKey);
  if (revoked !== null) {
    throw new UnauthorizedError("Refresh token has been revoked");
  }
  const user = await userRepo.findById(payload.sub);
  if (!user) {
    throw new UnauthorizedError("User no longer exists");
  }
  await store.set(blacklistKey, "1", env.refreshTokenTtlSeconds);
  await activityRepo.create({
    userId: user.id,
    action: "refresh",
    entityType: "auth",
    ip,
  });
  return issueTokens(toAuthUser(user));
}

export async function logout(
  refreshToken: string,
  userId: string | null,
  ip: string | null
): Promise<void> {
  const payload = verifyRefreshToken(refreshToken);
  const store = getStore();
  await store.set(
    `${REFRESH_BLACKLIST_PREFIX}${payload.jti}`,
    "1",
    env.refreshTokenTtlSeconds
  );
  await activityRepo.create({
    userId,
    action: "logout",
    entityType: "auth",
    ip,
  });
}

export async function getMe(userId: string): Promise<AuthUser> {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new UnauthorizedError("User not found");
  }
  return toAuthUser(user);
}

export async function forgotPassword(email: string, ip: string | null): Promise<void> {
  const normalized = email.toLowerCase().trim();
  const user = await userRepo.findByEmail(normalized);
  if (!user) {
    return;
  }
  const otp = generateOtp();
  await storeOtp(normalized, otp);
  await passwordResetRepo.recordRequest(user.id, ip);
  await sendOtpEmail(user.email, otp);
}

export async function verifyOtp(email: string, otp: string): Promise<void> {
  await verifyStoredOtp(email.toLowerCase().trim(), otp);
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string,
  ip: string | null
): Promise<void> {
  const normalized = email.toLowerCase().trim();
  await verifyStoredOtp(normalized, otp);
  const user = await userRepo.findByEmail(normalized);
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await userRepo.updatePassword(user.id, passwordHash);
  await passwordResetRepo.markResolved(user.id);
  await activityRepo.create({
    userId: user.id,
    action: "password_reset",
    entityType: "auth",
    ip,
  });
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
  ip: string | null
): Promise<void> {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new UnauthorizedError("User not found");
  }
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    throw new UnauthorizedError("Current password is incorrect");
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await userRepo.updatePassword(user.id, passwordHash);
  await activityRepo.create({
    userId: user.id,
    action: "password_change",
    entityType: "auth",
    ip,
  });
}
