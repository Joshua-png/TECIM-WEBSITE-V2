import type { ActivityLogRow } from "../repositories/activity.repo.js";
import type { NavItemRow } from "../repositories/navigation.repo.js";
import type { PageRow } from "../repositories/page.repo.js";
import type { SectionRow } from "../repositories/section.repo.js";
import type { SeoRow } from "../repositories/seo.repo.js";
import type { SettingRow } from "../repositories/settings.repo.js";
import type { TemplateRow } from "../repositories/template.repo.js";
import type { UserRow } from "../repositories/user.repo.js";
import type { VersionRow } from "../repositories/version.repo.js";

export function serializeUser(
  row: Pick<UserRow, "id" | "email" | "name" | "role"> &
    Partial<Pick<UserRow, "last_login_at" | "created_at">>
): {
  id: string;
  email: string;
  name: string | null;
  role: string;
  lastLoginAt: string | null;
  createdAt: string | null;
} {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    lastLoginAt: row.last_login_at ?? null,
    createdAt: row.created_at ?? null,
  };
}

export function serializePage(row: PageRow): Record<string, unknown> {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    publishedVersionId: row.published_version_id,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function serializeSection(row: SectionRow): Record<string, unknown> {
  return {
    id: row.id,
    pageId: row.page_id,
    template: row.template,
    layout: row.layout,
    displayOrder: row.display_order,
    label: row.label,
    content: row.content,
    status: row.status,
    publishedVersionId: row.published_version_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function serializeVersion(row: VersionRow): Record<string, unknown> {
  return {
    id: row.id,
    pageId: row.page_id,
    number: row.number,
    snapshot: row.snapshot,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

export function serializeTemplate(row: TemplateRow): Record<string, unknown> {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    schema: row.schema,
    componentName: row.component_name,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function serializeSetting(row: SettingRow): Record<string, unknown> {
  return {
    key: row.key,
    value: row.value,
    group: row.group,
    updatedAt: row.updated_at,
  };
}

export interface NavNodeDTO {
  id: string;
  label: string;
  url: string | null;
  pageId: string | null;
  target: string;
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children: NavNodeDTO[];
}

type NavNodeSource = NavItemRow & { children?: NavNodeSource[] };

export function serializeNavNode(row: NavNodeSource): NavNodeDTO {
  return {
    id: row.id,
    label: row.label,
    url: row.url,
    pageId: row.page_id,
    target: row.target,
    parentId: row.parent_id,
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    children: (row.children ?? []).map(serializeNavNode),
  };
}

export function serializeSeo(row: SeoRow): Record<string, unknown> {
  return {
    id: row.id,
    scope: row.scope,
    pageId: row.page_id,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogImageMediaId: row.og_image_media_id,
    canonicalUrl: row.canonical_url,
    updatedAt: row.updated_at,
  };
}

export function serializeActivity(row: ActivityLogRow): Record<string, unknown> {
  return {
    id: row.id,
    userId: row.user_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    details: row.details,
    ip: row.ip,
    createdAt: row.created_at,
  };
}

export function serializePageWithSections(input: {
  page: PageRow;
  sections: SectionRow[];
}): { page: Record<string, unknown>; sections: Record<string, unknown>[] } {
  return {
    page: serializePage(input.page),
    sections: input.sections.map(serializeSection),
  };
}
