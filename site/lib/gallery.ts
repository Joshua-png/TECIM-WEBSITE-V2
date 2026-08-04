import type { GalleryImage } from "@tecim/shared";
import type { PublicGalleryItem } from "@/lib/api";

export function publishedGalleryToImages(items: PublicGalleryItem[]): GalleryImage[] {
  return items
    .filter((item) => item.image && item.image.secure_url)
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return a.displayOrder - b.displayOrder;
    })
    .map((item) => ({
      src: item.image!.secure_url,
      alt: item.altText ?? item.caption ?? "",
      width: item.image!.width,
      height: item.image!.height,
    }));
}
