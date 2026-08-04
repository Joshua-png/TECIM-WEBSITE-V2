"use client";

import { ChevronDown, ChevronUp, Eye, GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Section, SectionTemplate } from "@/lib/types";
import { templateDisplayName } from "@/lib/template-helpers";
import { StatusPill } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export function SectionEditor({
  section,
  templates,
  index,
  total,
  onEdit,
  onDelete,
  onMove,
  onPreview,
}: {
  section: Section;
  templates: SectionTemplate[];
  index: number;
  total: number;
  onEdit: (section: Section) => void;
  onDelete: (sectionId: string) => void;
  onMove: (sectionId: string, direction: -1 | 1) => void;
  onPreview: (section: Section) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-4 py-3 transition-colors hover:border-line-strong">
      <GripVertical className="size-4 shrink-0 text-faint" />
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/[0.05] font-serif text-sm text-faint">
        {String(index + 1).padStart(2, "0")}
      </span>
      <button
        onClick={() => onEdit(section)}
        className="min-w-0 flex-1 rounded-lg px-1.5 py-1 text-left transition-colors hover:bg-white/[0.04]"
      >
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
          onClick={() => onEdit(section)}
          className={cn(
            "rounded-md p-1.5 transition-colors hover:bg-turquoise/12 hover:text-turquoise",
            "text-turquoise"
          )}
          aria-label={`Edit ${section.label || section.template}`}
          title="Edit this section"
        >
          <Pencil className="size-4" />
        </button>
      </div>
    </div>
  );
}
