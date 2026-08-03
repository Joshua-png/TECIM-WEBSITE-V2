import { Ajv } from "ajv";
import * as activityRepo from "../repositories/activity.repo.js";
import * as pageRepo from "../repositories/page.repo.js";
import * as sectionRepo from "../repositories/section.repo.js";
import * as templateRepo from "../repositories/template.repo.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";

const ajv = new Ajv({ allErrors: true, strict: false });

export interface SectionPatch {
  content?: Record<string, unknown>;
  layout?: string;
  label?: string | null;
}

async function assertPageExists(pageId: string): Promise<pageRepo.PageRow> {
  const page = await pageRepo.findById(pageId);
  if (!page) {
    throw new NotFoundError("Page not found");
  }
  return page;
}

async function assertSectionExists(id: string): Promise<sectionRepo.SectionRow> {
  const section = await sectionRepo.findById(id);
  if (!section) {
    throw new NotFoundError("Section not found");
  }
  return section;
}

async function validateContent(
  templateSlug: string,
  content: Record<string, unknown>
): Promise<void> {
  const template = await templateRepo.findBySlug(templateSlug);
  if (!template) {
    throw new ValidationError([
      { field: "template", message: `Unknown template "${templateSlug}"` },
    ]);
  }
  const isValid = ajv.compile(template.schema)(content);
  if (!isValid) {
    const errors = ajv.errors ?? [];
    throw new ValidationError(
      errors.map((error) => ({
        field: `content${error.instancePath || ""}`,
        message: error.message ?? "Invalid content",
      }))
    );
  }
}

export async function listSections(pageId: string): Promise<sectionRepo.SectionRow[]> {
  await assertPageExists(pageId);
  return sectionRepo.findByPage(pageId);
}

export async function addSection(
  pageId: string,
  data: {
    template: string;
    layout: string;
    label: string | null;
    content: Record<string, unknown>;
  },
  actor: { id: string; ip?: string | null }
): Promise<sectionRepo.SectionRow> {
  await assertPageExists(pageId);
  const template = await templateRepo.findBySlug(data.template);
  if (!template) {
    throw new ValidationError([
      { field: "template", message: `Unknown template "${data.template}"` },
    ]);
  }
  await validateContent(data.template, data.content);
  const displayOrder = await sectionRepo.nextDisplayOrder(pageId);
  const section = await sectionRepo.create(pageId, { ...data, displayOrder });
  await activityRepo.create({
    userId: actor.id,
    action: "create",
    entityType: "section",
    entityId: section.id,
    details: { pageId, template: section.template, layout: section.layout },
    ip: actor.ip ?? null,
  });
  return section;
}

export async function updateSection(
  id: string,
  patch: SectionPatch,
  actor: { id: string; ip?: string | null }
): Promise<sectionRepo.SectionRow> {
  const section = await assertSectionExists(id);
  if (patch.content !== undefined) {
    await validateContent(section.template, patch.content);
  }
  const updated = await sectionRepo.update(id, patch);
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "section",
    entityId: id,
    details: { pageId: section.page_id, ...patch },
    ip: actor.ip ?? null,
  });
  return updated;
}

export async function deleteSection(
  id: string,
  actor: { id: string; ip?: string | null }
): Promise<void> {
  const section = await assertSectionExists(id);
  await sectionRepo.deleteById(id);
  await activityRepo.create({
    userId: actor.id,
    action: "delete",
    entityType: "section",
    entityId: id,
    details: { pageId: section.page_id, template: section.template },
    ip: actor.ip ?? null,
  });
}

export async function reorderSections(
  pageId: string,
  sectionIds: string[],
  actor: { id: string; ip?: string | null }
): Promise<sectionRepo.SectionRow[]> {
  await assertPageExists(pageId);
  const existing = await sectionRepo.findByPage(pageId);
  const existingIds = new Set(existing.map((section) => section.id));
  if (sectionIds.length !== existingIds.size) {
    throw new ValidationError([
      {
        field: "sectionIds",
        message: "Every section of the page must be provided exactly once",
      },
    ]);
  }
  for (const sectionId of sectionIds) {
    if (!existingIds.has(sectionId)) {
      throw new ValidationError([
        { field: "sectionIds", message: `Section ${sectionId} does not belong to this page` },
      ]);
    }
  }
  for (let index = 0; index < sectionIds.length; index += 1) {
    await sectionRepo.setDisplayOrder(sectionIds[index], index);
  }
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "page",
    entityId: pageId,
    details: { sectionIds },
    ip: actor.ip ?? null,
  });
  return sectionRepo.findByPage(pageId);
}
