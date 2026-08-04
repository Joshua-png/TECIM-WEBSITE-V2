export type ContentStatus = "draft" | "published";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ApiErrorBody {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  lastLoginAt: string | null;
  createdAt: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  publishedVersionId: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  pageId: string;
  template: string;
  layout: string;
  displayOrder: number;
  label: string | null;
  content: Record<string, unknown>;
  status: ContentStatus;
  publishedVersionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageWithSections {
  page: Page;
  sections: Section[];
}

export interface SectionTemplate {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  schema: Record<string, unknown>;
  componentName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Version {
  id: string;
  pageId: string;
  number: number;
  snapshot: unknown;
  createdBy: string | null;
  createdAt: string;
}

export interface Media {
  id: string;
  publicId: string;
  secureUrl: string;
  width: number | null;
  height: number | null;
  format: string | null;
  resourceType: "image" | "video";
  sizeBytes: number | null;
  folder: string | null;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  startAt: string;
  endAt: string | null;
  location: string | null;
  imageMediaId: string | null;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  mediaId: string;
  caption: string | null;
  altText: string | null;
  displayOrder: number;
  isFeatured: boolean;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string | null;
  description: string | null;
  mediaUrl: string | null;
  imageMediaId: string | null;
  datePreached: string | null;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  activeFrom: string | null;
  activeUntil: string | null;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NavItem {
  id: string;
  label: string;
  url: string | null;
  pageId: string | null;
  target: "_self" | "_blank";
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children: NavItem[];
}

export interface Setting {
  key: string;
  value: Record<string, unknown>;
  group: string | null;
  updatedAt: string;
}

export interface Seo {
  id: string;
  scope: string;
  pageId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageMediaId: string | null;
  canonicalUrl: string | null;
  updatedAt: string;
}

export interface ActivityEntry {
  id: string;
  userId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  details: Record<string, unknown> | null;
  ip: string | null;
  createdAt: string;
}

export interface ApiData {
  templates: { templates: SectionTemplate[] };
  pages: { pages: Page[] };
  page: PageWithSections;
  pagesList: { pages: Page[] };
  section: { section: Section };
  sections: { sections: Section[] };
  version: { version: Version };
  versions: { versions: Version[] };
  settings: { settings: Setting[] };
  setting: { setting: Setting };
  navigation: { navigation: NavItem[] };
  seo: { seo: Seo | null };
  media: Media[];
  mediaItem: { media: Media };
  mediaDeleted: null;
  events: { events: EventItem[] };
  eventItem: { event: EventItem };
  gallery: { gallery: GalleryItem[] };
  galleryItem: { galleryItem: GalleryItem };
  sermons: { sermons: Sermon[] };
  sermonItem: { sermon: Sermon };
  announcements: { announcements: Announcement[] };
  announcementItem: { announcement: Announcement };
  activity: ActivityEntry[];
  activityItem: ActivityEntry;
  message: { message: string };
  user: { user: User };
  auth: { tokens: TokenPair; user: User };
  tokenPair: TokenPair;
  published: { page: Page; sections: Section[]; version: { id: string; number: number } };
}
