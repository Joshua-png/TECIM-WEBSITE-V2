"use client";

import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch, SITE_URL } from "@/lib/api";
import { useData } from "@/lib/use-data";
import type { Page, Seo } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { PageLoader } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { MediaPicker } from "@/components/forms/MediaPicker";
import type { Media } from "@/lib/types";

function SerpPreview({
  title,
  description,
  path,
  siteName,
}: {
  title: string;
  description: string;
  path: string;
  siteName: string;
}) {
  const displayTitle = title.trim()
    ? `${title.trim()} · ${siteName}`
    : `${siteName}`;
  const url = `${SITE_URL}${path}`;
  return (
    <div className="rounded-xl border border-line bg-white/[0.04] p-4">
      <p className="text-xs font-medium uppercase tracking-widest text-faint">Google preview</p>
      <a href={url} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-turquoise hover:underline">
        {url}
      </a>
      <p className="mt-1 line-clamp-2 text-lg text-[#8ab4f8]">{displayTitle}</p>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
        {description.trim() || "No meta description — Google may pick its own snippet."}
      </p>
      <p className="mt-3 text-xs text-faint">
        {title.trim().length} / 60 chars title · {description.trim().length} / 160 chars description
      </p>
    </div>
  );
}

function SeoEditor({
  seo,
  onSave,
  siteName,
  path,
}: {
  seo: Seo | null;
  onSave: (payload: {
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    ogImageMediaId: string | null;
  }) => Promise<void>;
  siteName: string;
  path: string;
}) {
  const [metaTitle, setMetaTitle] = useState(seo?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(seo?.metaDescription ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(seo?.canonicalUrl ?? "");
  const [ogImageMediaId, setOgImageMediaId] = useState<string | null>(seo?.ogImageMediaId ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    setMetaTitle(seo?.metaTitle ?? "");
    setMetaDescription(seo?.metaDescription ?? "");
    setCanonicalUrl(seo?.canonicalUrl ?? "");
    setOgImageMediaId(seo?.ogImageMediaId ?? null);
  }, [seo]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave({
        metaTitle: metaTitle.trim() || null,
        metaDescription: metaDescription.trim() || null,
        canonicalUrl: canonicalUrl.trim() || null,
        ogImageMediaId,
      });
      toast.push("success", "SEO saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Field label="Meta title" hint="Shown as the page title in search results.">
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Page title" />
          </Field>
          <Field label="Meta description" hint="The page snippet in search results.">
            <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Canonical URL">
              <Input
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <Field label="Social share image">
              <div className="flex gap-2">
                <Input
                  value={ogImageMediaId ?? ""}
                  onChange={(e) => setOgImageMediaId(e.target.value || null)}
                  placeholder="Media UUID"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => setPickerOpen(true)}>
                  Pick
                </Button>
              </div>
            </Field>
          </div>

          {error ? (
            <div className="rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-2.5 text-sm text-rose">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button onClick={() => void save()} loading={saving}>
              <Save className="size-4" />
              Save SEO
            </Button>
          </div>
        </div>

        <SerpPreview title={metaTitle} description={metaDescription} path={path} siteName={siteName} />
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media: Media) => setOgImageMediaId(media.id)}
      />
    </Card>
  );
}

export default function SeoPage() {
  const globalData = useData<{ seo: Seo | null }>("/seo");
  const pagesData = useData<{ pages: Page[] }>("/admin/pages");
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [pageSeo, setPageSeo] = useState<Seo | null>(null);

  const pages = useMemo(() => pagesData.data?.pages ?? [], [pagesData.data]);
  const siteName = globalData.data?.seo?.metaTitle ?? "TECIM";
  const selectedPage = pages.find((p) => p.id === selectedPageId) ?? null;

  useEffect(() => {
    if (pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages, selectedPageId]);

  useEffect(() => {
    if (!selectedPage) {
      setPageSeo(null);
      return;
    }
    let cancelled = false;
    apiFetch<{ seo: Seo | null }>(`/seo/pages/${selectedPage.slug}`)
      .then((res) => {
        if (!cancelled) setPageSeo(res.seo);
      })
      .catch(() => {
        if (!cancelled) setPageSeo(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedPage]);

  if (globalData.loading || pagesData.loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Structure"
        title="SEO"
        description="Search and social metadata. Per-page settings override the global defaults."
      />

      <div>
        <h3 className="mb-3 font-serif text-lg text-ink">Global defaults</h3>
        <SeoEditor
          seo={globalData.data?.seo ?? null}
          siteName={siteName}
          path="/"
          onSave={async (payload) => {
            await apiFetch("/admin/seo", { method: "PUT", body: payload });
            globalData.reload();
          }}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <h3 className="font-serif text-lg text-ink">Per-page overrides</h3>
          <Select
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            className="w-64"
          >
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title} ({page.slug})
              </option>
            ))}
          </Select>
        </div>
        {selectedPage ? (
          <SeoEditor
            key={selectedPage.id}
            seo={pageSeo}
            siteName={siteName}
            path={`/${selectedPage.slug}`}
            onSave={async (payload) => {
              await apiFetch(`/admin/seo/pages/${selectedPage.id}`, { method: "PUT", body: payload });
              const res = await apiFetch<{ seo: Seo | null }>(`/seo/pages/${selectedPage.slug}`);
              setPageSeo(res.seo);
            }}
          />
        ) : (
          <Card>
            <p className="p-6 text-sm text-muted">Create a page to manage its SEO.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
