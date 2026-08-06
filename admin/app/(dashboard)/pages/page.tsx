"use client";

import { ExternalLink, FilePlus2, LayoutTemplate, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { slugify } from "@/lib/format";
import type { Page } from "@/lib/types";
import { useData } from "@/lib/use-data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm";
import { EmptyState } from "@/components/ui/empty";
import { Field, Input } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { PageLoader } from "@/components/ui/spinner";
import { StatusPill } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export default function PagesPage() {
  const { data, loading, reload } = useData<{ pages: Page[] }>("/admin/pages");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Page | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();

  const pages = useMemo(
    () => (data?.pages ?? []).slice().sort((a, b) => a.updatedAt.localeCompare(b.updatedAt)),
    [data]
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await apiFetch<{ page: Page }>("/admin/pages", {
        method: "POST",
        body: { title, slug: slug || null },
      });
      toast.push("success", "Page created", result.page.title);
      setCreateOpen(false);
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      reload();
      router.push(`/pages/${result.page.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create page");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/admin/pages/${deleteTarget.id}`, { method: "DELETE" });
      toast.push("success", "Page deleted", deleteTarget.title);
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast.push("error", "Delete failed", err instanceof Error ? err.message : undefined);
      setDeleteTarget(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        eyebrow="Site structure"
        title="Pages"
        description="Every page on the site, in draft or published state. Open a page to compose its sections."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <FilePlus2 className="size-4" />
            New page
          </Button>
        }
      />

      {pages.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title="No pages yet"
          description="Create your first page to start composing sections."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <FilePlus2 className="size-4" />
              Create a page
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-panel">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-[0.66rem] uppercase tracking-wider text-faint">
                <th className="px-5 py-3.5 font-semibold">Page</th>
                <th className="hidden px-5 py-3.5 font-semibold sm:table-cell">Status</th>
                <th className="hidden px-5 py-3.5 font-semibold md:table-cell">Last updated</th>
                <th className="hidden px-5 py-3.5 font-semibold lg:table-cell">Published</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="group cursor-pointer transition-colors hover:bg-overlay"
                  onClick={() => router.push(`/pages/${page.id}`)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas-soft">
                        <LayoutTemplate className="size-4 text-turquoise" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">{page.title}</p>
                        <p className="text-xs text-faint">/{page.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell">
                    <StatusPill status={page.status} />
                  </td>
                  <td className="hidden px-5 py-4 text-xs text-muted md:table-cell">
                    {new Date(page.updatedAt).toLocaleString()}
                  </td>
                  <td className="hidden px-5 py-4 text-xs text-muted lg:table-cell">
                    {page.publishedAt ? new Date(page.publishedAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <a
                        href={`/pages/${page.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="rounded-lg p-2 text-muted hover:bg-overlay-strong hover:text-turquoise"
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </a>
                      <a
                        href={`/pages/${page.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="rounded-lg p-2 text-muted hover:bg-overlay-strong hover:text-turquoise"
                        aria-label="Open"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(page);
                        }}
                        className="rounded-lg p-2 text-muted hover:bg-rose/10 hover:text-rose"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a page"
        subtitle="The slug becomes the page URL, e.g. /about."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleCreate()} loading={saving} disabled={!title.trim()}>
              Create page
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Title" required hint="Displayed in the navigation and header">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="About us"
              autoFocus
            />
          </Field>
          <Field label="Slug" required hint="kebab-case, lowercase">
            <div className="flex items-center gap-1 rounded-lg border border-line bg-overlay px-3">
              <span className="text-sm text-faint">/</span>
              <input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                className="h-9.5 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
                placeholder="about-us"
              />
            </div>
          </Field>
          {error ? (
            <div className="rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-2.5 text-sm text-rose">
              {error}
            </div>
          ) : null}
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title="Delete this page?"
        message={`"${deleteTarget?.title ?? ""}" and all of its sections will be permanently removed. This cannot be undone.`}
        danger
        confirmLabel="Delete page"
      />
    </div>
  );
}
