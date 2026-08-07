import bcrypt from "bcryptjs";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { pool } from "../src/config/db.js";
import { resetRateLimits } from "../src/middlewares/rateLimit.js";
import * as userRepo from "../src/repositories/user.repo.js";
import { storeOtp } from "../src/utils/otp.js";
import { adminCredentials, ensureTestData, loginAdmin } from "./helpers.js";

const ADMIN_EMAIL = adminCredentials().email;
const ORIGINAL_PASSWORD = adminCredentials().password;

let app: Express;

beforeAll(async () => {
  app = createApp();
  await ensureTestData();
});

afterEach(async () => {
  await resetRateLimits();
});

afterAll(async () => {
  await pool.end();
});

describe("POST /api/v1/auth/forgot-password", () => {
  it("returns 200 for a known email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: ADMIN_EMAIL });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBeTruthy();
  });

  it("returns 200 for an unknown email (no enumeration)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "nobody@tecim.org" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rejects an invalid email with 422", async () => {
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "not-an-email" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("POST /api/v1/auth/verify-otp", () => {
  it("verifies a valid OTP", async () => {
    await storeOtp(ADMIN_EMAIL, "123456");
    const res = await request(app)
      .post("/api/v1/auth/verify-otp")
      .send({ email: ADMIN_EMAIL, otp: "123456" });
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBeTruthy();
  });

  it("rejects a wrong OTP with OTP_INVALID", async () => {
    await storeOtp(ADMIN_EMAIL, "123456");
    const res = await request(app)
      .post("/api/v1/auth/verify-otp")
      .send({ email: ADMIN_EMAIL, otp: "000000" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("OTP_INVALID");
  });

  it("rejects an OTP that was never issued with OTP_EXPIRED", async () => {
    const res = await request(app)
      .post("/api/v1/auth/verify-otp")
      .send({ email: "fresh-email@tecim.org", otp: "123456" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("OTP_EXPIRED");
  });

  it("rejects a malformed OTP with 422", async () => {
    const res = await request(app)
      .post("/api/v1/auth/verify-otp")
      .send({ email: ADMIN_EMAIL, otp: "12ab" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("POST /api/v1/auth/reset-password", () => {
  it("resets the password and allows login with the new one", async () => {
    await storeOtp(ADMIN_EMAIL, "654321");
    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ email: ADMIN_EMAIL, otp: "654321", newPassword: "brandnewpass123" });
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBeTruthy();

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: ADMIN_EMAIL, password: "brandnewpass123" });
    expect(login.status).toBe(201);

    const user = await userRepo.findByEmail(ADMIN_EMAIL);
    expect(user).not.toBeNull();
    if (!user) {
      return;
    }
    await userRepo.updatePassword(user.id, await bcrypt.hash(ORIGINAL_PASSWORD, 12));
  });

  it("cannot reuse the same OTP twice", async () => {
    await storeOtp(ADMIN_EMAIL, "111222");
    const first = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ email: ADMIN_EMAIL, otp: "111222", newPassword: "temp-pass-123" });
    expect(first.status).toBe(200);

    const second = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ email: ADMIN_EMAIL, otp: "111222", newPassword: "another-pass-123" });
    expect(second.status).toBe(400);
    expect(second.body.error.code).toBe("OTP_EXPIRED");

    const user = await userRepo.findByEmail(ADMIN_EMAIL);
    expect(user).not.toBeNull();
    if (!user) {
      return;
    }
    await userRepo.updatePassword(user.id, await bcrypt.hash(ORIGINAL_PASSWORD, 12));
  });

  it("rejects a wrong OTP with OTP_INVALID", async () => {
    await storeOtp(ADMIN_EMAIL, "123456");
    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ email: ADMIN_EMAIL, otp: "999999", newPassword: "brandnewpass123" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("OTP_INVALID");
  });

  it("rejects a short password with 422", async () => {
    await storeOtp(ADMIN_EMAIL, "123456");
    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ email: ADMIN_EMAIL, otp: "123456", newPassword: "short" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("POST /api/v1/auth/change-password", () => {
  it("requires a valid access token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/change-password")
      .send({ currentPassword: ORIGINAL_PASSWORD, newPassword: "brandnewpass123" });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("changes the password and allows login with the new one", async () => {
    const token = await loginAdmin(app);
    const res = await request(app)
      .post("/api/v1/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: ORIGINAL_PASSWORD, newPassword: "brandnewpass123" });
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBeTruthy();

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: ADMIN_EMAIL, password: "brandnewpass123" });
    expect(login.status).toBe(201);

    const user = await userRepo.findByEmail(ADMIN_EMAIL);
    expect(user).not.toBeNull();
    if (!user) {
      return;
    }
    await userRepo.updatePassword(user.id, await bcrypt.hash(ORIGINAL_PASSWORD, 12));
  });

  it("rejects a wrong current password with 401", async () => {
    const token = await loginAdmin(app);
    const res = await request(app)
      .post("/api/v1/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "wrongpassword", newPassword: "brandnewpass123" });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects a short new password with 422", async () => {
    const token = await loginAdmin(app);
    const res = await request(app)
      .post("/api/v1/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: ORIGINAL_PASSWORD, newPassword: "short" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
