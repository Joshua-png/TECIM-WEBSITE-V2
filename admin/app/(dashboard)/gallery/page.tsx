"use client";

import { useMemo } from "react";
import { CollectionManager, type CollectionField } from "@/components/collections/collection-manager";
import { useDataPaginated } from "@/lib/use-data";
import type { GalleryItem, Media } from "@/lib/types";

const fields: CollectionField[] = [
  { key: "mediaId", label: "Image", type: "media", required: true },
  { key: "caption", label: "Caption", type: "text", placeholder: "Short caption" },
  { key: "altText", label: "Alt text", type: "text", hint: "accessibility" },
  { key: "displayOrder", label: "Display order", type: "number", hint: "lower = earlier" },
  { key: "isFeatured", label: "Featured", type: "boolean" },
];

export default function GalleryPage() {
  const mediaData = useDataPaginated<Media[]>("/admin/media?perPage=100");
  const mediaMap = useMemo(() => {
    const map = new Map<string, Media>();
    for (const media of mediaData.items) map.set(media.id, media);
    return map;
  }, [mediaData.items]);

  return (
    <CollectionManager
      title="Gallery"
      eyebrow="Content"
      description="Moments displayed in the cinematic gallery marquee. Published items appear on the site."
      singular="Gallery item"
      listPath="/admin/gallery"
      dataKey="gallery"
      fields={fields}
      defaultValues={{ caption: "", altText: "", displayOrder: "", isFeatured: false }}
      renderRow={(item) => {
        const galleryItem = item as unknown as GalleryItem;
        const media = mediaMap.get(galleryItem.mediaId);
        return {
          title: galleryItem.caption || "Untitled item",
          subtitle: [
            galleryItem.isFeatured ? "★ featured" : "",
            media ? `${media.width ?? ""} × ${media.height ?? ""}`.trim() : "",
            galleryItem.altText ?? "",
          ]
            .filter(Boolean)
            .join(" · "),
          thumbnail: media?.secureUrl ?? null,
        };
      }}
    />
  );
}
