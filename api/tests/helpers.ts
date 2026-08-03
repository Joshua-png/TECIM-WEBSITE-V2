import bcrypt from "bcryptjs";
import request from "supertest";
import type { Express } from "express";
import { sectionTemplates } from "../src/config/templates.js";
import * as seoRepo from "../src/repositories/seo.repo.js";
import * as templateRepo from "../src/repositories/template.repo.js";
import * as userRepo from "../src/repositories/user.repo.js";

export function adminCredentials(): { email: string; password: string } {
  return { email: "admin@tecim.org", password: "changeme123" };
}

export async function ensureTestData(): Promise<void> {
  const { email } = adminCredentials();
  const existing = await userRepo.findByEmail(email);
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminCredentials().password, 12);
    await userRepo.createUser({ email, passwordHash, name: "Site Admin" });
  }
  for (const template of sectionTemplates) {
    await templateRepo.upsert({
      slug: template.slug,
      name: template.name,
      description: template.description,
      schema: template.schema,
      componentName: template.componentName,
    });
  }
  await seoRepo.upsertGlobal({ metaTitle: "TECIM", metaDescription: "Cinematic site" });
}

export async function loginAdmin(app: Express): Promise<string> {
  const { email, password } = adminCredentials();
  const res = await request(app).post("/api/v1/auth/login").send({ email, password });
  if (res.status !== 201) {
    throw new Error(`login failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return (res.body.data as { tokens: { accessToken: string } }).tokens.accessToken;
}
