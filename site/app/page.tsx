import type { Metadata } from "next";
import { getGlobalSeo, getPageSeo, getPublishedEvents, getPublishedPage } from "@/lib/api";
import { renderSection } from "@/lib/sections";
import { publishedEventsToCards } from "@/lib/events";
import type { EventCard } from "@tecim/shared";
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
  const [sections, events] = await Promise.all([loadHomePage(), loadPublishedEvents()]);

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
          section.template === "events" ? { events } : undefined
        )
      )}
    </main>
  );
}
