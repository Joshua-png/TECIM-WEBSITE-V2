import { z } from "zod";

export const navItemSchema = z.object({
  id: z.string().uuid().nullish(),
  label: z.string().trim().min(1, "label required").max(100),
  url: z
    .string()
    .trim()
    .max(500)
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("/") ||
        value.startsWith("#") ||
        /^https?:\/\//.test(value),
      "Must be an absolute URL, site path, or anchor"
    )
    .nullish(),
  pageId: z.string().uuid().nullish(),
  target: z.enum(["_self", "_blank"]).default("_self"),
  parentId: z.string().uuid().nullish(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const replaceNavigationSchema = z.object({
  items: z.array(navItemSchema).max(200),
});
