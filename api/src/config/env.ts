import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

export const env = {
  nodeEnv: optional("NODE_ENV", "development"),
  isProduction: optional("NODE_ENV", "development") === "production",
  port: Number(optional("PORT", "4000")),
  databaseUrl: required("DATABASE_URL"),
  redisUrl: process.env.REDIS_URL?.trim() || null,
  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  accessTokenTtlSeconds: 15 * 60,
  refreshTokenTtlSeconds: 7 * 24 * 60 * 60,
  corsOrigins: optional("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  siteUrl: process.env.SITE_URL?.trim() || null,
  revalidateSecret: process.env.REVALIDATE_SECRET?.trim() || null,
  adminEmail: optional("ADMIN_EMAIL", "admin@tecim.org"),
  adminPassword: optional("ADMIN_PASSWORD", "changeme123"),
  adminName: optional("ADMIN_NAME", "Site Admin"),
} as const;
