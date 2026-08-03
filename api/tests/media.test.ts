import { PassThrough } from "node:stream";
import { randomUUID } from "node:crypto";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { pool } from "../src/config/db.js";
import { resetRateLimits } from "../src/middlewares/rateLimit.js";
import { ensureTestData, loginAdmin } from "./helpers.js";

const mocks = vi.hoisted(() => ({
  upload_stream: vi.fn(),
  destroy: vi.fn(),
}));

vi.mock("../src/config/cloudinary.js", () => ({
  isCloudinaryConfigured: () => true,
  getCloudinary: () => ({
    uploader: {
      upload_stream: mocks.upload_stream,
      destroy: mocks.destroy,
    },
  }),
}));

let app: Express;
let token: string;

beforeAll(async () => {
  app = createApp();
  await ensureTestData();
  token = await loginAdmin(app);
});

afterEach(async () => {
  await resetRateLimits();
  mocks.upload_stream.mockReset();
  mocks.destroy.mockReset();
});

afterAll(async () => {
  await pool.end();
});

function stubUploadResult() {
  mocks.upload_stream.mockImplementation(
    (_options: unknown, callback: (err: Error | null, result?: unknown) => void) => {
      const publicId = `tecim/site/test-image-${randomUUID()}`;
      const stream = new PassThrough();
      callback(null, {
        public_id: publicId,
        secure_url: `https://res.cloudinary.com/demo/image/upload/v1/${publicId}.jpg`,
        width: 800,
        height: 600,
        format: "jpg",
        bytes: 2048,
        folder: "tecim/site",
        resource_type: "image",
      });
      return stream;
    }
  );
  mocks.destroy.mockResolvedValue({ result: "ok" });
}

describe("POST /api/v1/admin/media/upload", () => {
  it("uploads an image and stores its metadata", async () => {
    stubUploadResult();
    const res = await request(app)
      .post("/api/v1/admin/media/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("fake-image-bytes"), {
        filename: "test.jpg",
        contentType: "image/jpeg",
      })
      .field("alt", "Test image alt");
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.media).toMatchObject({
      publicId: expect.stringMatching(/^tecim\/site\/test-image-/),
      secureUrl: expect.stringContaining("cloudinary.com"),
      resourceType: "image",
      width: 800,
      height: 600,
      sizeBytes: 2048,
      altText: "Test image alt",
    });
    expect(mocks.upload_stream).toHaveBeenCalledTimes(1);
  });

  it("rejects an unsupported file type with 422", async () => {
    stubUploadResult();
    const res = await request(app)
      .post("/api/v1/admin/media/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("fake"), {
        filename: "evil.exe",
        contentType: "application/x-msdownload",
      });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/v1/admin/media", () => {
  it("lists media with the paginated envelope", async () => {
    stubUploadResult();
    await request(app)
      .post("/api/v1/admin/media/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("fake-image-bytes"), {
        filename: "test.jpg",
        contentType: "image/jpeg",
      });
    const res = await request(app)
      .get("/api/v1/admin/media")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toMatchObject({ page: 1, perPage: 20, total: expect.any(Number) });
    expect(res.body.data[0]).toHaveProperty("publicId");
  });

  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/v1/admin/media");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });
});

describe("GET /api/v1/media/:id (public)", () => {
  it("returns a single media record", async () => {
    stubUploadResult();
    const created = await request(app)
      .post("/api/v1/admin/media/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("fake-image-bytes"), {
        filename: "test.jpg",
        contentType: "image/jpeg",
      });
    const id = (created.body.data.media as { id: string }).id;
    const res = await request(app).get(`/api/v1/media/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.media.id).toBe(id);
  });

  it("returns 404 for an unknown media id", async () => {
    const res = await request(app).get(`/api/v1/media/${randomUUID()}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("DELETE /api/v1/admin/media/:id", () => {
  it("deletes the media record and destroys the remote asset", async () => {
    stubUploadResult();
    const created = await request(app)
      .post("/api/v1/admin/media/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("fake-image-bytes"), {
        filename: "test.jpg",
        contentType: "image/jpeg",
      });
    const id = (created.body.data.media as { id: string }).id;
    const publicId = (created.body.data.media as { publicId: string }).publicId;
    const res = await request(app)
      .delete(`/api/v1/admin/media/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
    expect(mocks.destroy).toHaveBeenCalledWith(publicId, {
      resource_type: "image",
    });
    const gone = await request(app).get(`/api/v1/media/${id}`);
    expect(gone.status).toBe(404);
  });

  it("returns 404 when deleting an unknown media id", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/media/${randomUUID()}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});
