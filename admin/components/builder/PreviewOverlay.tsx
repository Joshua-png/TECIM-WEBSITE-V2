"use client";

import { Eye, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { PageWithSections } from "@/lib/types";
import { templateDisplayName } from "@/lib/template-helpers";

export function PreviewOverlay({
  pageId,
  pageTitle,
  templates,
  open,
  onClose,
}: {
  pageId: string;
  pageTitle: string;
  templates: { slug: string; name: string }[];
  open: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<PageWithSections | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiFetch<PageWithSections>(`/admin/pages/${pageId}/preview`)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load preview");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, pageId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black/90 backdrop-blur-xl">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
        <div className="flex items-center gap-3">
          <Eye className="size-4.5 text-turquoise" />
          <div>
            <p className="text-sm font-medium text-ink">Draft preview — {pageTitle}</p>
            <p className="text-[0.68rem] text-faint">
              Rendered from the live draft via the API. Design elements are represented, not pixel-perfect.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-white/[0.08] hover:text-ink"
          aria-label="Close preview"
        >
          <X className="size-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto max-w-2xl">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-24 text-muted">
              <Loader2 className="size-5 animate-spin text-turquoise" />
              <span className="text-sm">Rendering draft…</span>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose/30 bg-rose/10 px-5 py-4 text-sm text-rose">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {data?.sections.map((section) => (
                <SectionPreview
                  key={section.id}
                  templateName={templateDisplayName(section.template, templates)}
                  layout={section.layout}
                  content={section.content}
                />
              ))}
              {data?.sections.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted">
                  This page has no sections yet.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionPreview({
  templateName,
  layout,
  content,
}: {
  templateName: string;
  layout: string;
  content: Record<string, unknown>;
}) {
  const str = (key: string) => (typeof content[key] === "string" ? content[key] as string : "");
  const firstImage = findFirstImage(content);
  const collections = findCollections(content);

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-canvas">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-2.5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-turquoise">
          {templateName}
        </p>
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-faint">{layout}</p>
      </div>

      <div className="px-6 py-7">
        {str("label") ? (
          <p className="mb-2 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold">
            {str("label")}
          </p>
        ) : null}
        <h3 className="font-serif text-3xl font-medium leading-tight text-ink">
          {str("title") || str("heading") || "Untitled section"}
          {str("titleBreak") ? (
            <>
              <br />
              <span className="text-turquoise">{str("titleBreak")}</span>
            </>
          ) : null}
        </h3>
        {str("subtitle") || str("sub") ? (
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
            {str("subtitle") || str("sub")}
          </p>
        ) : null}
        {str("description") ? (
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">{str("description")}</p>
        ) : null}

        {firstImage ? (
          <div className="mt-5 overflow-hidden rounded-xl border border-line bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={firstImage} alt="" className="max-h-56 w-full object-cover" />
          </div>
        ) : null}

        {collections.length > 0 ? (
          <div className="mt-5 space-y-2">
            {collections.map((collection, index) => (
              <div
                key={index}
                className="rounded-xl border border-line bg-canvas-soft/60 px-4 py-3"
              >
                <p className="font-serif text-base font-semibold text-ink">
                  {collection.title}
                </p>
                <p className="text-xs leading-relaxed text-muted">{collection.body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function findFirstImage(content: Record<string, unknown>): string | null {
  const result: string[] = [];
  const walk = (value: unknown) => {
    if (typeof value === "string" && /^https?:\/\//.test(value) && !value.includes("maps.google")) {
      result.push(value);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item);
    } else if (value && typeof value === "object") {
      for (const entry of Object.values(value as Record<string, unknown>)) walk(entry);
    }
  };
  walk(content);
  return result[0] ?? null;
}

function findCollections(content: Record<string, unknown>): { title: string; body: string }[] {
  const collections: { title: string; body: string }[] = [];
  const priorityKeys = ["identities", "steps", "slides", "cards", "rows", "events", "locations", "hours", "serviceTimes"];
  const titleKeys = ["title", "heading", "label", "name", "day", "date", "time"];
  const bodyKeys = ["body", "text", "description", "verse", "subtitle", "items", "verse"];

  const walk = (value: unknown) => {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const record = item as Record<string, unknown>;
          const title = titleKeys
            .map((key) => record[key])
            .find((v) => typeof v === "string" && v) as string | undefined;
          const body = bodyKeys
            .map((key) => {
              const v = record[key];
              return Array.isArray(v) ? v.filter((x) => typeof x === "string").join(" · ") : v;
            })
            .find((v) => typeof v === "string" && v) as string | undefined;
          if (title) {
            collections.push({ title, body: body ?? "" });
          }
          for (const entry of Object.values(record)) {
            if (Array.isArray(entry)) walk(entry);
          }
        }
      }
    }
  };

  for (const key of priorityKeys) {
    if (key in content) walk(content[key]);
  }
  return collections.slice(0, 8);
}
