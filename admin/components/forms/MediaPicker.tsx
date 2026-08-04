"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Media } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";

export function MediaPicker({
  open,
  onClose,
  onSelect,
  title = "Pick a media asset",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  title?: string;
}) {
  const [items, setItems] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiFetch<{ data: Media[]; meta: { total: number; totalPages: number; page: number } }>(
      `/admin/media?page=${page}&perPage=24`
    )
      .then((result) => {
        if (cancelled) return;
        setItems(result.data);
        setTotal(result.meta.total);
        setTotalPages(Math.max(1, result.meta.totalPages));
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load media");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, page]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={`${total} assets in the library`}
      wide
      footer={
        total > 0 ? (
          <p className="mr-auto text-xs text-faint">Select an asset to insert its URL.</p>
        ) : (
          <p className="mr-auto text-xs text-faint">The library is empty — upload media first.</p>
        )
      }
    >
      {error ? (
        <div className="rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-3 text-sm text-rose">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 className="size-5 animate-spin text-turquoise" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-muted">
          <ImagePlus className="size-8 text-faint" />
          <p className="text-sm">No media yet. Upload images from the Media library first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((media) => (
            <button
              key={media.id}
              onClick={() => {
                onSelect(media);
                onClose();
              }}
              className="group overflow-hidden rounded-xl border border-line bg-canvas-soft text-left transition-all hover:border-turquoise/50"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.secureUrl}
                  alt={media.altText ?? media.publicId}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="px-3 py-2">
                <p className="truncate text-xs text-ink">{media.altText ?? media.publicId}</p>
                <p className="text-[0.64rem] text-faint">
                  {media.width && media.height
                    ? `${media.width} × ${media.height}`
                    : media.format ?? "asset"}
                  {media.sizeBytes ? ` · ${formatKb(media.sizeBytes)}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && items.length > 0 ? (
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      ) : null}
    </Modal>
  );
}

function formatKb(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
