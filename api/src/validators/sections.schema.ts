import { z } from "zod";

export const contentFieldSchema = z.record(z.string(), z.unknown());

export const createSectionSchema = z.object({
  template: z.string().min(1, "template required"),
  layout: z.string().min(1).default("default"),
  label: z.string().max(200).nullish(),
  content: contentFieldSchema.optional().default({}),
});

export const updateSectionSchema = z
  .object({
    content: contentFieldSchema.optional(),
    layout: z.string().min(1).optional(),
    label: z.string().max(200).nullish(),
  })
  .refine(
    (data) =>
      data.content !== undefined ||
      data.layout !== undefined ||
      data.label !== undefined,
    { message: "Provide at least one field to update" }
  );

export const reorderSectionsSchema = z.object({
  sectionIds: z.array(z.string().uuid("Invalid section id")).min(1),
});

export const sectionPageParamsSchema = z.object({
  pageId: z.string().uuid("Invalid page id"),
});
