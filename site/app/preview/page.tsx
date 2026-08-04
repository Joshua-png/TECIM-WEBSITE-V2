import type { Metadata } from "next";
import Link from "next/link";
import { getDraftPreview, type PageWithSections } from "@/lib/api";
import { renderSection } from "@/lib/sections";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ pageId?: string; token?: string }>;
}) {
  const { pageId, token } = await searchParams;

  if (!pageId || !token) {
    return <Notice message="This preview link is incomplete. Open Preview from the TECIM admin to view your draft." />;
  }

  let data: PageWithSections;
  try {
    data = await getDraftPreview(pageId, token);
  } catch {
    return (
      <Notice message="This preview link is invalid or expired. Open Preview again from the TECIM admin." />
    );
  }

  const sections = data.sections.map((section) => ({
    template: section.template,
    content: section.content,
  }));

  return (
    <>
      <div className="fixed left-1/2 top-3 z-[100] -translate-x-1/2">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-black/80 px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-300 backdrop-blur">
          Draft preview
          <Link href="/" className="text-faint underline-offset-2 hover:text-amber-300 hover:underline">
            View live
          </Link>
        </span>
      </div>
      <main className="flex-1">
        {sections.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-muted">This page has no sections yet.</p>
          </div>
        ) : (
          sections.map((section, i) =>
            renderSection(section.template, section.content, `${section.template}-${i}`)
          )
        )}
      </main>
    </>
  );
}

function Notice({ message }: { message: string }) {
  return (
    <main className="flex min-h-[60vh] flex-1 items-center justify-center px-6">
      <div className="max-w-md rounded-2xl border border-line bg-panel p-8 text-center">
        <p className="text-sm leading-relaxed text-muted">{message}</p>
      </div>
    </main>
  );
}
