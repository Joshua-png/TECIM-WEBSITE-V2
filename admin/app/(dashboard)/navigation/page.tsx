"use client";

import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useData } from "@/lib/use-data";
import type { NavItem } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm";
import { Input, Select } from "@/components/ui/field";import { PageLoader } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

interface EditorItem {
  key: string;
  label: string;
  url: string;
  target: "_self" | "_blank";
  isActive: boolean;
  depth: number;
}

function flattenTree(items: NavItem[], depth = 0): EditorItem[] {
  const out: EditorItem[] = [];
  for (const item of items) {
    out.push({
      key: item.id,
      label: item.label,
      url: item.url ?? "",
      target: item.target,
      isActive: item.isActive,
      depth,
    });
    out.push(...flattenTree(item.children ?? [], depth + 1));
  }
  return out;
}

export default function NavigationPage() {
  const { data, loading, reload } = useData<{ navigation: NavItem[] }>("/admin/navigation");
  const [items, setItems] = useState<EditorItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<number | null>(null);
  const toast = useToast();

  const tree = useMemo(() => data?.navigation ?? [], [data]);

  if (!loaded && !loading && data) {
    setItems(flattenTree(tree));
    setLoaded(true);
  }

  const move = (index: number, delta: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const update = (index: number, patch: Partial<EditorItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const add = () => {
    setItems((prev) => [
      ...prev,
      { key: `new-${Date.now()}`, label: "New link", url: "#", target: "_self", isActive: true, depth: 0 },
    ]);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    const payload = items
      .filter((item) => item.label.trim().length > 0)
      .map((item, index) => ({
        label: item.label.trim(),
        url: item.url.trim() || null,
        target: item.target,
        parentId: null,
        displayOrder: index,
        isActive: item.isActive,
      }));
    try {
      await apiFetch("/admin/navigation", { method: "PUT", body: { items: payload } });
      toast.push("success", "Navigation saved");
      reload();
      setLoaded(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = () => {
    if (removeTarget !== null) {
      setItems((prev) => prev.filter((_, i) => i !== removeTarget));
      setRemoveTarget(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        eyebrow="Structure"
        title="Navigation"
        description="Menu links shown in the site header. Order top to bottom, active links appear on the site."
        actions={
          <Button onClick={() => void save()} loading={saving}>
            <Save className="size-4" />
            Save menu
          </Button>
        }
      />

      <Card>
        <div className="divide-y divide-line">
          {items.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-muted">No menu items yet.</p>
              <Button variant="ghost" size="sm" className="mt-3" onClick={add}>
                <Plus className="size-4" />
                Add first link
              </Button>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item.key}
                className="flex items-center gap-3 px-4 py-3"
                style={{ paddingLeft: `${12 + item.depth * 20}px` }}
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded p-0.5 text-muted transition-colors hover:text-turquoise disabled:opacity-30"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="rounded p-0.5 text-muted transition-colors hover:text-turquoise disabled:opacity-30"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
                <div className="grid flex-1 gap-2 sm:grid-cols-[1.2fr_1fr_auto]">
                  <Input
                    value={item.label}
                    onChange={(e) => update(index, { label: e.target.value })}
                    placeholder="Label"
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => update(index, { url: e.target.value })}
                    placeholder="URL or #anchor"
                  />
                  <Select
                    value={item.target}
                    onChange={(e) => update(index, { target: e.target.value as "_self" | "_blank" })}
                  >
                    <option value="_self">Same tab</option>
                    <option value="_blank">New tab</option>
                  </Select>
                </div>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-2 text-xs transition-colors",
                    item.isActive ? "text-turquoise" : "text-faint"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) => update(index, { isActive: e.target.checked })}
                    className="size-4 accent-turquoise"
                  />
                  Active
                </label>
                <button
                  onClick={() => setRemoveTarget(index)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-rose/10 hover:text-rose"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t border-line px-4 py-3">
          <Button variant="ghost" size="sm" onClick={add}>
            <Plus className="size-4" />
            Add link
          </Button>
          <span className="text-xs text-faint">{items.length} items</span>
        </div>
      </Card>

      {error ? (
        <div className="mt-4 rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-2.5 text-sm text-rose">
          {error}
        </div>
      ) : null}

      <ConfirmDialog
        open={removeTarget !== null}
        onClose={() => setRemoveTarget(null)}
        onConfirm={remove}
        title="Remove this link?"
        message="It will be removed from the menu on save."
        danger
        confirmLabel="Remove"
      />
    </div>
  );
}
