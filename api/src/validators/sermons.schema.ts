import { z } from "zod";
import { contentStatusSchema } from "./common.js";

export const createSermonSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(200),
  speaker: z.string().max(200).nullish(),
  description: z.string().max(2000).nullish(),
  mediaUrl: z.string().url("Invalid media URL").or(z.literal("")).nullish(),
  imageMediaId: z.string().uuid("Invalid media id").nullish(),
  datePreached: z.string().date("Invalid date").nullish(),
  status: contentStatusSchema.nullish(),
});

export const updateSermonSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    speaker: z.string().max(200).nullish(),
    description: z.string().max(2000).nullish(),
    mediaUrl: z.string().url("Invalid media URL").or(z.literal("")).nullish(),
    imageMediaId: z.string().uuid("Invalid media id").nullish(),
    datePreached: z.string().date("Invalid date").nullish(),
    status: contentStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });
