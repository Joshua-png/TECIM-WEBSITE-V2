import * as activityRepo from "../repositories/activity.repo.js";
import * as pageRepo from "../repositories/page.repo.js";
import * as sectionRepo from "../repositories/section.repo.js";
import { ConflictError, NotFoundError } from "../utils/ApiError.js";

export interface PageWithSections {
  page: pageRepo.PageRow;
  sections: sectionRepo.SectionRow[];
}

async function assertPageExists(id: string): Promise<pageRepo.PageRow> {
  const page = await pageRepo.findById(id);
  if (!page) {
    throw new NotFoundError("Page not found");
  }
  return page;
}

export async function getPageWithSections(id: string): Promise<PageWithSections> {
  const page = await assertPageExists(id);
  const sections = await sectionRepo.findByPage(id);
  return { page, sections };
}

export async function getPublishedPageBySlug(
  slug: string
): Promise<PageWithSections> {
  const page = await pageRepo.findBySlug(slug);
  if (!page || page.status !== "published") {
    throw new NotFoundError("Page not found");
  }
  const sections = await sectionRepo.findByPage(page.id);
  return { page, sections };
}

export async function listPages(): Promise<pageRepo.PageRow[]> {
  return pageRepo.findAll();
}

export async function listPublishedPages(): Promise<pageRepo.PageRow[]> {
  return pageRepo.findAllPublished();
}

export async function createPage(
  data: { slug: string; title: string },
  actor: { id: string; ip?: string | null }
): Promise<pageRepo.PageRow> {
  const existing = await pageRepo.findBySlug(data.slug);
  if (existing) {
    throw new ConflictError(`A page with slug "${data.slug}" already exists`);
  }
  const page = await pageRepo.create(data);
  await activityRepo.create({
    userId: actor.id,
    action: "create",
    entityType: "page",
    entityId: page.id,
    details: { slug: page.slug, title: page.title },
    ip: actor.ip ?? null,
  });
  return page;
}

export async function updatePage(
  id: string,
  data: { slug?: string; title?: string },
  actor: { id: string; ip?: string | null }
): Promise<pageRepo.PageRow> {
  await assertPageExists(id);
  if (data.slug !== undefined) {
    const existing = await pageRepo.findBySlug(data.slug);
    if (existing && existing.id !== id) {
      throw new ConflictError(`A page with slug "${data.slug}" already exists`);
    }
  }
  const page = await pageRepo.updateMeta(id, data);
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "page",
    entityId: id,
    details: { ...data },
    ip: actor.ip ?? null,
  });
  return page;
}

export async function deletePage(
  id: string,
  actor: { id: string; ip?: string | null }
): Promise<void> {
  await assertPageExists(id);
  await pageRepo.remove(id);
  await activityRepo.create({
    userId: actor.id,
    action: "delete",
    entityType: "page",
    entityId: id,
    ip: actor.ip ?? null,
  });
}
