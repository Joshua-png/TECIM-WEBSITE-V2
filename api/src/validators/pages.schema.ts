import { z } from "zod";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case");

export const createPageSchema = z.object({
  slug,
  title: z.string().trim().min(1, "Title required").max(200),
});

export const updatePageSchema = z
  .object({
    slug: slug.optional(),
    title: z.string().trim().min(1).max(200).optional(),
  })
  .refine((data) => data.slug !== undefined || data.title !== undefined, {
    message: "Provide at least one field to update",
  });

export const pageParamsSchema = z.object({
  slug: z.string().min(1),
});

export const idParamsSchema = z.object({
  id: z.string().uuid("Invalid id"),
});

export const versionParamsSchema = z.object({
  id: z.string().uuid("Invalid id"),
  versionId: z.string().uuid("Invalid version id"),
});
