import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { pool } from "../src/config/db.js";
import { ensureTestData, loginAdmin } from "./helpers.js";

let app: Express;
let token: string;

beforeAll(async () => {
  app = createApp();
  await ensureTestData();
  token = await loginAdmin(app);
});

afterAll(async () => {
  await pool.end();
});

const heroContent = {
  label: "Welcome",
  title: "Test Hero",
  subtitle: "A subtitle",
  identities: [
    {
      slug: "light",
      label: "Light",
      backgroundImage: "https://example.com/light.jpg",
      steps: [
        {
          num: "01",
          title: "Step one",
          body: "Body text",
          verse: "Verse text",
          image: "https://example.com/step.jpg",
        },
      ],
    },
  ],
};

describe("admin page CRUD", () => {
  it("creates a page", async () => {
    const slug = `page-${randomUUID().slice(0, 8)}`;
    const res = await request(app)
      .post("/api/v1/admin/pages")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug, title: "My Page" });
    expect(res.status).toBe(201);
    expect(res.body.data.page.slug).toBe(slug);
    expect(res.body.data.page.status).toBe("draft");
  });

  it("rejects an invalid slug with 422", async () => {
    const res = await request(app)
      .post("/api/v1/admin/pages")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug: "BAD SLUG", title: "Bad" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("requires auth", async () => {
    const res = await request(app).post("/api/v1/admin/pages").send({ slug: "x", title: "X" });
    expect(res.status).toBe(401);
  });
});

describe("section CRUD on a page", () => {
  it("adds, lists, updates, reorders and deletes sections", async () => {
    const pageId = randomUUID();
    const created = await request(app)
      .post("/api/v1/admin/pages")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug: `sections-${pageId}`, title: "Sections" });
    expect(created.status).toBe(201);
    const id = (created.body.data.page as { id: string }).id;

    const add1 = await request(app)
      .post(`/api/v1/admin/pages/${id}/sections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ template: "hero", layout: "default", label: "Hero", content: heroContent });
    expect(add1.status).toBe(201);
    const section1 = add1.body.data.section as { id: string; display_order: number };

    const add2 = await request(app)
      .post(`/api/v1/admin/pages/${id}/sections`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        template: "contact",
        label: "Contact",
        content: {
          label: "Contact",
          title: "Get in touch",
          sub: "Reach us",
          email: "hello@tecim.org",
          locations: [{ name: "Accra", query: "Accra, Ghana" }],
        },
      });
    expect(add2.status).toBe(201);
    expect(add2.body.data.section.display_order).toBe(1);

    const list = await request(app)
      .get(`/api/v1/admin/pages/${id}/sections`)
      .set("Authorization", `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.data.sections).toHaveLength(2);

    const update = await request(app)
      .patch(`/api/v1/admin/sections/${section1.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ label: "Hero updated", content: { ...heroContent, title: "New title" } });
    expect(update.status).toBe(200);
    expect(update.body.data.section.label).toBe("Hero updated");

    const invalidContent = await request(app)
      .patch(`/api/v1/admin/sections/${section1.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: { headline: 42 } });
    expect(invalidContent.status).toBe(422);
    expect(invalidContent.body.error.code).toBe("VALIDATION_ERROR");

    const reorder = await request(app)
      .put(`/api/v1/admin/pages/${id}/sections/order`)
      .set("Authorization", `Bearer ${token}`)
      .send({ sectionIds: [add2.body.data.section.id as string, section1.id] });
    expect(reorder.status).toBe(200);
    expect(reorder.body.data.sections[0].display_order).toBe(0);
    expect(reorder.body.data.sections[0].template).toBe("contact");

    const del = await request(app)
      .delete(`/api/v1/admin/sections/${section1.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(del.status).toBe(204);
  });

  it("rejects unknown template", async () => {
    const pageId = randomUUID();
    const created = await request(app)
      .post("/api/v1/admin/pages")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug: `bad-template-${pageId}`, title: "Bad template" });
    const id = (created.body.data.page as { id: string }).id;
    const res = await request(app)
      .post(`/api/v1/admin/pages/${id}/sections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ template: "does_not_exist", content: {} });
    expect(res.status).toBe(422);
  });
});

describe("template registry", () => {
  it("lists active templates", async () => {
    const res = await request(app)
      .get("/api/v1/admin/templates")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    const templates = res.body.data.templates as Array<{ slug: string }>;
    expect(templates.some((t) => t.slug === "hero")).toBe(true);
    expect(templates.some((t) => t.slug === "gallery")).toBe(true);
  });
});

describe("public pages", () => {
  it("returns 404 for unpublished pages", async () => {
    const pageId = randomUUID();
    await request(app)
      .post("/api/v1/admin/pages")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug: `draft-${pageId}`, title: "Draft only" });
    const res = await request(app).get(`/api/v1/pages/draft-${pageId}`);
    expect(res.status).toBe(404);
  });
});
