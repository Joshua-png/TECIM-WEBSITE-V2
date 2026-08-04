import { randomUUID } from "node:crypto";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { pool } from "../src/config/db.js";
import { resetRateLimits } from "../src/middlewares/rateLimit.js";
import * as mediaRepo from "../src/repositories/media.repo.js";
import { ensureTestData, loginAdmin } from "./helpers.js";

let app: Express;
let token: string;
let mediaId: string;

beforeAll(async () => {
  app = createApp();
  await ensureTestData();
  token = await loginAdmin(app);
  const media = await mediaRepo.create({
    publicId: `tecim/site/test-gallery-${randomUUID()}`,
    secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/tecim/site/test-gallery.jpg",
    width: 800,
    height: 600,
    format: "jpg",
    resourceType: "image",
    sizeBytes: 2048,
    folder: "tecim/site",
    altText: "Test gallery image",
  });
  mediaId = media.id;
});

afterEach(async () => {
  await resetRateLimits();
});

afterAll(async () => {
  await pool.end();
});

describe("events CRUD", () => {
  it("creates an event as a draft with an auto-generated slug", async () => {
    const res = await request(app)
      .post("/api/v1/admin/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Spring Conference", startAt: "2026-05-01T09:00:00.000Z" });
    expect(res.status).toBe(201);
    expect(res.body.data.event).toMatchObject({
      title: "Spring Conference",
      status: "draft",
    });
    expect(res.body.data.event.slug).toMatch(/^spring-conference(-\d+)?$/);
  });

  it("publishes an event and exposes it publicly", async () => {
    const startAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const created = await request(app)
      .post("/api/v1/admin/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Public Event",
        startAt,
        location: "Accra",
      });
    const id = (created.body.data.event as { id: string }).id;

    const draftList = await request(app).get("/api/v1/events");
    expect(
      (draftList.body.data.events as Array<{ id: string }>).some((e) => e.id === id)
    ).toBe(false);

    const published = await request(app)
      .patch(`/api/v1/admin/events/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "published" });
    expect(published.status).toBe(200);
    expect(published.body.data.event.status).toBe("published");

    const publicList = await request(app).get("/api/v1/events");
    expect(
      (publicList.body.data.events as Array<{ id: string; title: string }>).some(
        (e) => e.id === id && e.title === "Public Event"
      )
    ).toBe(true);
  });

  it("rejects a duplicate explicit slug with 409", async () => {
    const slug = `conflict-${randomUUID()}`;
    const first = await request(app)
      .post("/api/v1/admin/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "First", slug, startAt: "2026-07-01T09:00:00.000Z" });
    expect(first.status).toBe(201);
    const second = await request(app)
      .post("/api/v1/admin/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Second", slug, startAt: "2026-07-02T09:00:00.000Z" });
    expect(second.status).toBe(409);
    expect(second.body.error.code).toBe("CONFLICT");
  });

  it("rejects an invalid body with 422", async () => {
    const res = await request(app)
      .post("/api/v1/admin/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "No Date" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("deletes an event", async () => {
    const created = await request(app)
      .post("/api/v1/admin/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "To Delete", startAt: "2026-08-01T09:00:00.000Z" });
    const id = (created.body.data.event as { id: string }).id;
    const res = await request(app)
      .delete(`/api/v1/admin/events/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
    const gone = await request(app)
      .get(`/api/v1/admin/events/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(gone.status).toBe(404);
  });
});

describe("gallery CRUD", () => {
  it("creates a gallery item referencing a media asset", async () => {
    const res = await request(app)
      .post("/api/v1/admin/gallery")
      .set("Authorization", `Bearer ${token}`)
      .send({ mediaId, caption: "A moment", altText: "Alt text" });
    expect(res.status).toBe(201);
    expect(res.body.data.galleryItem).toMatchObject({
      mediaId,
      caption: "A moment",
      isFeatured: false,
      status: "draft",
    });
  });

  it("rejects a gallery item with an unknown media id", async () => {
    const res = await request(app)
      .post("/api/v1/admin/gallery")
      .set("Authorization", `Bearer ${token}`)
      .send({ mediaId: "00000000-0000-0000-0000-000000000000" });
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });

  it("only returns published gallery items publicly", async () => {
    const created = await request(app)
      .post("/api/v1/admin/gallery")
      .set("Authorization", `Bearer ${token}`)
      .send({ mediaId, caption: "Featured" });
    const id = (created.body.data.galleryItem as { id: string }).id;
    await request(app)
      .patch(`/api/v1/admin/gallery/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isFeatured: true, status: "published" });
    const publicList = await request(app).get("/api/v1/gallery");
    expect(
      (publicList.body.data.gallery as Array<{ id: string; isFeatured: boolean }>).some(
        (g) => g.id === id && g.isFeatured
      )
    ).toBe(true);
  });
});

describe("sermons CRUD", () => {
  it("creates a published sermon and exposes it publicly", async () => {
    const created = await request(app)
      .post("/api/v1/admin/sermons")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "The Sound of the Trumpet",
        speaker: "Pastor John",
        datePreached: "2026-03-15",
        status: "published",
      });
    expect(created.status).toBe(201);
    expect(created.body.data.sermon.status).toBe("published");

    const publicList = await request(app).get("/api/v1/sermons");
    expect(
      (publicList.body.data.sermons as Array<{ title: string }>).some(
        (s) => s.title === "The Sound of the Trumpet"
      )
    ).toBe(true);
  });

  it("rejects an invalid date with 422", async () => {
    const res = await request(app)
      .post("/api/v1/admin/sermons")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Bad date", datePreached: "not-a-date" });
    expect(res.status).toBe(422);
  });
});

describe("announcements CRUD", () => {
  it("creates an announcement and applies the active window", async () => {
    const created = await request(app)
      .post("/api/v1/admin/announcements")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New Series",
        body: "Join us this month.",
        activeFrom: "2020-01-01T00:00:00.000Z",
        activeUntil: "2030-01-01T00:00:00.000Z",
        status: "published",
      });
    expect(created.status).toBe(201);

    const publicList = await request(app).get("/api/v1/announcements");
    expect(
      (publicList.body.data.announcements as Array<{ title: string }>).some(
        (a) => a.title === "New Series"
      )
    ).toBe(true);
  });

  it("hides announcements outside their active window", async () => {
    const created = await request(app)
      .post("/api/v1/admin/announcements")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Expired",
        activeFrom: "2000-01-01T00:00:00.000Z",
        activeUntil: "2001-01-01T00:00:00.000Z",
        status: "published",
      });
    expect(created.status).toBe(201);
    const publicList = await request(app).get("/api/v1/announcements");
    const items = publicList.body.data.announcements as Array<{ title: string }>;
    expect(items.some((a) => a.title === "Expired")).toBe(false);
  });

  it("deletes an announcement", async () => {
    const created = await request(app)
      .post("/api/v1/admin/announcements")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Remove Me" });
    const id = (created.body.data.announcement as { id: string }).id;
    const res = await request(app)
      .delete(`/api/v1/admin/announcements/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
