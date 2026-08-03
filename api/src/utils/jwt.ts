import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "./ApiError.js";

export interface AccessPayload {
  sub: string;
  email: string;
  role: string;
  type: "access";
}

export interface RefreshPayload {
  sub: string;
  type: "refresh";
  jti: string;
}

interface TokenUser {
  id: string;
  email: string;
  role: string;
}

export function signAccessToken(user: TokenUser): string {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, type: "access" },
    env.jwtAccessSecret,
    { expiresIn: env.accessTokenTtlSeconds }
  );
}

export function signRefreshToken(userId: string, jti: string): string {
  return jwt.sign({ sub: userId, type: "refresh", jti }, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenTtlSeconds,
  });
}

export function verifyAccessToken(token: string): AccessPayload {
  try {
    return jwt.verify(token, env.jwtAccessSecret) as AccessPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }
}

export function verifyRefreshToken(token: string): RefreshPayload {
  try {
    return jwt.verify(token, env.jwtRefreshSecret) as RefreshPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
}
