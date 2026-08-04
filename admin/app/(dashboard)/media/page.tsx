"use client";

import { ImagePlus, Images, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Media } from "@/lib/types";
import { useData } from "@/lib/use-data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm";
import { EmptyState } from "@/components/ui/empty";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { formatBytes } from "@/lib/format";

const PER_PAGE = 24;

export default function MediaPage() {
  const [page, setPage] = useState(1);
  const { data, loading, reload } = useData<{
    data: Media[];
    meta: { total: number; totalPages: number };
  }>(`/admin/media?page=${page}&perPage=${PER_PAGE}`, [page]);

  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    let failed = 0;
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      try {
        await apiFetch<{ media: Media }>("/admin/media/upload", {
          method: "POST",
          formData: form,
        });
        ok += 1;
      } catch (err) {
        failed += 1;
        if (err instanceof Error) {
          toast.push("error", `Upload failed: ${file.name}`, err.message);
        }
      }
    }
    if (ok > 0) toast.push("success", `Uploaded ${ok} asset${ok > 1 ? "s" : ""}`);
    if (failed > 0 && ok > 0) toast.push("info", `${failed} upload${failed > 1 ? "s" : ""} failed`);
    setUploading(false);
    reload();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/admin/media/${deleteTarget.id}`, { method: "DELETE" });
      toast.push("success", "Asset deleted");
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast.push("error", "Delete failed", err instanceof Error ? err.message : undefined);
      setDeleteTarget(null);
    }
  };

  if (loading) return <PageLoader />;

  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, data?.meta.totalPages ?? 1);

  return (
    <div>
      <PageHeader
        eyebrow="Media library"
        title="Assets"
        description="Images and videos stored on Cloudinary. Used across sections, events, gallery and sermons."
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime"
              multiple
              className="hidden"
              onChange={(e) => void upload(e.target.files)}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
            >
              <UploadCloud className="size-4" />
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </>
        }
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void upload(e.dataTransfer.files);
        }}
        className={`mb-5 flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed px-6 py-7 text-center transition-colors ${
          dragOver
            ? "border-turquoise/60 bg-turquoise/8"
            : "border-line-strong bg-panel/40 hover:border-turquoise/40"
        }`}
      >
        <ImagePlus className="size-6 text-faint" />
        <p className="text-sm text-muted">
          Drag &amp; drop files here, or{" "}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="font-medium text-turquoise hover:underline"
          >
            browse
          </button>
        </p>
        <p className="text-[0.68rem] text-faint">
          JPEG · PNG · WebP · GIF · SVG · MP4 · WebM · MOV — up to 10 MB
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Images}
          title="The library is empty"
          description="Upload your first image or video above to start composing sections."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((media) => (
              <div
                key={media.id}
                className="group overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-line-strong"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                  {media.resourceType === "video" ? (
                    <video
                      src={media.secureUrl}
                      className="h-full w-full object-cover"
                      preload="metadata"
                      muted
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={media.secureUrl}
                      alt={media.altText ?? media.publicId}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute right-2 top-2 rounded-full border border-line bg-black/55 px-2 py-0.5 text-[0.58rem] uppercase tracking-wider text-ink backdrop-blur">
                    {media.resourceType}
                  </span>
                  <button
                    onClick={() => setDeleteTarget(media)}
                    className="absolute left-2 top-2 rounded-lg bg-black/55 p-1.5 text-rose opacity-0 backdrop-blur transition-opacity hover:bg-rose/20 group-hover:opacity-100"
                    aria-label="Delete asset"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <div className="px-3.5 py-3">
                  <p className="truncate text-xs font-medium text-ink">
                    {media.altText || media.publicId}
                  </p>
                  <p className="mt-1 text-[0.66rem] text-faint">
                    {media.width && media.height
                      ? `${media.width} × ${media.height}`
                      : media.format ?? ""}
                    {media.sizeBytes ? ` · ${formatBytes(media.sizeBytes)}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          <p className="text-center text-[0.68rem] text-faint">{total} assets total</p>
        </>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title="Delete this asset?"
        message={
          <>
            {deleteTarget?.altText || deleteTarget?.publicId} will be removed from Cloudinary and the
            library. Sections referencing it may show a broken image.
          </>
        }
        danger
        confirmLabel="Delete asset"
      />
    </div>
  );
}
