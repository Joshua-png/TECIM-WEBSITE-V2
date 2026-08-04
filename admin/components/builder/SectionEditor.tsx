"use client";

import { ChevronDown, ChevronUp, Eye, GripVertical, Pencil, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Section, SectionTemplate } from "@/lib/types";
import { layoutOptions, templateDisplayName } from "@/lib/template-helpers";
import { SchemaForm } from "@/components/forms/SchemaForm";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { StatusPill } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export function SectionEditor({
  section,
  templates,
  index,
  total,
  expanded,
  onToggle,
  onSave,
  onDelete,
  onMove,
  onPreview,
  saving,
}: {
  section: Section;
  templates: SectionTemplate[];
  index: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
  onSave: (sectionId: string, patch: { content: Record<string, unknown>; layout: string; label: string | null }) => Promise<void>;
  onDelete: (sectionId: string) => void;
  onMove: (sectionId: string, direction: -1 | 1) => void;
  onPreview: (section: Section) => void;
  saving: boolean;
}) {
  const template = templates.find((t) => t.slug === section.template);
  const [content, setContent] = useState<Record<string, unknown>>(section.content);
  const [label, setLabel] = useState(section.label ?? "");
  const [layout, setLayout] = useState(section.layout);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (expanded) {
      setContent(section.content);
      setLabel(section.label ?? "");
      setLayout(section.layout);
      setDirty(false);
    }
  }, [expanded, section]);

  const handleSave = async () => {
    await onSave(section.id, {
      content,
      layout,
      label: label.trim() ? label.trim() : null,
    });
    setDirty(false);
  };

  const layouts = layoutOptions(section.template);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-panel transition-colors",
        expanded ? "border-turquoise/40" : "border-line"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="size-4 shrink-0 text-faint" />
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/[0.05] font-serif text-sm text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
        <button onClick={onToggle} className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-medium text-ink">
            {templateDisplayName(section.template, templates)}
          </p>
          <p className="truncate text-xs text-faint">
            {section.label || "Unlabelled"} · {section.layout}
          </p>
        </button>
        <StatusPill status={section.status} />
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onPreview(section)}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-turquoise/10 hover:text-turquoise"
            aria-label={`Preview ${section.label || section.template}`}
            title="Preview this section"
          >
            <Eye className="size-4" />
          </button>
          <button
            onClick={() => onMove(section.id, -1)}
            disabled={index === 0}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Move up"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            onClick={() => onMove(section.id, 1)}
            disabled={index === total - 1}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Move down"
          >
            <ChevronDown className="size-4" />
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-rose/10 hover:text-rose"
            aria-label="Delete section"
          >
            <Trash2 className="size-4" />
          </button>
          <button
            onClick={onToggle}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
            aria-label={expanded ? "Collapse" : "Edit"}
          >
            {expanded ? <X className="size-4" /> : <Pencil className="size-4" />}
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="border-t border-line bg-canvas-soft/40 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-wider text-muted">
                Label
              </span>
              <input
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  setDirty(true);
                }}
                placeholder="Internal name for this section"
                className="h-9.5 w-full rounded-lg border border-line bg-white/[0.03] px-3.5 text-sm text-ink outline-none transition-colors focus:border-turquoise/70 focus:ring-2 focus:ring-turquoise/15"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-wider text-muted">
                Layout variant
              </span>
              <Select
                value={layout}
                onChange={(e) => {
                  setLayout(e.target.value);
                  setDirty(true);
                }}
              >
                {layouts.map((option) => (
                  <option key={option} value={option}>
                    {option.replace(/_/g, " ")}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          {template?.schema ? (
            <div className="mt-4">
              <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-faint">
                Content fields
              </p>
              <SchemaForm
                schema={template.schema as Record<string, unknown>}
                value={content}
                onChange={(next) => {
                  setContent(next);
                  setDirty(true);
                }}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-rose">
              Unknown template &quot;{section.template}&quot; — cannot render fields.
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-line pt-4">
            <Button variant="ghost" size="sm" onClick={() => onPreview(section)}>
              <Eye className="size-3.5" />
              Preview section
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setContent(section.content);
                setLabel(section.label ?? "");
                setLayout(section.layout);
                setDirty(false);
              }}
              disabled={!dirty || saving}
            >
              <X className="size-3.5" />
              Discard
            </Button>
            <Button size="sm" onClick={() => void handleSave()} loading={saving} disabled={!dirty}>
              <Save className="size-3.5" />
              Save section
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
