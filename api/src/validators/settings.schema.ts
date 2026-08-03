import { z } from "zod";

export const updateSettingSchema = z.object({
  value: z.record(z.string(), z.unknown()),
});

export const settingKeyParamsSchema = z.object({
  key: z.string().min(1),
});
