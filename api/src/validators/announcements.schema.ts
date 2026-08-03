import { z } from "zod";
import { contentStatusSchema } from "./common.js";

const linkUrl = z.string().url("Invalid URL").or(z.literal(""));

export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(200),
  body: z.string().max(2000).nullish(),
  linkUrl: linkUrl.nullish(),
  linkLabel: z.string().max(100).nullish(),
  activeFrom: z.string().datetime("Invalid active-from date").nullish(),
  activeUntil: z.string().datetime("Invalid active-until date").nullish(),
  status: contentStatusSchema.nullish(),
});

export const updateAnnouncementSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    body: z.string().max(2000).nullish(),
    linkUrl: linkUrl.nullish(),
    linkLabel: z.string().max(100).nullish(),
    activeFrom: z.string().datetime("Invalid active-from date").nullish(),
    activeUntil: z.string().datetime("Invalid active-until date").nullish(),
    status: contentStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });
