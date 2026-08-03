import * as activityRepo from "../repositories/activity.repo.js";
import * as eventsRepo from "../repositories/events.repo.js";
import * as mediaRepo from "../repositories/media.repo.js";
import { ConflictError, NotFoundError } from "../utils/ApiError.js";
import { uniqueSlug } from "../utils/slugify.js";

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

async function ensureMediaExists(id: string): Promise<void> {
  const media = await mediaRepo.findById(id);
  if (!media) {
    throw new NotFoundError("Media not found");
  }
}

export async function listPublished(): Promise<eventsRepo.EventRow[]> {
  return eventsRepo.findPublished();
}

export async function listAll(): Promise<eventsRepo.EventRow[]> {
  return eventsRepo.findAll();
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
    status: input.status ?? "draft",
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
  await getById(id);
  if (input.imageMediaId) {
    await ensureMediaExists(input.imageMediaId);
  }
  if (input.slug) {
    const existing = await eventsRepo.findBySlug(input.slug);
    if (existing && existing.id !== id) {
      throw new ConflictError("An event with this slug already exists");
    }
  }
  const event = await eventsRepo.update(id, {
    ...input,
    slug: input.slug === undefined ? undefined : (input.slug ?? null),
    status: input.status ?? undefined,
  });
  if (!event) {
    throw new NotFoundError("Event not found");
  }
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "event",
    entityId: id,
    details: { title: event.title },
    ip: actor.ip ?? null,
  });
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
}
