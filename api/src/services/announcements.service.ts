import * as activityRepo from "../repositories/activity.repo.js";
import * as announcementsRepo from "../repositories/announcements.repo.js";
import { NotFoundError } from "../utils/ApiError.js";

interface Actor {
  id: string;
  ip?: string | null;
}

export interface AnnouncementInput {
  title: string;
  body?: string | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
  activeFrom?: string | null;
  activeUntil?: string | null;
  status?: "draft" | "published" | null;
}

export async function listPublished(): Promise<announcementsRepo.AnnouncementRow[]> {
  return announcementsRepo.findPublished();
}

export async function listAll(): Promise<announcementsRepo.AnnouncementRow[]> {
  return announcementsRepo.findAll();
}

export async function getById(id: string): Promise<announcementsRepo.AnnouncementRow> {
  const announcement = await announcementsRepo.findById(id);
  if (!announcement) {
    throw new NotFoundError("Announcement not found");
  }
  return announcement;
}

export async function create(
  input: AnnouncementInput,
  actor: Actor
): Promise<announcementsRepo.AnnouncementRow> {
  const announcement = await announcementsRepo.create({
    title: input.title,
    body: input.body ?? null,
    linkUrl: input.linkUrl ?? null,
    linkLabel: input.linkLabel ?? null,
    activeFrom: input.activeFrom ?? null,
    activeUntil: input.activeUntil ?? null,
    status: input.status ?? "draft",
  });
  await activityRepo.create({
    userId: actor.id,
    action: "create",
    entityType: "announcement",
    entityId: announcement.id,
    details: { title: announcement.title },
    ip: actor.ip ?? null,
  });
  return announcement;
}

export async function update(
  id: string,
  input: Partial<AnnouncementInput>,
  actor: Actor
): Promise<announcementsRepo.AnnouncementRow> {
  await getById(id);
  const announcement = await announcementsRepo.update(id, {
    ...input,
    status: input.status ?? undefined,
  });
  if (!announcement) {
    throw new NotFoundError("Announcement not found");
  }
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "announcement",
    entityId: id,
    details: { title: announcement.title },
    ip: actor.ip ?? null,
  });
  return announcement;
}

export async function remove(id: string, actor: Actor): Promise<void> {
  await getById(id);
  await announcementsRepo.remove(id);
  await activityRepo.create({
    userId: actor.id,
    action: "delete",
    entityType: "announcement",
    entityId: id,
    ip: actor.ip ?? null,
  });
}
