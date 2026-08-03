import { query } from "../config/db.js";

export interface TemplateRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  schema: Record<string, unknown>;
  component_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateSeedInput {
  slug: string;
  name: string;
  description: string | null;
  schema: Record<string, unknown>;
  componentName: string;
}

export async function listActive(): Promise<TemplateRow[]> {
  const { rows } = await query<TemplateRow>(
    "SELECT * FROM section_templates WHERE is_active = true ORDER BY name ASC"
  );
  return rows;
}

export async function findBySlug(slug: string): Promise<TemplateRow | null> {
  const { rows } = await query<TemplateRow>(
    "SELECT * FROM section_templates WHERE slug = $1",
    [slug]
  );
  return rows[0] ?? null;
}

export async function upsert(input: TemplateSeedInput): Promise<TemplateRow> {
  const { rows } = await query<TemplateRow>(
    `INSERT INTO section_templates (slug, name, description, schema, component_name)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (slug) DO UPDATE
       SET name = EXCLUDED.name,
           description = EXCLUDED.description,
           schema = EXCLUDED.schema,
           component_name = EXCLUDED.component_name,
           updated_at = now()
     RETURNING *`,
    [
      input.slug,
      input.name,
      input.description,
      JSON.stringify(input.schema),
      input.componentName,
    ]
  );
  return rows[0];
}
