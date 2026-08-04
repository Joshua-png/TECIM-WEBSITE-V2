"use client";

import { CalendarDays, Eye, LayoutTemplate, Save, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Section, SectionTemplate } from "@/lib/types";
import { layoutOptions, templateDisplayName } from "@/lib/template-helpers";
import { SchemaForm } from "@/components/forms/SchemaForm";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { cn } from "@/lib/cn";

export function SectionEditorModal({
  section,
  templates,
  index,
  total,
  onClose,
  onSave,
  onPreview,
  saving,
}: {
  section: Section | null;
  templates: SectionTemplate[];
  index: number;
  total: number;
  onClose: () => void;
  onSave: (
    sectionId: string,
    patch: { content: Record<string, unknown>; layout: string; label: string | null }
  ) => Promise<void>;
  onPreview: (section: Section) => void;
  saving: boolean;
}) {
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [label, setLabel] = useState("");
  const [layout, setLayout] = useState("default");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (section) {
      setContent(section.content);
      setLabel(section.label ?? "");
      setLayout(section.layout);
      setDirty(false);
    }
  }, [section]);

  if (!section) return null;

  const template = templates.find((t) => t.slug === section.template);
  const layouts = layoutOptions(section.template);

  const handleSave = async () => {
    await onSave(section.id, {
      content,
      layout,
      label: label.trim() ? label.trim() : null,
    });
    setDirty(false);
  };

  const handleDiscard = () => {
    setContent(section.content);
    setLabel(section.label ?? "");
    setLayout(section.layout);
    setDirty(false);
  };

  return (
    <Modal
      open
      onClose={onClose}
      wide
      scrollBody
      title={`Editing: ${templateDisplayName(section.template, templates)}`}
      subtitle={
        <span>
          {index > 0 ? `Section ${index} of ${total} · ` : ""}
          <span className="text-faint">Design stays locked — you edit text and images only.</span>
        </span>
      }
      footer={
        <>
          <Button variant="ghost" onClick={() => onPreview(section)}>
            <Eye className="size-4" />
            Preview &amp; edit
          </Button>
          <Button variant="ghost" onClick={handleDiscard} disabled={!dirty || saving}>
            <X className="size-4" />
            Discard
          </Button>
          <Button onClick={() => void handleSave()} loading={saving} disabled={!dirty}>
            <Save className="size-4" />
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {template?.description ? (
          <div className="flex items-start gap-3 rounded-xl border border-turquoise/25 bg-turquoise/8 p-4">
            <LayoutTemplate className="mt-0.5 size-5 shrink-0 text-turquoise" />
            <p className="text-sm leading-relaxed text-muted">{template.description}</p>
          </div>
        ) : null}

        {section.template === "events" ? (
          <div className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.03] p-4">
            <CalendarDays className="mt-0.5 size-5 shrink-0 text-turquoise" />
            <p className="text-sm leading-relaxed text-muted">
              Event cards come from the{" "}
              <Link href="/events" className="text-turquoise underline underline-offset-2 hover:text-turquoise/80">
                Events page
              </Link>
              . Add or edit events there — published events appear here automatically.
            </p>
          </div>
        ) : null}

        {section.template === "gallery" ? (
          <div className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.03] p-4">
            <CalendarDays className="mt-0.5 size-5 shrink-0 text-turquoise" />
            <p className="text-sm leading-relaxed text-muted">
              Marquee images come from the{" "}
              <Link href="/gallery" className="text-turquoise underline underline-offset-2 hover:text-turquoise/80">
                Gallery page
              </Link>
              . Add or edit images there — published images appear here automatically.
            </p>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Section label" hint="Helps you recognise this section in the list">
            <Input
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                setDirty(true);
              }}
              placeholder="e.g. Opening hero"
              autoFocus
            />
          </Field>
          <Field label="Layout variant" hint="Preset layouts only">
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
          </Field>
        </div>

        {template?.schema ? (
          <div>
            <p
              className={cn(
                "mb-3 flex items-center gap-2 border-b border-line pb-2 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-faint"
              )}
            >
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
          <p className="text-sm text-rose">
            Unknown template &quot;{section.template}&quot; — cannot render fields.
          </p>
        )}
      </div>
    </Modal>
  );
}
