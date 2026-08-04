"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Version } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm";
import { useToast } from "@/components/ui/toast";
import { formatDateTime } from "@/lib/format";

export function VersionsModal({
  pageId,
  publishedVersionId,
  open,
  onClose,
  onRolledBack,
}: {
  pageId: string;
  publishedVersionId: string | null;
  open: boolean;
  onClose: () => void;
  onRolledBack: () => void | Promise<void>;
}) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [rollbackTarget, setRollbackTarget] = useState<Version | null>(null);
  const [rolling, setRolling] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    apiFetch<{ versions: Version[] }>(`/admin/pages/${pageId}/versions`)
      .then((result) => {
        if (!cancelled) setVersions(result.versions);
      })
      .catch(() => {
        if (!cancelled) toast.push("error", "Failed to load versions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pageId]);

  const handleRollback = async () => {
    if (!rollbackTarget) return;
    setRolling(true);
    try {
      await apiFetch(`/admin/pages/${pageId}/rollback/${rollbackTarget.id}`, { method: "POST" });
      toast.push("success", "Rolled back", `Restored version ${rollbackTarget.number} and re-published.`);
      setRollbackTarget(null);
      await onRolledBack();
      onClose();
    } catch (err) {
      toast.push("error", "Rollback failed", err instanceof Error ? err.message : undefined);
    } finally {
      setRolling(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Version history"
        subtitle="Immutable snapshots of this page, newest first."
        footer={
          <p className="mr-auto text-xs text-faint">
            Rolling back restores the snapshot and re-publishes.
          </p>
        }
      >
        {loading ? (
          <p className="py-10 text-center text-sm text-muted">Loading versions…</p>
        ) : versions.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">No versions yet.</p>
        ) : (
          <ol className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-1 before:bottom-1 before:w-px before:bg-line-strong">
            {versions.map((version) => {
              const isCurrent = version.id === publishedVersionId;
              return (
                <li key={version.id} className="relative">
                  <span
                    className={`absolute -left-[22px] top-1.5 size-2.5 rounded-full border-2 ${
                      isCurrent
                        ? "border-turquoise bg-turquoise"
                        : "border-line-strong bg-panel"
                    }`}
                  />
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas-soft/50 px-4 py-3">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium text-ink">
                        Version #{version.number}
                        {isCurrent ? (
                          <span className="rounded-full border border-turquoise/30 bg-turquoise/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-turquoise">
                            Live
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{formatDateTime(version.createdAt)}</p>
                    </div>
                    {!isCurrent ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRollbackTarget(version)}
                      >
                        <RotateCcw className="size-3.5" />
                        Rollback
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Modal>

      <ConfirmDialog
        open={rollbackTarget !== null}
        onClose={() => setRollbackTarget(null)}
        onConfirm={() => void handleRollback()}
        title="Restore this version?"
        message={`Version #${rollbackTarget?.number ?? ""} will become the published page. A new version will be created for this rollback.`}
        confirmLabel="Rollback & publish"
        confirmLoading={rolling}
      />
    </>
  );
}
