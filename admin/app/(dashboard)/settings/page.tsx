"use client";

import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useData } from "@/lib/use-data";
import type { Setting } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { PageLoader } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { ChangePasswordCard } from "@/components/settings/change-password-card";
import { cn } from "@/lib/cn";

type FieldSpec =
  | { type: "text"; key: string; label: string }
  | { type: "textarea"; key: string; label: string; rows?: number }
  | { type: "list"; key: string; label: string }
  | { type: "rows"; key: string; label: string; columns: { key: string; label: string; type?: "text" }[] };

const GROUP_ORDER = ["site", "contact", "social"] as const;
const GROUP_NAMES: Record<string, string> = {
  site: "Site",
  contact: "Contact",
  social: "Social",
};
const GROUP_DESCRIPTIONS: Record<string, string> = {
  site: "Name, tagline, logo and announcement shown across the site.",
  contact: "Email, phones, address and weekly service times.",
  social: "Public social profile links.",
};

const GROUP_FIELDS: Record<string, FieldSpec[]> = {
  site: [
    { type: "text", key: "name", label: "Site name" },
    { type: "text", key: "shortName", label: "Short name" },
    { type: "text", key: "tagline", label: "Tagline" },
    { type: "textarea", key: "announcement", label: "Announcement", rows: 2 },
  ],
  contact: [
    { type: "text", key: "email", label: "Email" },
    { type: "list", key: "phones", label: "Phone numbers" },
    { type: "textarea", key: "address", label: "Address", rows: 2 },
    {
      type: "rows",
      key: "serviceTimes",
      label: "Service times",
      columns: [
        { key: "day", label: "Day" },
        { key: "time", label: "Time" },
        { key: "label", label: "Label" },
      ],
    },
  ],
  social: [
    { type: "text", key: "facebook", label: "Facebook URL" },
    { type: "text", key: "instagram", label: "Instagram URL" },
    { type: "text", key: "youtube", label: "YouTube URL" },
    { type: "text", key: "x", label: "X (Twitter) URL" },
  ],
};

function JsonEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const valid = useMemo(() => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }, [value]);

  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={10}
      className={cn("font-mono text-xs", !valid && "border-rose/60")}
    />
  );
}

function SettingForm({ setting }: { setting: Setting }) {
  const [value, setValue] = useState<Record<string, unknown>>(() => ({ ...(setting.value ?? {}) }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const specs = GROUP_FIELDS[setting.key];

  useEffect(() => {
    setValue({ ...(setting.value ?? {}) });
  }, [setting.key, setting.value]);

  const set = (key: string, next: unknown) => setValue((prev) => ({ ...prev, [key]: next }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/admin/settings/${setting.key}`, { method: "PUT", body: { value } });
      toast.push("success", "Settings saved", GROUP_NAMES[setting.key] ?? setting.key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
        <div>
          <h3 className="font-serif text-lg text-ink">{GROUP_NAMES[setting.key] ?? setting.key}</h3>
          <p className="text-xs text-muted">{GROUP_DESCRIPTIONS[setting.key] ?? "Managed setting"}</p>
        </div>
        <Button onClick={() => void save()} loading={saving} size="sm">
          <Save className="size-4" />
          Save
        </Button>
      </div>

      <div className="p-6">
        {specs ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {specs.map((spec) => {
              const current = value[spec.key];
              if (spec.type === "textarea") {
                return (
                  <Field key={spec.key} label={spec.label} className="sm:col-span-2">
                    <Textarea
                      value={typeof current === "string" ? current : current ? String(current) : ""}
                      onChange={(e) => set(spec.key, e.target.value || null)}
                      rows={spec.rows ?? 2}
                    />
                  </Field>
                );
              }
              if (spec.type === "list") {
                const items = Array.isArray(current) ? current.map((i) => String(i)) : [];
                return (
                  <Field key={spec.key} label={spec.label} className="sm:col-span-2">
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => {
                              const next = [...items];
                              next[index] = e.target.value;
                              set(spec.key, next.filter(Boolean));
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => set(spec.key, items.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => set(spec.key, [...items, ""])}
                      >
                        Add {spec.label.toLowerCase()}
                      </Button>
                    </div>
                  </Field>
                );
              }
              if (spec.type === "rows") {
                const rows = Array.isArray(current)
                  ? current.map((r) => r as Record<string, unknown>)
                  : [];
                return (
                  <Field key={spec.key} label={spec.label} className="sm:col-span-2">
                    <div className="space-y-3">
                      {rows.map((row, index) => (
                        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                          {spec.columns.map((col) => {
                            const cell = row[col.key];
                            return (
                              <Input
                                key={col.key}
                                placeholder={col.label}
                                value={typeof cell === "string" ? cell : ""}
                                onChange={(e) => {
                                  const next = rows.map((r, i) =>
                                    i === index ? { ...r, [col.key]: e.target.value } : r
                                  );
                                  set(spec.key, next);
                                }}
                              />
                            );
                          })}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => set(spec.key, rows.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          set(spec.key, [
                            ...rows,
                            Object.fromEntries(spec.columns.map((c) => [c.key, ""])),
                          ])
                        }
                      >
                        Add {spec.label.toLowerCase()}
                      </Button>
                    </div>
                  </Field>
                );
              }
              return (
                <Field key={spec.key} label={spec.label}>
                  <Input
                    value={typeof current === "string" ? current : current ? String(current) : ""}
                    onChange={(e) => set(spec.key, e.target.value || null)}
                  />
                </Field>
              );
            })}
          </div>
        ) : (
          <div>
            <p className="mb-2 text-xs text-muted">Raw JSON value</p>
            <JsonEditor
              value={JSON.stringify(value ?? {}, null, 2)}
              onChange={(next) => {
                try {
                  setValue(JSON.parse(next));
                  setError(null);
                } catch {
                  setError("Invalid JSON");
                }
              }}
            />
            {error ? (
              <p className={cn("mt-2 text-xs", error === "Invalid JSON" ? "text-rose" : "text-rose")}>
                {error}
              </p>
            ) : null}
          </div>
        )}

        {error && specs ? (
          <div className="mt-4 rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-2.5 text-sm text-rose">
            {error}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default function SettingsPage() {
  const { data, loading } = useData<{ settings: Setting[] }>("/admin/settings");
  const settings = useMemo(() => {
    const rows = data?.settings ?? [];
    const ordered = [...rows].sort((a, b) => {
      const ia = GROUP_ORDER.indexOf(a.key as (typeof GROUP_ORDER)[number]);
      const ib = GROUP_ORDER.indexOf(b.key as (typeof GROUP_ORDER)[number]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    return ordered;
  }, [data]);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Structure"
        title="Settings"
        description="Site-wide contact information and announcement defaults."
      />
      <div className="space-y-6">
        {settings.map((setting) => (
          <SettingForm key={setting.key} setting={setting} />
        ))}
        <ChangePasswordCard />
      </div>
    </div>
  );
}
