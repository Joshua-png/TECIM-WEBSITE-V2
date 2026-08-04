import type { Metadata } from "next";
import { getGlobalSeo, getPageSeo, getPublishedEvents, getPublishedGallery, getPublishedPage } from "@/lib/api";
import { renderSection } from "@/lib/sections";
import { publishedEventsToCards } from "@/lib/events";
import { publishedGalleryToImages } from "@/lib/gallery";
import type { EventCard, GalleryImage } from "@tecim/shared";
import {
  Hero,
  About,
  Values,
  Vision,
  Services,
  Events,
  Gallery,
  Contact,
} from "@tecim/shared";

async function loadHomePage(): Promise<
  { template: string; content: Record<string, unknown> }[] | null
> {
  try {
    const page = await getPublishedPage("home");
    return page.sections.map((section) => ({
      template: section.template,
      content: section.content,
    }));
  } catch {
    return null;
  }
}

async function loadPublishedEvents(): Promise<EventCard[]> {
  try {
    const { events } = await getPublishedEvents();
    return publishedEventsToCards(events);
  } catch {
    return [];
  }
}

async function loadPublishedGallery(): Promise<GalleryImage[]> {
  try {
    const { gallery } = await getPublishedGallery();
    return publishedGalleryToImages(gallery);
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { seo } = await getPageSeo("home");
    if (seo.metaTitle || seo.metaDescription || seo.canonicalUrl) {
      return {
        title: seo.metaTitle ?? undefined,
        description: seo.metaDescription ?? undefined,
        alternates: { canonical: seo.canonicalUrl ?? undefined },
      };
    }
  } catch {
    // Fall through to global SEO.
  }
  try {
    const { seo } = await getGlobalSeo();
    if (seo?.metaTitle || seo?.metaDescription) {
      return {
        title: seo.metaTitle ?? undefined,
        description: seo.metaDescription ?? undefined,
      };
    }
  } catch {
    // Fall through to layout defaults.
  }
  return {};
}

export default async function HomePage() {
  const [sections, events, gallery] = await Promise.all([
    loadHomePage(),
    loadPublishedEvents(),
    loadPublishedGallery(),
  ]);

  if (!sections) {
    return (
      <main className="flex-1">
        <Hero />
        <About />
        <Values />
        <Vision />
        <Services />
        <Events />
        <Gallery />
        <Contact />
      </main>
    );
  }

  return (
    <main className="flex-1">
      {sections.map((section, i) =>
        renderSection(
          section.template,
          section.content,
          `${section.template}-${i}`,
          false,
          section.template === "events"
            ? { events }
            : section.template === "gallery"
              ? { items: gallery }
              : undefined
        )
      )}
    </main>
  );
}
