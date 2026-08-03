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

async function createPageWithSection(slug: string): Promise<string> {
  const created = await request(app)
    .post("/api/v1/admin/pages")
    .set("Authorization", `Bearer ${token}`)
    .send({ slug, title: "Publish me" });
  const id = (created.body.data.page as { id: string }).id;
  const add = await request(app)
    .post(`/api/v1/admin/pages/${id}/sections`)
    .set("Authorization", `Bearer ${token}`)
    .send({ template: "hero", label: "Hero", content: heroContent });
  expect(add.status).toBe(201);
  return id;
}

describe("preview / publish / rollback", () => {
  it("publishes a page and exposes it publicly", async () => {
    const slug = `publish-${randomUUID().slice(0, 8)}`;
    const id = await createPageWithSection(slug);

    const preview = await request(app)
      .get(`/api/v1/admin/pages/${id}/preview`)
      .set("Authorization", `Bearer ${token}`);
    expect(preview.status).toBe(200);
    expect(preview.body.data.sections).toHaveLength(1);

    const pub = await request(app)
      .post(`/api/v1/admin/pages/${id}/publish`)
      .set("Authorization", `Bearer ${token}`);
    expect(pub.status).toBe(200);
    expect(pub.body.data.version.number).toBe(1);
    expect(pub.body.data.page.status).toBe("published");

    const pub2 = await request(app)
      .post(`/api/v1/admin/pages/${id}/publish`)
      .set("Authorization", `Bearer ${token}`);
    expect(pub2.body.data.version.number).toBe(2);

    const publicPage = await request(app).get(`/api/v1/pages/${slug}`);
    expect(publicPage.status).toBe(200);
    expect(publicPage.body.data.page.slug).toBe(slug);
    expect(publicPage.body.data.sections).toHaveLength(1);
    expect(publicPage.body.data.sections[0].content.title).toBe("Test Hero");
  });

  it("rolls back to version 1", async () => {
    const slug = `rollback-${randomUUID().slice(0, 8)}`;
    const id = await createPageWithSection(slug);

    const v1 = await request(app)
      .post(`/api/v1/admin/pages/${id}/publish`)
      .set("Authorization", `Bearer ${token}`);
    const v1Id = (v1.body.data.version as { id: string }).id;

    const update = await request(app)
      .patch(`/api/v1/admin/sections/${(await request(app).get(`/api/v1/admin/pages/${id}/sections`).set("Authorization", `Bearer ${token}`)).body.data.sections[0].id as string}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: { ...heroContent, title: "Changed title" } });
    expect(update.status).toBe(200);

    const v2 = await request(app)
      .post(`/api/v1/admin/pages/${id}/publish`)
      .set("Authorization", `Bearer ${token}`);
    expect(v2.body.data.version.number).toBe(2);

    const versions = await request(app)
      .get(`/api/v1/admin/pages/${id}/versions`)
      .set("Authorization", `Bearer ${token}`);
    expect(versions.status).toBe(200);
    expect(versions.body.data.versions).toHaveLength(2);

    const rollback = await request(app)
      .post(`/api/v1/admin/pages/${id}/rollback/${v1Id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(rollback.status).toBe(200);
    expect(rollback.body.data.page.status).toBe("published");
    expect(rollback.body.data.sections[0].content.title).toBe("Test Hero");

    const publicPage = await request(app).get(`/api/v1/pages/${slug}`);
    expect(publicPage.body.data.sections[0].content.title).toBe("Test Hero");
  });

  it("rejects rolling back to a version of another page", async () => {
    const id = await createPageWithSection(`other-${randomUUID().slice(0, 8)}`);
    const other = await createPageWithSection(`mine-${randomUUID().slice(0, 8)}`);
    const pub = await request(app)
      .post(`/api/v1/admin/pages/${id}/publish`)
      .set("Authorization", `Bearer ${token}`);
    const versionId = (pub.body.data.version as { id: string }).id;
    const res = await request(app)
      .post(`/api/v1/admin/pages/${other}/rollback/${versionId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});
