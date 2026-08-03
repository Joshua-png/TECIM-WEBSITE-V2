import type { ZodType } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as authSchemas from "../../validators/auth.schema.js";
import * as navigationSchemas from "../../validators/navigation.schema.js";
import * as pagesSchemas from "../../validators/pages.schema.js";
import * as sectionsSchemas from "../../validators/sections.schema.js";
import * as seoSchemas from "../../validators/seo.schema.js";
import * as settingsSchemas from "../../validators/settings.schema.js";

function isZodSchema(value: unknown): value is ZodType {
  return (
    typeof value === "object" &&
    value !== null &&
    "_def" in value &&
    typeof (value as ZodType).safeParse === "function"
  );
}

function convertAll(
  moduleName: string,
  module: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(module)) {
    if (isZodSchema(value)) {
      result[`${moduleName}_${key}`] = zodToJsonSchema(value, {
        $refStrategy: "none",
      });
    }
  }
  return result;
}

export const openApiSchemas: Record<string, unknown> = {
  ...convertAll("auth", authSchemas),
  ...convertAll("navigation", navigationSchemas),
  ...convertAll("pages", pagesSchemas),
  ...convertAll("sections", sectionsSchemas),
  ...convertAll("seo", seoSchemas),
  ...convertAll("settings", settingsSchemas),
};
