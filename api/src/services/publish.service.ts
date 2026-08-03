import { env } from "../config/env.js";
import * as activityRepo from "../repositories/activity.repo.js";
import * as pageRepo from "../repositories/page.repo.js";
import * as sectionRepo from "../repositories/section.repo.js";
import * as versionRepo from "../repositories/version.repo.js";
import { NotFoundError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export interface PageSnapshot {
  page: { slug: string; title: string };
  sections: Array<{
    template: string;
    layout: string;
    label: string | null;
    content: Record<string, unknown>;
    display_order: number;
  }>;
}

interface Actor {
  id: string;
  ip?: string | null;
}

async function assertPageExists(id: string): Promise<pageRepo.PageRow> {
  const page = await pageRepo.findById(id);
  if (!page) {
    throw new NotFoundError("Page not found");
  }
  return page;
}

function buildSnapshot(
  page: pageRepo.PageRow,
  sections: sectionRepo.SectionRow[]
): PageSnapshot {
  return {
    page: { slug: page.slug, title: page.title },
    sections: sections.map((section) => ({
      template: section.template,
      layout: section.layout,
      label: section.label,
      content: section.content,
      display_order: section.display_order,
    })),
  };
}

async function triggerRevalidation(slug: string): Promise<void> {
  if (!env.siteUrl || !env.revalidateSecret) {
    logger.warn(`Revalidation skipped for "${slug}" (SITE_URL/REVALIDATE_SECRET not set)`);
    return;
  }
  const url = `${env.siteUrl.replace(/\/+$/, "")}/api/revalidate`;
  try {
    const response = await fetch(
      `${url}?secret=${encodeURIComponent(env.revalidateSecret)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: ["/", `/${slug}`] }),
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!response.ok) {
      logger.warn(`Revalidation returned HTTP ${response.status} for "${slug}"`);
    }
  } catch (err) {
    logger.warn(`Revalidation request failed for "${slug}"`, err);
  }
}

export async function preview(
  pageId: string
): Promise<{ page: pageRepo.PageRow; sections: sectionRepo.SectionRow[] }> {
  const page = await assertPageExists(pageId);
  const sections = await sectionRepo.findByPage(pageId);
  return { page, sections };
}

export async function publish(
  pageId: string,
  actor: Actor
): Promise<{
  page: pageRepo.PageRow;
  sections: sectionRepo.SectionRow[];
  version: { id: string; number: number };
}> {
  const page = await assertPageExists(pageId);
  const sections = await sectionRepo.findByPage(pageId);
  const snapshot = buildSnapshot(page, sections);
  const version = await versionRepo.create({
    pageId,
    snapshot,
    createdBy: actor.id,
  });
  await pageRepo.setPublished(pageId, version.id);
  await sectionRepo.setPublishedByPage(pageId, version.id);
  await activityRepo.create({
    userId: actor.id,
    action: "publish",
    entityType: "page",
    entityId: pageId,
    details: { versionNumber: version.number },
    ip: actor.ip ?? null,
  });
  await triggerRevalidation(page.slug);
  return {
    page: (await pageRepo.findById(pageId)) as pageRepo.PageRow,
    sections: await sectionRepo.findByPage(pageId),
    version: { id: version.id, number: version.number },
  };
}

export async function rollback(
  pageId: string,
  versionId: string,
  actor: Actor
): Promise<{
  page: pageRepo.PageRow;
  sections: sectionRepo.SectionRow[];
  version: { id: string; number: number };
}> {
  await assertPageExists(pageId);
  const version = await versionRepo.findById(versionId);
  if (!version || version.page_id !== pageId) {
    throw new NotFoundError("Version not found");
  }
  const snapshot = version.snapshot as unknown as PageSnapshot;
  await pageRepo.updateMeta(pageId, {
    slug: snapshot.page.slug,
    title: snapshot.page.title,
  });
  await sectionRepo.deleteByPage(pageId);
  for (const section of snapshot.sections) {
    await sectionRepo.create(pageId, {
      template: section.template,
      layout: section.layout,
      label: section.label,
      content: section.content,
      displayOrder: section.display_order,
    });
  }
  const newVersion = await versionRepo.create({
    pageId,
    snapshot,
    createdBy: actor.id,
  });
  await pageRepo.setPublished(pageId, newVersion.id);
  await sectionRepo.setPublishedByPage(pageId, newVersion.id);
  await activityRepo.create({
    userId: actor.id,
    action: "rollback",
    entityType: "page",
    entityId: pageId,
    details: { fromVersion: version.number, toVersion: newVersion.number },
    ip: actor.ip ?? null,
  });
  await triggerRevalidation(snapshot.page.slug);
  return {
    page: (await pageRepo.findById(pageId)) as pageRepo.PageRow,
    sections: await sectionRepo.findByPage(pageId),
    version: { id: newVersion.id, number: newVersion.number },
  };
}

export async function listVersions(pageId: string): Promise<versionRepo.VersionRow[]> {
  await assertPageExists(pageId);
  return versionRepo.listByPage(pageId);
}

export async function getVersion(versionId: string): Promise<versionRepo.VersionRow> {
  const version = await versionRepo.findById(versionId);
  if (!version) {
    throw new NotFoundError("Version not found");
  }
  return version;
}
