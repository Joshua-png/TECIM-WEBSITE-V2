import type { Metadata } from "next";
import { getDraftPreview, type PageWithSections } from "@/lib/api";
import { renderSection } from "@/lib/sections";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Section preview",
  robots: { index: false, follow: false },
};

export default async function SectionPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ template: string }>;
  searchParams: Promise<{ pageId?: string; sectionId?: string; token?: string }>;
}) {
  const { template } = await params;
  const { pageId, sectionId, token } = await searchParams;

  if (!pageId || !sectionId || !token) {
    return <Notice message="This preview link is incomplete. Open Preview from the TECIM admin to view your section." />;
  }

  let data: PageWithSections;
  try {
    data = await getDraftPreview(pageId, token);
  } catch {
    return (
      <Notice message="This preview link is invalid or expired. Open Preview again from the TECIM admin." />
    );
  }

  const section = data.sections.find((s) => s.id === sectionId);
  if (!section) {
    return <Notice message="This section is no longer on the page. Reopen the preview from the TECIM admin." />;
  }

  return (
    <>
      <div className="fixed left-1/2 top-3 z-[100] -translate-x-1/2">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-black/80 px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-300 backdrop-blur">
          Section preview
        </span>
      </div>
      <main className="flex-1">{renderSection(template, section.content, template)}</main>
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
