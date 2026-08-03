import * as activityRepo from "../repositories/activity.repo.js";
import * as mediaRepo from "../repositories/media.repo.js";
import * as sermonsRepo from "../repositories/sermons.repo.js";
import { NotFoundError } from "../utils/ApiError.js";

interface Actor {
  id: string;
  ip?: string | null;
}

export interface SermonInput {
  title: string;
  speaker?: string | null;
  description?: string | null;
  mediaUrl?: string | null;
  imageMediaId?: string | null;
  datePreached?: string | null;
  status?: "draft" | "published" | null;
}

export async function listPublished(): Promise<sermonsRepo.SermonRow[]> {
  return sermonsRepo.findPublished();
}

export async function listAll(): Promise<sermonsRepo.SermonRow[]> {
  return sermonsRepo.findAll();
}

export async function getById(id: string): Promise<sermonsRepo.SermonRow> {
  const sermon = await sermonsRepo.findById(id);
  if (!sermon) {
    throw new NotFoundError("Sermon not found");
  }
  return sermon;
}

export async function create(input: SermonInput, actor: Actor): Promise<sermonsRepo.SermonRow> {
  if (input.imageMediaId) {
    const media = await mediaRepo.findById(input.imageMediaId);
    if (!media) {
      throw new NotFoundError("Media not found");
    }
  }
  const sermon = await sermonsRepo.create({
    title: input.title,
    speaker: input.speaker ?? null,
    description: input.description ?? null,
    mediaUrl: input.mediaUrl ?? null,
    imageMediaId: input.imageMediaId ?? null,
    datePreached: input.datePreached ?? null,
    status: input.status ?? "draft",
  });
  await activityRepo.create({
    userId: actor.id,
    action: "create",
    entityType: "sermon",
    entityId: sermon.id,
    details: { title: sermon.title },
    ip: actor.ip ?? null,
  });
  return sermon;
}

export async function update(
  id: string,
  input: Partial<SermonInput>,
  actor: Actor
): Promise<sermonsRepo.SermonRow> {
  await getById(id);
  if (input.imageMediaId) {
    const media = await mediaRepo.findById(input.imageMediaId);
    if (!media) {
      throw new NotFoundError("Media not found");
    }
  }
  const sermon = await sermonsRepo.update(id, { ...input, status: input.status ?? undefined });
  if (!sermon) {
    throw new NotFoundError("Sermon not found");
  }
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "sermon",
    entityId: id,
    details: { title: sermon.title },
    ip: actor.ip ?? null,
  });
  return sermon;
}

export async function remove(id: string, actor: Actor): Promise<void> {
  await getById(id);
  await sermonsRepo.remove(id);
  await activityRepo.create({
    userId: actor.id,
    action: "delete",
    entityType: "sermon",
    entityId: id,
    ip: actor.ip ?? null,
  });
}
