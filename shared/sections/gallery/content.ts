export type GalleryRow = {
  indexOffset: number;
  images: string[];
};

export type GalleryContent = {
  label: string;
  title: string;
  sub: string;
  reelTag: string;
  moreLabel: string;
  moreHref: string;
  rowA: string[];
  rowB: string[];
};

export const galleryContent: GalleryContent = {
  label: "Gallery",
  title: "Moments from the journey",
  sub: "Glimpses from the altar, the classroom and the field — where light is kindled, trumpets are sounded, and swords are sharpened.",
  reelTag: "TECIM Archive — Reel 01",
  moreLabel: "View more",
  moreHref: "#",
  rowA: [
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=700&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700&q=80",
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=700&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80",
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=700&q=80",
  ],
  rowB: [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80",
    "https://images.unsplash.com/photo-1523803326055-13445f07c5b5?w=600&q=80",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80",
    "https://images.unsplash.com/photo-1508616873209-8f2695fc19e3?w=600&q=80",
    "https://images.unsplash.com/photo-1571659669963-49c5c9d69dd9?w=600&q=80",
  ],
};
