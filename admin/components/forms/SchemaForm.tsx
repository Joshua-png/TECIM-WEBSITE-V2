"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { humanize, isImageField, type JsonSchema } from "@/lib/template-helpers";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/components/forms/MediaPicker";
import type { Media } from "@/lib/types";

export function SchemaForm({
  schema,
  value,
  onChange,
}: {
  schema: JsonSchema;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const properties = schema.properties ?? {};

  return (
    <div className="space-y-4">
      {Object.entries(properties).map(([key, prop]) => (
        <SchemaField
          key={key}
          name={key}
          schema={prop}
          value={value[key]}
          onChange={(next) => onChange({ ...value, [key]: next })}
        />
      ))}
    </div>
  );
}

function SchemaField({
  name,
  schema,
  value,
  onChange,
}: {
  name: string;
  schema: JsonSchema;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const label = humanize(name);

  if (isImageField(schema)) {
    return <ImageField label={label} value={value} onChange={onChange} />;
  }

  if (schema.type === "string") {
    const isLong = /description|body|subtitle|text|address|verse/i.test(name);
    if (isLong) {
      return (
        <Field label={label}>
          <Textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
          />
        </Field>
      );
    }
    if (schema.enum) {
      return (
        <Field label={label}>
          <Select value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
            {schema.enum.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>
      );
    }
    return (
      <Field label={label}>
        <Input value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
      </Field>
    );
  }

  if (schema.type === "array") {
    return (
      <ArrayField name={label} schema={schema} value={value} onChange={onChange} />
    );
  }

  if (schema.type === "object") {
    const obj = (value as Record<string, unknown>) ?? {};
    return (
      <fieldset className="rounded-xl border border-line bg-canvas-soft/60 p-4">
        <legend className="px-2 text-[0.68rem] font-semibold uppercase tracking-wider text-faint">
          {label}
        </legend>
        <SchemaForm schema={schema} value={obj} onChange={onChange} />
      </fieldset>
    );
  }

  if (schema.type === "boolean") {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-white/[0.03] px-3.5 py-2.5">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="size-4 accent-turquoise"
        />
        <span className="text-sm text-ink">{label}</span>
      </label>
    );
  }

  return (
    <Field label={label}>
      <Input
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function ArrayField({
  name,
  schema,
  value,
  onChange,
}: {
  name: string;
  schema: JsonSchema;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const items = Array.isArray(value) ? value : [];
  const itemSchema = schema.items;
  const isObjectItems = itemSchema?.type === "object";
  const isStringItems = itemSchema?.type === "string";

  const update = (index: number, next: unknown) => {
    const copy = items.slice();
    copy[index] = next;
    onChange(copy);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    if (isObjectItems) {
      onChange([...items, makeItemDefault(itemSchema)]);
    } else if (isStringItems) {
      onChange([...items, ""]);
    } else {
      onChange([...items, ""]);
    }
  };

  return (
    <fieldset className="rounded-xl border border-line bg-canvas-soft/60 p-4">
      <legend className="px-2 text-[0.68rem] font-semibold uppercase tracking-wider text-faint">
        {name} · {items.length}
      </legend>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="relative rounded-lg border border-line bg-panel p-3.5">
            <button
              onClick={() => remove(index)}
              className="absolute right-2.5 top-2.5 rounded-md p-1 text-faint transition-colors hover:bg-rose/10 hover:text-rose"
              aria-label={`Remove ${name} item`}
            >
              <Trash2 className="size-3.5" />
            </button>
            {isObjectItems && itemSchema ? (
              <div className="pr-6">
                <SchemaForm
                  schema={itemSchema}
                  value={(item as Record<string, unknown>) ?? {}}
                  onChange={(next) => update(index, next)}
                />
              </div>
            ) : (
              <Input
                value={typeof item === "string" ? item : ""}
                onChange={(e) => update(index, e.target.value)}
                className="pr-8"
              />
            )}
          </div>
        ))}
        {items.length === 0 ? (
          <p className="py-2 text-center text-xs text-faint">No items yet.</p>
        ) : null}
        <Button variant="ghost" size="sm" onClick={add} className="w-full">
          <Plus className="size-3.5" />
          Add {name.toLowerCase()}
        </Button>
      </div>
    </fieldset>
  );
}

function makeItemDefault(schema: JsonSchema | undefined): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (!schema?.properties) return result;
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (isImageField(prop) || prop.type === "string") {
      result[key] = prop.enum?.[0] ?? "";
    } else if (prop.type === "array") {
      result[key] = [];
    } else if (prop.type === "object") {
      result[key] = {};
    }
  }
  return result;
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const current = typeof value === "string" ? value : "";

  const handlePick = (media: Media) => {
    onChange(media.secureUrl);
  };

  return (
    <Field label={label} hint="URL or media library">
      <div className="flex gap-2">
        <Input
          value={current}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or pick from library"
          className="flex-1"
        />
        <Button type="button" variant="ghost" size="sm" onClick={() => setPickerOpen(true)}>
          Library
        </Button>
      </div>
      {current ? (
        <div className="mt-2 overflow-hidden rounded-lg border border-line bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current} alt="" className="h-24 w-full object-cover" />
        </div>
      ) : null}
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handlePick}
      />
    </Field>
  );
}
