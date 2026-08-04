import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageSeo, getPublishedPage } from "@/lib/api";
import { renderSection } from "@/lib/sections";

export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
};

async function loadPage(slug: string) {
  try {
    return await getPublishedPage(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { seo } = await getPageSeo(slug);
    if (seo.metaTitle || seo.metaDescription || seo.canonicalUrl) {
      return {
        title: seo.metaTitle ?? undefined,
        description: seo.metaDescription ?? undefined,
        alternates: { canonical: seo.canonicalUrl ?? undefined },
      };
    }
  } catch {
    // Fall through to layout defaults.
  }
  return {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await loadPage(slug);
  if (!page) notFound();

  return (
    <main className="flex-1">
      {page.sections.map((section, i) =>
        renderSection(section.template, section.content, `${section.template}-${i}`)
      )}
    </main>
  );
}
