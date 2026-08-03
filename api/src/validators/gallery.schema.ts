import { z } from "zod";
import { contentStatusSchema } from "./common.js";

export const createGalleryItemSchema = z.object({
  mediaId: z.string().uuid("Valid media id required"),
  caption: z.string().max(300).nullish(),
  altText: z.string().max(300).nullish(),
  displayOrder: z.number().int().min(0).nullish(),
  isFeatured: z.boolean().nullish(),
  status: contentStatusSchema.nullish(),
});

export const updateGalleryItemSchema = z
  .object({
    mediaId: z.string().uuid("Valid media id required").optional(),
    caption: z.string().max(300).nullish(),
    altText: z.string().max(300).nullish(),
    displayOrder: z.number().int().min(0).optional(),
    isFeatured: z.boolean().optional(),
    status: contentStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });
