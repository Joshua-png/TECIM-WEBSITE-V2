import { z } from "zod";

export const contentStatusSchema = z.enum(["draft", "published"]);

export const collectionIdParamsSchema = z.object({
  id: z.string().uuid("Invalid id"),
});
