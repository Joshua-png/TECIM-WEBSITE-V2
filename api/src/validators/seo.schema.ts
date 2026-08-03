import { z } from "zod";

const seoFields = {
  metaTitle: z.string().max(200).nullish(),
  metaDescription: z.string().max(500).nullish(),
  ogImageMediaId: z.string().uuid().nullish(),
  canonicalUrl: z.string().url().or(z.literal("")).nullish(),
};

export const updateGlobalSeoSchema = z.object({
  ...seoFields,
});

export const updatePageSeoSchema = z.object({
  ...seoFields,
});
