const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");
const BASE = `${API_URL}/api/v1`;
const CACHE_TAG = "tecim-content";
const REVALIDATE_SECONDS = 300;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    let message = `API responded with ${res.status}`;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      message = body.error?.message ?? message;
    } catch {
      // Non-JSON error body; keep the generic message.
    }
    throw new ApiError(message, res.status);
  }

  const body = (await res.json()) as SuccessEnvelope<T>;
  if (!body.success) {
    throw new ApiError("Unexpected API response", 500);
  }
  return body.data;
}

export interface PageMeta {
  id: string;
  slug: string;
  title: string;
  status: string;
  publishedVersionId: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSection {
  id: string;
  pageId: string;
  template: string;
  layout: string;
  displayOrder: number;
  label: string;
  content: Record<string, unknown>;
  status: string;
  publishedVersionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageWithSections {
  page: PageMeta;
  sections: SiteSection[];
}

export interface Setting {
  key: string;
  value: Record<string, unknown>;
  group: string;
  updatedAt: string;
}

export interface NavNode {
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
  children: NavNode[];
}

export interface SeoMeta {
  id: string;
  scope: string;
  pageId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageMediaId: string | null;
  canonicalUrl: string | null;
  updatedAt: string;
}

export function getPublishedPage(slug: string): Promise<PageWithSections> {
  return fetchJson<PageWithSections>(`/pages/${encodeURIComponent(slug)}`);
}

export interface PublicEventImage {
  public_id: string;
  secure_url: string;
  width: number | null;
  height: number | null;
}

export interface PublicEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  startAt: string;
  endAt: string | null;
  location: string | null;
  imageMediaId: string | null;
  image: PublicEventImage | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function getPublishedEvents(): Promise<{ events: PublicEvent[] }> {
  return fetchJson<{ events: PublicEvent[] }>("/events");
}

export function getPages(): Promise<{ pages: PageMeta[] }> {
  return fetchJson<{ pages: PageMeta[] }>("/pages");
}

export function getSettings(): Promise<{ settings: Setting[] }> {
  return fetchJson<{ settings: Setting[] }>("/settings");
}

export function getNavigation(): Promise<{ navigation: NavNode[] }> {
  return fetchJson<{ navigation: NavNode[] }>("/navigation");
}

export function getGlobalSeo(): Promise<{ seo: SeoMeta | null }> {
  return fetchJson<{ seo: SeoMeta | null }>("/seo");
}

export function getPageSeo(slug: string): Promise<{ seo: SeoMeta }> {
  return fetchJson<{ seo: SeoMeta }>(`/seo/pages/${encodeURIComponent(slug)}`);
}

export function getDraftPreview(
  pageId: string,
  token: string
): Promise<PageWithSections> {
  return fetch(`${BASE}/admin/pages/${encodeURIComponent(pageId)}/preview`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
    .then(async (res) => {
      if (!res.ok) {
        let message = `API responded with ${res.status}`;
        try {
          const body = (await res.json()) as { error?: { message?: string } };
          message = body.error?.message ?? message;
        } catch {
          // Non-JSON error body; keep the generic message.
        }
        throw new ApiError(message, res.status);
      }
      return (await res.json()) as SuccessEnvelope<PageWithSections>;
    })
    .then((body) => {
      if (!body.success) {
        throw new ApiError("Unexpected API response", 500);
      }
      return body.data;
    });
}
