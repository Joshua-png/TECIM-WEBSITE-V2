import * as activityRepo from "../repositories/activity.repo.js";
import * as pageRepo from "../repositories/page.repo.js";
import * as seoRepo from "../repositories/seo.repo.js";
import { NotFoundError } from "../utils/ApiError.js";

export async function getGlobal(): Promise<seoRepo.SeoRow | null> {
  return seoRepo.getGlobal();
}

export async function getByPageSlug(slug: string): Promise<seoRepo.SeoRow> {
  const page = await pageRepo.findBySlug(slug);
  if (!page || page.status !== "published") {
    throw new NotFoundError("Page not found");
  }
  const seo = await seoRepo.getByPageId(page.id);
  if (!seo) {
    throw new NotFoundError("No SEO record for this page");
  }
  return seo;
}

export async function updateGlobal(
  fields: seoRepo.SeoFields,
  actor: { id: string; ip?: string | null }
): Promise<seoRepo.SeoRow> {
  const seo = await seoRepo.upsertGlobal(fields);
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "seo",
    details: { scope: "global" },
    ip: actor.ip ?? null,
  });
  return seo;
}

export async function updateForPage(
  pageId: string,
  fields: seoRepo.SeoFields,
  actor: { id: string; ip?: string | null }
): Promise<seoRepo.SeoRow> {
  const page = await pageRepo.findById(pageId);
  if (!page) {
    throw new NotFoundError("Page not found");
  }
  const seo = await seoRepo.upsertForPage(pageId, fields);
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "seo",
    entityId: pageId,
    details: { scope: "page" },
    ip: actor.ip ?? null,
  });
  return seo;
}
