import * as activityRepo from "../repositories/activity.repo.js";
import * as eventsRepo from "../repositories/events.repo.js";
import * as mediaRepo from "../repositories/media.repo.js";
import { ConflictError, NotFoundError } from "../utils/ApiError.js";
import type { SerializedMediaImage } from "../utils/serializers.js";
import { uniqueSlug } from "../utils/slugify.js";
import { triggerRevalidation } from "./publish.service.js";

interface Actor {
  id: string;
  ip?: string | null;
}

export interface EventInput {
  title: string;
  slug?: string | null;
  description?: string | null;
  startAt: string;
  endAt?: string | null;
  location?: string | null;
  imageMediaId?: string | null;
  status?: "draft" | "published" | null;
}

export type EventWithImage = eventsRepo.EventRow & { image: SerializedMediaImage | null };

async function ensureMediaExists(id: string): Promise<void> {
  const media = await mediaRepo.findById(id);
  if (!media) {
    throw new NotFoundError("Media not found");
  }
}

async function withImages(rows: eventsRepo.EventRow[]): Promise<EventWithImage[]> {
  const ids = [...new Set(rows.map((row) => row.image_media_id).filter((id): id is string => Boolean(id)))];
  const media = await mediaRepo.findByIds(ids);
  const byId = new Map(media.map((item) => [item.id, item]));
  return rows.map((row) => {
    const item = row.image_media_id ? byId.get(row.image_media_id) : null;
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

export async function listPublished(): Promise<EventWithImage[]> {
  return withImages(await eventsRepo.findPublished());
}

export async function listAll(): Promise<EventWithImage[]> {
  return withImages(await eventsRepo.findAll());
}

export async function getById(id: string): Promise<eventsRepo.EventRow> {
  const event = await eventsRepo.findById(id);
  if (!event) {
    throw new NotFoundError("Event not found");
  }
  return event;
}

export async function create(input: EventInput, actor: Actor): Promise<eventsRepo.EventRow> {
  if (input.imageMediaId) {
    await ensureMediaExists(input.imageMediaId);
  }
  let slug = input.slug?.trim() || null;
  if (slug) {
    const existing = await eventsRepo.findBySlug(slug);
    if (existing) {
      throw new ConflictError("An event with this slug already exists");
    }
  } else {
    slug = await uniqueSlug(input.title, (s) => eventsRepo.findBySlug(s));
  }
  const event = await eventsRepo.create({
    title: input.title,
    slug,
    description: input.description ?? null,
    startAt: input.startAt,
    endAt: input.endAt ?? null,
    location: input.location ?? null,
    imageMediaId: input.imageMediaId ?? null,
    status: "draft",
  });
  await activityRepo.create({
    userId: actor.id,
    action: "create",
    entityType: "event",
    entityId: event.id,
    details: { title: event.title, slug: event.slug },
    ip: actor.ip ?? null,
  });
  return event;
}

export async function update(
  id: string,
  input: Partial<EventInput>,
  actor: Actor
): Promise<eventsRepo.EventRow> {
  const existing = await getById(id);
  if (input.imageMediaId) {
    await ensureMediaExists(input.imageMediaId);
  }
  if (input.slug) {
    const conflict = await eventsRepo.findBySlug(input.slug);
    if (conflict && conflict.id !== id) {
      throw new ConflictError("An event with this slug already exists");
    }
  }
  const status: eventsRepo.EventRow["status"] =
    input.status !== undefined && input.status !== null
      ? input.status
      : existing.status === "published"
        ? "draft"
        : existing.status;
  const event = await eventsRepo.update(id, {
    ...input,
    slug: input.slug === undefined ? undefined : (input.slug ?? null),
    status,
  });
  if (!event) {
    throw new NotFoundError("Event not found");
  }
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "event",
    entityId: id,
    details: { title: event.title, status: event.status },
    ip: actor.ip ?? null,
  });
  if (event.status !== existing.status) {
    void triggerRevalidation("/");
  }
  return event;
}

export async function remove(id: string, actor: Actor): Promise<void> {
  await getById(id);
  await eventsRepo.remove(id);
  await activityRepo.create({
    userId: actor.id,
    action: "delete",
    entityType: "event",
    entityId: id,
    ip: actor.ip ?? null,
  });
  void triggerRevalidation("/");
}
