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

describe("public settings / navigation / seo", () => {
  it("returns public settings", async () => {
    const res = await request(app).get("/api/v1/settings");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.settings)).toBe(true);
  });

  it("returns the navigation tree", async () => {
    const res = await request(app).get("/api/v1/navigation");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.navigation)).toBe(true);
  });

  it("returns global seo", async () => {
    const res = await request(app).get("/api/v1/seo");
    expect(res.status).toBe(200);
    expect(res.body.data.seo.metaTitle).toBe("TECIM");
  });
});

describe("admin settings / navigation / seo mutations", () => {
  it("updates a setting and reads it publicly", async () => {
    const key = `site_name_${randomUUID().slice(0, 6)}`;
    const put = await request(app)
      .put(`/api/v1/admin/settings/${key}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ value: { brand: "TECIM" } });
    expect(put.status).toBe(200);
    expect(put.body.data.setting.key).toBe(key);
    const res = await request(app).get("/api/v1/settings");
    const rows = res.body.data.settings as Array<{ key: string; value: Record<string, string> }>;
    expect(rows.find((r) => r.key === key)?.value.brand).toBe("TECIM");
  });

  it("replaces the navigation tree", async () => {
    const put = await request(app)
      .put("/api/v1/admin/navigation")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [
          { label: "Home", url: "/", displayOrder: 1, isActive: true },
          { label: "About", url: "/about", displayOrder: 2, isActive: true },
        ],
      });
    expect(put.status).toBe(200);
    expect(put.body.data.navigation).toHaveLength(2);
    const res = await request(app).get("/api/v1/navigation");
    expect(res.body.data.navigation.map((n: { label: string }) => n.label)).toEqual([
      "Home",
      "About",
    ]);
  });

  it("updates global seo", async () => {
    const put = await request(app)
      .put("/api/v1/admin/seo")
      .set("Authorization", `Bearer ${token}`)
      .send({ metaTitle: "TECIM — Home", metaDescription: "A cinematic church site" });
    expect(put.status).toBe(200);
    expect(put.body.data.seo.metaTitle).toBe("TECIM — Home");
    const res = await request(app).get("/api/v1/seo");
    expect(res.body.data.seo.metaTitle).toBe("TECIM — Home");
  });
});

describe("activity log", () => {
  it("records login activity and lists it", async () => {
    const res = await request(app)
      .get("/api/v1/admin/activity")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.total).toBeGreaterThan(0);
  });
});
