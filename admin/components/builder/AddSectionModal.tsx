"use client";

import { ArrowLeft, LayoutTemplate } from "lucide-react";
import { useState } from "react";
import type { SectionTemplate } from "@/lib/types";
import { createDefaultContent, layoutOptions } from "@/lib/template-helpers";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { cn } from "@/lib/cn";

export function AddSectionModal({
  open,
  onClose,
  templates,
  onCreate,
  creating,
}: {
  open: boolean;
  onClose: () => void;
  templates: SectionTemplate[];
  onCreate: (data: {
    template: string;
    layout: string;
    label: string | null;
    content: Record<string, unknown>;
  }) => Promise<void>;
  creating: boolean;
}) {
  const [selected, setSelected] = useState<SectionTemplate | null>(null);
  const [layout, setLayout] = useState("default");
  const [label, setLabel] = useState("");

  const handleClose = () => {
    setSelected(null);
    setLayout("default");
    setLabel("");
    onClose();
  };

  const pick = (template: SectionTemplate) => {
    const options = layoutOptions(template.slug);
    setSelected(template);
    setLayout(options[0] ?? "default");
  };

  const handleCreate = async () => {
    if (!selected) return;
    await onCreate({
      template: selected.slug,
      layout,
      label: label.trim() ? label.trim() : null,
      content: createDefaultContent(selected.schema as Record<string, unknown>),
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={selected ? "Configure section" : "Add a section"}
      subtitle={
        selected
          ? `${selected.name} — content is validated against this template.`
          : "Choose a pre-built template. Design stays locked; you edit content only."
      }
      wide
      footer={
        selected ? (
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button onClick={() => void handleCreate()} loading={creating}>
              Add section
            </Button>
          </>
        ) : undefined
      }
    >
      {selected ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-turquoise/25 bg-turquoise/8 p-4">
            <LayoutTemplate className="mt-0.5 size-5 shrink-0 text-turquoise" />
            <div>
              <p className="font-serif text-lg font-semibold text-ink">{selected.name}</p>
              <p className="text-sm text-muted">{selected.description}</p>
            </div>
          </div>
          <Field label="Label" hint="Internal name shown in the builder">
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Opening hero"
              autoFocus
            />
          </Field>
          <Field label="Layout variant" hint="Preset only">
            <Select value={layout} onChange={(e) => setLayout(e.target.value)}>
              {layoutOptions(selected.slug).map((option) => (
                <option key={option} value={option}>
                  {option.replace(/_/g, " ")}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => pick(template)}
              className={cn(
                "group flex items-start gap-3 rounded-xl border border-line bg-canvas-soft/50 p-4 text-left transition-all hover:border-turquoise/40 hover:bg-overlay-strong"
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-panel">
                <LayoutTemplate className="size-4 text-turquoise" />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">{template.name}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                  {template.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
