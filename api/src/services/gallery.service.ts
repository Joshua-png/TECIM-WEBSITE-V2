import * as activityRepo from "../repositories/activity.repo.js";
import * as galleryRepo from "../repositories/gallery.repo.js";
import * as mediaRepo from "../repositories/media.repo.js";
import { NotFoundError } from "../utils/ApiError.js";
import type { SerializedMediaImage } from "../utils/serializers.js";
import { triggerRevalidation } from "./publish.service.js";

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

export type GalleryWithImage = galleryRepo.GalleryRow & { image: SerializedMediaImage | null };

async function withImages(rows: galleryRepo.GalleryRow[]): Promise<GalleryWithImage[]> {
  const ids = [...new Set(rows.map((row) => row.media_id))];
  const media = await mediaRepo.findByIds(ids);
  const byId = new Map(media.map((item) => [item.id, item]));
  return rows.map((row) => {
    const item = byId.get(row.media_id);
    return {
      ...row,
      image: item
        ? {
            public_id: item.public_id,
            secure_url: item.secure_url,
            width: item.width,
            height: item.height,
          }
        : null,
    };
  });
}

export async function listPublished(): Promise<GalleryWithImage[]> {
  return withImages(await galleryRepo.findPublished());
}

export async function listAll(): Promise<GalleryWithImage[]> {
  return withImages(await galleryRepo.findAll());
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
    status: "draft",
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
  const existing = await getById(id);
  if (input.mediaId) {
    const media = await mediaRepo.findById(input.mediaId);
    if (!media) {
      throw new NotFoundError("Media not found");
    }
  }
  const status: galleryRepo.GalleryRow["status"] =
    input.status !== undefined && input.status !== null
      ? input.status
      : existing.status === "published"
        ? "draft"
        : existing.status;
  const item = await galleryRepo.update(id, { ...input, status });
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
  if (item.status !== existing.status) {
    void triggerRevalidation("/");
  }
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
  void triggerRevalidation("/");
}
