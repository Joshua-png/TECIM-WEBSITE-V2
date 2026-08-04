"use client";

import {
  ArrowLeft,
  Eye,
  FilePlus2,
  Globe,
  History,
  Layers,
  Rocket,
  Save,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SITE_URL, apiFetch, getTokens } from "@/lib/api";
import type { Page, PageWithSections, Section, SectionTemplate } from "@/lib/types";
import { useData } from "@/lib/use-data";
import { PageHeader } from "@/components/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm";
import { Field, Input } from "@/components/ui/field";
import { PageLoader } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { SectionEditor } from "@/components/builder/SectionEditor";
import { SectionEditorModal } from "@/components/builder/SectionEditorModal";
import { AddSectionModal } from "@/components/builder/AddSectionModal";
import { VersionsModal } from "@/components/builder/VersionsModal";

export default function PageEditor() {
  const params = useParams<{ id: string }>();
  const pageId = params.id;
  const toast = useToast();

  const pageData = useData<PageWithSections>(`/admin/pages/${pageId}`);
  const templatesData = useData<{ templates: SectionTemplate[] }>("/admin/templates");

  const [sections, setSections] = useState<Section[]>([]);
  const [editing, setEditing] = useState<Section | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);

  const [metaOpen, setMetaOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaSlug, setMetaSlug] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const originalOrderRef = useRef<Section[]>([]);
  const droppedRef = useRef(false);
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  useEffect(() => {
    if (pageData.data) setSections(pageData.data.sections);
  }, [pageData.data]);

  useEffect(() => {
    if (pageData.data?.page) {
      setMetaTitle(pageData.data.page.title);
      setMetaSlug(pageData.data.page.slug);
    }
  }, [pageData.data?.page]);

  const reload = useCallback(() => {
    pageData.reload();
  }, [pageData]);

  const templates = templatesData.data?.templates ?? [];
  const page = pageData.data?.page;

  const handleSaveSection = async (
    sectionId: string,
    patch: { content: Record<string, unknown>; layout: string; label: string | null }
  ) => {
    setSavingId(sectionId);
    try {
      const result = await apiFetch<{ section: Section }>(`/admin/sections/${sectionId}`, {
        method: "PATCH",
        body: patch,
      });
      setSections((prev) => prev.map((s) => (s.id === sectionId ? result.section : s)));
      toast.push("success", "Section saved", result.section.label ?? result.section.template);
    } catch (err) {
      toast.push("error", "Save failed", err instanceof Error ? err.message : undefined);
    } finally {
      setSavingId(null);
    }
  };

  const openPreview = () => {
    const url = `${SITE_URL}/preview?pageId=${encodeURIComponent(pageId)}&token=${encodeURIComponent(getTokens()?.accessToken ?? "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openSectionPreview = (section: Section) => {
    const url = `${SITE_URL}/preview/section/${encodeURIComponent(section.template)}?pageId=${encodeURIComponent(pageId)}&sectionId=${encodeURIComponent(section.id)}&token=${encodeURIComponent(getTokens()?.accessToken ?? "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDragStart = (sectionId: string) => {
    originalOrderRef.current = sections;
    droppedRef.current = false;
    setDraggingId(sectionId);
  };

  const handleDragOver = (targetId: string, el: HTMLElement, clientY: number) => {
    if (!draggingId || draggingId === targetId) return;
    const list = sectionsRef.current;
    const from = list.findIndex((s) => s.id === draggingId);
    const targetIndex = list.findIndex((s) => s.id === targetId);
    if (from < 0 || targetIndex < 0) return;
    setOverId(targetId);
    const rect = el.getBoundingClientRect();
    const before = clientY < rect.top + rect.height / 2;
    let to = before ? targetIndex : targetIndex + 1;
    if (from < to) to -= 1;
    if (from === to) return;
    const reordered = list.slice();
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setSections(reordered);
  };

  const persistOrder = async (ordered: Section[]) => {
    try {
      const result = await apiFetch<{ sections: Section[] }>(
        `/admin/pages/${pageId}/sections/order`,
        { method: "PUT", body: { sectionIds: ordered.map((s) => s.id) } }
      );
      setSections(result.sections);
      toast.push("success", "Sections reordered");
    } catch (err) {
      toast.push("error", "Reorder failed", err instanceof Error ? err.message : undefined);
      reload();
    }
  };

  const handleDrop = () => {
    droppedRef.current = true;
    const ordered = sectionsRef.current;
    const changed =
      ordered.map((s) => s.id).join(",") !==
      originalOrderRef.current.map((s) => s.id).join(",");
    setDraggingId(null);
    setOverId(null);
    if (changed) void persistOrder(ordered);
  };

  const handleDragEnd = () => {
    if (!droppedRef.current) {
      const ordered = sectionsRef.current;
      const changed =
        ordered.map((s) => s.id).join(",") !==
        originalOrderRef.current.map((s) => s.id).join(",");
      if (changed) setSections(originalOrderRef.current);
    }
    droppedRef.current = false;
    setDraggingId(null);
    setOverId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/admin/sections/${deleteTarget.id}`, { method: "DELETE" });
      setSections((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.push("success", "Section removed");
      setDeleteTarget(null);
    } catch (err) {
      toast.push("error", "Delete failed", err instanceof Error ? err.message : undefined);
      setDeleteTarget(null);
    }
  };

  const handleAdd = async (data: {
    template: string;
    layout: string;
    label: string | null;
    content: Record<string, unknown>;
  }) => {
    setCreating(true);
    try {
      const result = await apiFetch<{ section: Section }>(
        `/admin/pages/${pageId}/sections`,
        { method: "POST", body: data }
      );
      setSections((prev) => [...prev, result.section]);
      setEditing(result.section);
      toast.push("success", "Section added");
    } catch (err) {
      toast.push("error", "Add failed", err instanceof Error ? err.message : undefined);
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const result = await apiFetch<{ page: Page; sections: Section[] }>(
        `/admin/pages/${pageId}/publish`,
        { method: "POST" }
      );
      setSections(result.sections);
      toast.push("success", "Published", `${result.page.title} is now live.`);
      setPublishOpen(false);
      reload();
    } catch (err) {
      toast.push("error", "Publish failed", err instanceof Error ? err.message : undefined);
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveMeta = async () => {
    setSavingMeta(true);
    try {
      const result = await apiFetch<{ page: Page }>(`/admin/pages/${pageId}`, {
        method: "PATCH",
        body: { title: metaTitle.trim(), slug: metaSlug.trim() },
      });
      toast.push("success", "Page updated", result.page.slug);
      setMetaOpen(false);
      reload();
    } catch (err) {
      toast.push("error", "Update failed", err instanceof Error ? err.message : undefined);
    } finally {
      setSavingMeta(false);
    }
  };

  if (pageData.loading || templatesData.loading) return <PageLoader />;
  if (!pageData.data || !page) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        Page not found.{" "}
        <Link href="/pages" className="text-turquoise">
          Back to pages
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <ButtonLink href="/pages" variant="subtle" size="sm">
          <ArrowLeft className="size-3.5" />
          All pages
        </ButtonLink>
      </div>

      <PageHeader
        eyebrow={page.status === "published" ? "Published" : "Draft"}
        title={page.title}
        description={`/${page.slug} · last published ${
          page.publishedAt ? new Date(page.publishedAt).toLocaleString() : "never"
        }`}
        actions={
          <>
            <Button variant="ghost" onClick={() => setVersionsOpen(true)}>
              <History className="size-4" />
              Versions
            </Button>
            <Button variant="ghost" onClick={openPreview}>
              <Eye className="size-4" />
              Preview &amp; edit
            </Button>
            {page.status === "published" ? (
              <a
                href={`${SITE_URL}/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9.5 items-center gap-2 rounded-lg px-4 text-[0.78rem] font-medium uppercase tracking-wide text-muted transition-colors hover:text-turquoise"
              >
                <Globe className="size-4" />
                View live
              </a>
            ) : null}
            <Button variant="gold" onClick={() => setPublishOpen(true)}>
              <Rocket className="size-4" />
              Publish
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-faint">
              <Layers className="size-3.5" />
              Sections · {sections.length}
            </p>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <FilePlus2 className="size-3.5" />
              Add section
            </Button>
          </div>

          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line-strong bg-panel/40 py-20 text-center">
              <Layers className="size-8 text-faint" />
              <div>
                <p className="text-sm font-medium text-ink">This page is empty</p>
                <p className="mt-1 text-xs text-muted">Add a section to start composing the page.</p>
              </div>
              <Button onClick={() => setAddOpen(true)}>
                <FilePlus2 className="size-4" />
                Add your first section
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sections.map((section, index) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  templates={templates}
                  index={index}
                  dragging={draggingId === section.id}
                  over={overId === section.id}
                  onEdit={setEditing}
                  onDelete={(id) => setDeleteTarget(sections.find((s) => s.id === id) ?? null)}
                  onPreview={openSectionPreview}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <Card title="Page details">
            <div className="space-y-3 px-5 py-4">
              <div>
                <p className="text-[0.66rem] uppercase tracking-wider text-faint">Title</p>
                <p className="mt-0.5 text-sm text-ink">{page.title}</p>
              </div>
              <div>
                <p className="text-[0.66rem] uppercase tracking-wider text-faint">Slug</p>
                <p className="mt-0.5 text-sm text-turquoise">/{page.slug}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[0.66rem] uppercase tracking-wider text-faint">Status</p>
                <StatusPill status={page.status} />
              </div>
              <div>
                <p className="text-[0.66rem] uppercase tracking-wider text-faint">Version</p>
                <p className="mt-0.5 text-sm text-muted">
                  {page.publishedVersionId ? "Versioned & immutable" : "No published version"}
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setMetaOpen(true)}>
                <Save className="size-3.5" />
                Edit title / slug
              </Button>
            </div>
          </Card>

          <Card title="Publishing" description="Design is code — publishing only updates content.">
            <div className="space-y-3 px-5 py-4">
              <Button variant="gold" className="w-full" onClick={() => setPublishOpen(true)}>
                <Send className="size-4" />
                Publish page
              </Button>
              <p className="text-[0.7rem] leading-relaxed text-faint">
                Snapshots this page into an immutable version. The public site reflects the change in
                seconds.
              </p>
            </div>
          </Card>
        </aside>
      </div>

      <AddSectionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        templates={templates}
        onCreate={(data) => handleAdd(data)}
        creating={creating}
      />

      <VersionsModal
        pageId={pageId}
        publishedVersionId={page.publishedVersionId}
        open={versionsOpen}
        onClose={() => setVersionsOpen(false)}
        onRolledBack={reload}
      />

      <SectionEditorModal
        section={editing}
        templates={templates}
        index={(editing ? sections.findIndex((s) => s.id === editing.id) : 0) + 1}
        total={sections.length}
        onClose={() => setEditing(null)}
        onSave={handleSaveSection}
        onPreview={openSectionPreview}
        saving={editing !== null && savingId === editing.id}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title="Remove this section?"
        message={`"${deleteTarget?.label ?? deleteTarget?.template ?? "section"}" will be removed from this page. This cannot be undone.`}
        danger
        confirmLabel="Remove section"
      />

      <ConfirmDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onConfirm={() => void handlePublish()}
        title="Publish this page?"
        message={`"${page.title}" and its current sections will be snapshotted and published to the live site.`}
        confirmLabel="Publish now"
        confirmLoading={publishing}
      />

      <ConfirmDialog
        open={metaOpen}
        onClose={() => setMetaOpen(false)}
        onConfirm={() => void handleSaveMeta()}
        title="Edit page details"
        message={
          <div className="space-y-4">
            <Field label="Title" required>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </Field>
            <Field label="Slug" required hint="kebab-case">
              <Input
                value={metaSlug}
                onChange={(e) =>
                  setMetaSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "")
                  )
                }
              />
            </Field>
          </div>
        }
        confirmLabel="Save changes"
        confirmLoading={savingMeta}
      />
    </div>
  );
}
