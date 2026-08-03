import { randomUUID } from "node:crypto";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { pool } from "../src/config/db.js";
import { resetRateLimits } from "../src/middlewares/rateLimit.js";
import { adminCredentials, ensureTestData, loginAdmin } from "./helpers.js";

let app: Express;
let token: string;

beforeAll(async () => {
  app = createApp();
  await ensureTestData();
  token = await loginAdmin(app);
});

afterEach(async () => {
  await resetRateLimits();
});

afterAll(async () => {
  await pool.end();
});

describe("GET /api/v1/health", () => {
  it("returns 200 with ok status", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, data: { status: "ok" } });
  });
});

describe("POST /api/v1/auth/login", () => {
  it("rejects unknown email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nobody@tecim.org", password: "wrongpass" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: adminCredentials().email, password: "wrongpass" });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects invalid body with 422", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "not-an-email" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("logs in and returns access + refresh tokens", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(adminCredentials());
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeTruthy();
    expect(res.body.data.tokens.refreshToken).toBeTruthy();
    expect(res.body.data.user).toMatchObject({ email: adminCredentials().email, role: "admin" });
  });
});

describe("POST /api/v1/auth/refresh", () => {
  it("rotates a valid refresh token", async () => {
    const loginRes = await request(app).post("/api/v1/auth/login").send(adminCredentials());
    const refreshToken = loginRes.body.data.tokens.refreshToken as string;
    const res = await request(app).post("/api/v1/auth/refresh").send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.refreshToken).toBeTruthy();
    expect(res.body.data.refreshToken).not.toBe(refreshToken);
  });

  it("rejects a malformed token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: "not-a-real-token" });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects a token used twice (rotated)", async () => {
    const loginRes = await request(app).post("/api/v1/auth/login").send(adminCredentials());
    const refreshToken = loginRes.body.data.tokens.refreshToken as string;
    const first = await request(app).post("/api/v1/auth/refresh").send({ refreshToken });
    expect(first.status).toBe(200);
    const second = await request(app).post("/api/v1/auth/refresh").send({ refreshToken });
    expect(second.status).toBe(401);
    expect(second.body.error.code).toBe("UNAUTHORIZED");
  });
});

describe("GET /api/v1/auth/me", () => {
  it("returns the admin profile with a valid token", async () => {
    const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(adminCredentials().email);
  });

  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 with an invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid.token.here");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/v1/auth/logout", () => {
  it("blacklists the refresh token", async () => {
    const loginRes = await request(app).post("/api/v1/auth/login").send(adminCredentials());
    const refreshToken = loginRes.body.data.tokens.refreshToken as string;
    const out = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });
    expect(out.status).toBe(204);
    const reuse = await request(app).post("/api/v1/auth/refresh").send({ refreshToken });
    expect(reuse.status).toBe(401);
  });
});

describe("unknown route", () => {
  it("returns the not-found envelope", async () => {
    const res = await request(app).get("/api/v1/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("unique slug constraint", () => {
  it("rejects duplicate slugs", async () => {
    const pageId = randomUUID();
    const create = await request(app)
      .post("/api/v1/admin/pages")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug: `dup-${pageId}`, title: "Duplicate" });
    expect(create.status).toBe(201);
    const again = await request(app)
      .post("/api/v1/admin/pages")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug: `dup-${pageId}`, title: "Duplicate again" });
    expect(again.status).toBe(409);
    expect(again.body.error.code).toBe("CONFLICT");
  });
});
