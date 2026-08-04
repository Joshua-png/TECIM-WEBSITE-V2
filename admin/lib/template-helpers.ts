export type JsonSchema = {
  type?: string;
  required?: string[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  enum?: string[];
  oneOf?: JsonSchema[];
  minItems?: number;
  description?: string;
};

export function isImageField(schema: JsonSchema): boolean {
  return (
    Array.isArray(schema.oneOf) &&
    schema.oneOf.length === 2 &&
    schema.oneOf[0]?.type === "string" &&
    schema.oneOf[1]?.type === "object" &&
    Array.isArray(schema.oneOf[1].required) &&
    schema.oneOf[1].required.includes("public_id")
  );
}

export function createDefaultContent(schema: JsonSchema | undefined): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (!schema?.properties) return result;

  for (const [key, prop] of Object.entries(schema.properties)) {
    if (isImageField(prop)) {
      result[key] = "";
      continue;
    }
    if (prop.type === "string") {
      result[key] = prop.enum?.[0] ?? "";
    } else if (prop.type === "array") {
      const items = prop.items;
      const count = Math.max(prop.minItems ?? 0, items?.type === "object" ? 1 : 0);
      if (count === 0) {
        result[key] = [];
      } else {
        const defaults: unknown[] = [];
        for (let i = 0; i < count; i += 1) {
          if (items?.type === "object") {
            defaults.push(createDefaultContent(items));
          } else if (items?.type === "string") {
            defaults.push("");
          } else {
            defaults.push({});
          }
        }
        result[key] = defaults;
      }
    } else if (prop.type === "object") {
      result[key] = createDefaultContent(prop);
    } else if (prop.enum) {
      result[key] = prop.enum[0];
    } else if (prop.type === "boolean") {
      result[key] = false;
    }
  }
  return result;
}

export function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

export const TEMPLATE_LAYOUTS: Record<string, string[]> = {
  hero: ["full_height"],
  about_image_left: ["image_left", "image_right", "full_width", "split"],
  about_image_right: ["image_right", "image_left", "full_width", "split"],
  vision: ["default"],
  values: ["default"],
  services: ["default"],
  events: ["grid"],
  timeline: ["default", "split"],
  contact: ["default"],
  gallery: ["default"],
};

export function layoutOptions(templateSlug: string): string[] {
  return TEMPLATE_LAYOUTS[templateSlug] ?? ["default"];
}

export function templateDisplayName(templateSlug: string, templates: { slug: string; name: string }[]): string {
  const found = templates.find((t) => t.slug === templateSlug);
  return found?.name ?? templateSlug;
}
