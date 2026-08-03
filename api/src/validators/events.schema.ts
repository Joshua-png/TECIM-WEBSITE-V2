import { z } from "zod";
import { contentStatusSchema } from "./common.js";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case")
  .max(100);

export const createEventSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(200),
  slug: slug.nullish(),
  description: z.string().max(2000).nullish(),
  startAt: z.string().datetime("Invalid start date"),
  endAt: z.string().datetime("Invalid end date").nullish(),
  location: z.string().max(300).nullish(),
  imageMediaId: z.string().uuid("Invalid media id").nullish(),
  status: contentStatusSchema.nullish(),
});

export const updateEventSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    slug: slug.optional(),
    description: z.string().max(2000).nullish(),
    startAt: z.string().datetime("Invalid start date").optional(),
    endAt: z.string().datetime("Invalid end date").nullish(),
    location: z.string().max(300).nullish(),
    imageMediaId: z.string().uuid("Invalid media id").nullish(),
    status: contentStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });
