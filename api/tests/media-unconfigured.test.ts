import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { pool } from "../src/config/db.js";
import { resetRateLimits } from "../src/middlewares/rateLimit.js";
import { ensureTestData, loginAdmin } from "./helpers.js";

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

describe("media upload with Cloudinary unconfigured", () => {
  it("returns 500 instead of crashing", async () => {
    const res = await request(app)
      .post("/api/v1/admin/media/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("fake-image-bytes"), {
        filename: "test.png",
        contentType: "image/png",
      });
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INTERNAL");
  });
});
