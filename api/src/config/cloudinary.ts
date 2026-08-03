import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";
import { ApiError } from "../utils/ApiError.js";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    env.cloudinaryCloudName &&
      env.cloudinaryApiKey &&
      env.cloudinaryApiSecret
  );
}

export function getCloudinary(): typeof cloudinary {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(500, "INTERNAL", "Cloudinary is not configured");
  }
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName ?? undefined,
    api_key: env.cloudinaryApiKey ?? undefined,
    api_secret: env.cloudinaryApiSecret ?? undefined,
    secure: true,
  });
  return cloudinary;
}
