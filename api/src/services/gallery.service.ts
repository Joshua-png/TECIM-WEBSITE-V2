import * as activityRepo from "../repositories/activity.repo.js";
import * as galleryRepo from "../repositories/gallery.repo.js";
import * as mediaRepo from "../repositories/media.repo.js";
import { NotFoundError } from "../utils/ApiError.js";

interface Actor {
  id: string;
  ip?: string | null;
}

export interface GalleryItemInput {
  mediaId: string;
  caption?: string | null;
  altText?: string | null;
  displayOrder?: number | null;
  isFeatured?: boolean | null;
  status?: "draft" | "published" | null;
}

export async function listPublished(): Promise<galleryRepo.GalleryRow[]> {
  return galleryRepo.findPublished();
}

export async function listAll(): Promise<galleryRepo.GalleryRow[]> {
  return galleryRepo.findAll();
}

export async function getById(id: string): Promise<galleryRepo.GalleryRow> {
  const item = await galleryRepo.findById(id);
  if (!item) {
    throw new NotFoundError("Gallery item not found");
  }
  return item;
}

export async function create(
  input: GalleryItemInput,
  actor: Actor
): Promise<galleryRepo.GalleryRow> {
  const media = await mediaRepo.findById(input.mediaId);
  if (!media) {
    throw new NotFoundError("Media not found");
  }
  const item = await galleryRepo.create({
    mediaId: input.mediaId,
    caption: input.caption ?? null,
    altText: input.altText ?? null,
    displayOrder: input.displayOrder ?? (await galleryRepo.nextDisplayOrder()),
    isFeatured: input.isFeatured ?? false,
    status: input.status ?? "draft",
  });
  await activityRepo.create({
    userId: actor.id,
    action: "create",
    entityType: "gallery",
    entityId: item.id,
    details: { mediaId: item.media_id },
    ip: actor.ip ?? null,
  });
  return item;
}

export async function update(
  id: string,
  input: Partial<GalleryItemInput>,
  actor: Actor
): Promise<galleryRepo.GalleryRow> {
  await getById(id);
  if (input.mediaId) {
    const media = await mediaRepo.findById(input.mediaId);
    if (!media) {
      throw new NotFoundError("Media not found");
    }
  }
  const item = await galleryRepo.update(id, { ...input, status: input.status ?? undefined });
  if (!item) {
    throw new NotFoundError("Gallery item not found");
  }
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "gallery",
    entityId: id,
    ip: actor.ip ?? null,
  });
  return item;
}

export async function remove(id: string, actor: Actor): Promise<void> {
  await getById(id);
  await galleryRepo.remove(id);
  await activityRepo.create({
    userId: actor.id,
    action: "delete",
    entityType: "gallery",
    entityId: id,
    ip: actor.ip ?? null,
  });
}
