"use client";

import { CalendarPlus, Pencil, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { fromLocalInput, toLocalDate, toLocalInput } from "@/lib/format";
import type { ContentStatus } from "@/lib/types";
import { useData } from "@/lib/use-data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm";
import { EmptyState } from "@/components/ui/empty";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { PageLoader } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { MediaPicker } from "@/components/forms/MediaPicker";
import type { Media } from "@/lib/types";

export type FieldType = "text" | "textarea" | "datetime" | "date" | "number" | "url" | "media" | "boolean";

export type CollectionField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  rows?: number;
  full?: boolean;
};

type Row = {
  id: string;
  status: ContentStatus;
  [key: string]: unknown;
};

export function CollectionManager({
  title,
  eyebrow,
  description,
  singular,
  listPath,
  dataKey,
  fields,
  defaultValues,
  renderRow,
}: {
  title: string;
  eyebrow: string;
  description: string;
  singular: string;
  listPath: string;
  dataKey: "events" | "gallery" | "sermons" | "announcements";
  fields: CollectionField[];
  defaultValues: Record<string, unknown>;
  renderRow: (item: Row) => { title: string; subtitle: string; thumbnail?: string | null };
}) {
  const { data, loading, reload } = useData<Record<string, Row[]>>(listPath);
  const rows = useMemo(() => data?.[dataKey] ?? [], [data, dataKey]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [mediaPickerFor, setMediaPickerFor] = useState<string | null>(null);
  const toast = useToast();

  const openCreate = () => {
    setEditing(null);
    setValues({ ...defaultValues });
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    const next: Record<string, unknown> = {};
    for (const field of fields) {
      const value = row[field.key];
      if (field.type === "datetime") {
        next[field.key] = toLocalInput(typeof value === "string" ? value : null);
      } else if (field.type === "date") {
        next[field.key] = toLocalDate(typeof value === "string" ? value : null);
      } else {
        next[field.key] = value ?? "";
      }
    }
    setValues(next);
    setError(null);
    setFormOpen(true);
  };

  const buildPayload = (): Record<string, unknown> => {
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const rawValue = values[field.key];
      if (field.type === "boolean") {
        payload[field.key] = Boolean(rawValue);
        continue;
      }
      if (field.type === "datetime") {
        const raw = typeof rawValue === "string" ? rawValue : "";
        payload[field.key] = raw ? fromLocalInput(raw) : null;
        continue;
      }
      if (field.type === "date") {
        const raw = typeof rawValue === "string" ? rawValue : "";
        payload[field.key] = raw || null;
        continue;
      }
      if (field.type === "number") {
        const raw = typeof rawValue === "string" ? rawValue.trim() : "";
        payload[field.key] = raw === "" ? null : Number(raw);
        continue;
      }
      const raw = typeof rawValue === "string" ? rawValue.trim() : rawValue;
      payload[field.key] = raw || null;
    }
    return payload;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const payload = buildPayload();
    try {
      if (editing) {
        await apiFetch(`${listPath}/${editing.id}`, {
          method: "PATCH",
          body: payload,
        });
        toast.push("success", `${singular} updated`);
      } else {
        await apiFetch(listPath, { method: "POST", body: payload });
        toast.push("success", `${singular} created`);
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  const toggleStatus = async (row: Row) => {
    const next: ContentStatus = row.status === "published" ? "draft" : "published";
    try {
      await apiFetch(`${listPath}/${row.id}`, {
        method: "PATCH",
        body: { status: next },
      });
      toast.push("success", next === "published" ? "Published" : "Moved to draft", row.title as string);
      reload();
    } catch (err) {
      toast.push("error", "Update failed", err instanceof Error ? err.message : undefined);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiFetch(`${listPath}/${deleteTarget.id}`, { method: "DELETE" });
      toast.push("success", `${singular} deleted`);
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
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <Button onClick={openCreate}>
            <CalendarPlus className="size-4" />
            New {singular.toLowerCase()}
          </Button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title={`No ${title.toLowerCase()} yet`}
          description={`Create your first ${singular.toLowerCase()} to get started.`}
          action={
            <Button onClick={openCreate}>
              <CalendarPlus className="size-4" />
              New {singular.toLowerCase()}
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const rendered = renderRow(row);
            return (
              <div
                key={row.id}
                className="flex items-center gap-4 rounded-2xl border border-line bg-panel px-4 py-3.5 transition-colors hover:border-line-strong"
              >
                {rendered.thumbnail ? (
                  <span className="size-14 shrink-0 overflow-hidden rounded-lg border border-line bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rendered.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </span>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{rendered.title}</p>
                  <p className="truncate text-xs text-muted">{rendered.subtitle}</p>
                </div>
                <StatusPill status={row.status} />
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => void toggleStatus(row)}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-white/[0.06] hover:text-turquoise"
                    title={row.status === "published" ? "Move to draft" : "Publish"}
                  >
                    <Send className="size-4" />
                  </button>
                  <button
                    onClick={() => openEdit(row)}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-white/[0.06] hover:text-turquoise"
                    title="Edit"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(row)}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-rose/10 hover:text-rose"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}
        wide
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} loading={saving}>
              {editing ? "Save changes" : `Create ${singular.toLowerCase()}`}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const value = values[field.key];
            if (field.type === "boolean") {
              return (
                <label
                  key={field.key}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-white/[0.03] px-3.5 py-2.5 sm:col-span-2"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.checked })}
                    className="size-4 accent-turquoise"
                  />
                  <span className="text-sm text-ink">{field.label}</span>
                </label>
              );
            }
            if (field.type === "media") {
              return (
                <Field
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  hint={field.hint}
                  className={field.full ? "sm:col-span-2" : ""}
                >
                  <div className="flex gap-2">
                    <Input
                      value={typeof value === "string" ? value : ""}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder="Media UUID"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setMediaPickerFor(field.key)}
                    >
                      Pick
                    </Button>
                  </div>
                </Field>
              );
            }
            if (field.type === "textarea") {
              return (
                <Field
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  className={field.full ? "sm:col-span-2" : ""}
                >
                  <Textarea
                    value={typeof value === "string" ? value : ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    rows={field.rows ?? 3}
                    placeholder={field.placeholder}
                  />
                </Field>
              );
            }
            return (
              <Field
                key={field.key}
                label={field.label}
                required={field.required}
                hint={field.hint}
                className={field.full ? "sm:col-span-2" : ""}
              >
                <Input
                  type={
                    field.type === "datetime"
                      ? "datetime-local"
                      : field.type === "date"
                        ? "date"
                        : field.type === "url"
                          ? "url"
                          : field.type === "number"
                            ? "number"
                            : "text"
                  }
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                />
              </Field>
            );
          })}
        </div>

        {error ? (
          <div className="mt-4 rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-2.5 text-sm text-rose">
            {error}
          </div>
        ) : null}
      </Modal>

      <MediaPicker
        open={mediaPickerFor !== null}
        onClose={() => setMediaPickerFor(null)}
        onSelect={(media: Media) => {
          if (mediaPickerFor) setValues({ ...values, [mediaPickerFor]: media.id });
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title={`Delete this ${singular.toLowerCase()}?`}
        message={`"${(deleteTarget?.title as string) ?? ""}" will be permanently removed.`}
        danger
        confirmLabel={`Delete ${singular.toLowerCase()}`}
      />
    </div>
  );
}
