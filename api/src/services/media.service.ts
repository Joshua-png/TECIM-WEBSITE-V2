import { env } from "../config/env.js";
import { getCloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import * as activityRepo from "../repositories/activity.repo.js";
import * as mediaRepo from "../repositories/media.repo.js";
import { NotFoundError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

interface Actor {
  id: string;
  ip?: string | null;
}

export interface UploadInput {
  buffer: Buffer;
  mimetype: string;
  alt?: string | null;
}

export async function upload(input: UploadInput, actor: Actor): Promise<mediaRepo.MediaRow> {
  const cloudinary = getCloudinary();
  const resourceType = input.mimetype.startsWith("video/") ? "video" : "image";
  const result = await new Promise<{
    public_id: string;
    secure_url: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
    folder?: string;
    resource_type?: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.cloudinaryFolder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error instanceof Error ? error : new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result);
      }
    );
    stream.end(input.buffer);
  });

  const media = await mediaRepo.create({
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width ?? null,
    height: result.height ?? null,
    format: result.format ?? null,
    resourceType: result.resource_type === "video" ? "video" : "image",
    sizeBytes: result.bytes ?? null,
    folder: result.folder ?? env.cloudinaryFolder,
    altText: input.alt ?? null,
  });
  await activityRepo.create({
    userId: actor.id,
    action: "create",
    entityType: "media",
    entityId: media.id,
    details: { publicId: media.public_id, resourceType: media.resource_type },
    ip: actor.ip ?? null,
  });
  return media;
}

export async function remove(id: string, actor: Actor): Promise<void> {
  const media = await mediaRepo.findById(id);
  if (!media) {
    throw new NotFoundError("Media not found");
  }
  if (isCloudinaryConfigured()) {
    const cloudinary = getCloudinary();
    try {
      await cloudinary.uploader.destroy(media.public_id, {
        resource_type: media.resource_type === "video" ? "video" : "image",
      });
    } catch (err) {
      logger.warn(`Cloudinary destroy failed for ${media.public_id}`, err);
    }
  } else {
    logger.warn(`Cloudinary not configured; skipping remote destroy for ${media.public_id}`);
  }
  await mediaRepo.remove(id);
  await activityRepo.create({
    userId: actor.id,
    action: "delete",
    entityType: "media",
    entityId: id,
    ip: actor.ip ?? null,
  });
}
