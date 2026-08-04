import { getNavigation, getPages, getSettings } from "./api";

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterData {
  siteName: string;
  shortName: string;
  tagline: string;
  email: string;
  phones: string[];
}

const FALLBACK_LINKS: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#values", label: "Values" },
  { href: "#vision", label: "Vision" },
  { href: "#services", label: "Services" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
];

const FALLBACK_FOOTER: FooterData = {
  siteName: "The Eagle Centre for International Ministries",
  shortName: "TECIM",
  tagline:
    "Equipping a generation of kingdom-minded people of integrity and the Word — as Light, Trumpets and Swords.",
  email: "theeaglecenter1@gmail.com",
  phones: ["+233 271 503 760"],
};

function hrefForPage(slug: string | undefined): string | null {
  if (!slug) return null;
  return slug === "home" ? "/" : `/${slug}`;
}

export async function loadChrome(): Promise<{
  links: NavLink[];
  footer: FooterData;
}> {
  const [navRes, settingsRes, pagesRes] = await Promise.all([
    getNavigation().catch(() => null),
    getSettings().catch(() => null),
    getPages().catch(() => null),
  ]);

  if (!navRes || !settingsRes) {
    return { links: FALLBACK_LINKS, footer: FALLBACK_FOOTER };
  }

  const slugByPageId = new Map(
    (pagesRes?.pages ?? []).map((page) => [page.id, page.slug])
  );

  const links: NavLink[] = navRes.navigation
    .filter((item) => item.isActive)
    .map((item) => {
      const href =
        item.url ??
        (item.pageId ? hrefForPage(slugByPageId.get(item.pageId) ?? undefined) : null);
      return { label: item.label, href: href ?? "#" };
    });

  const byKey = new Map(
    settingsRes.settings.map((setting) => [setting.key, setting.value])
  );
  const site = (byKey.get("site") ?? {}) as Record<string, unknown>;
  const contact = (byKey.get("contact") ?? {}) as Record<string, unknown>;

  const siteName = typeof site.name === "string" ? site.name : FALLBACK_FOOTER.siteName;
  const shortName =
    typeof site.shortName === "string" ? site.shortName : FALLBACK_FOOTER.shortName;
  const tagline =
    typeof site.tagline === "string" ? site.tagline : FALLBACK_FOOTER.tagline;
  const email =
    typeof contact.email === "string" ? contact.email : FALLBACK_FOOTER.email;
  const phones = Array.isArray(contact.phones)
    ? contact.phones.filter((p): p is string => typeof p === "string")
    : FALLBACK_FOOTER.phones;

  return {
    links: links.length ? links : FALLBACK_LINKS,
    footer: { siteName, shortName, tagline, email, phones },
  };
}
