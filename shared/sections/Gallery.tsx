import Reveal from "./Reveal";
import SectionImage from "./SectionImage";
import { EditableText } from "../editor/EditableText";
import { EditableImage } from "../editor/EditableImage";
import { galleryContent, type GalleryContent, type GalleryImage } from "./gallery/content";

const ROW_A_SIZES = "(max-width: 480px) 150px, (max-width: 700px) 210px, 300px";
const ROW_B_SIZES = "(max-width: 480px) 115px, (max-width: 700px) 160px, 240px";
const MIN_ROW_FRAMES = 8;
const ROW_A_UNIT = 316;
const ROW_B_UNIT = 256;
const SCROLL_SPEED = 20;

function repeatRow(base: string[], minFrames: number): string[] {
  if (base.length === 0) return [];
  const copies = Math.max(2, Math.ceil(minFrames / base.length) * 2);
  return Array.from({ length: copies }, () => base).flat();
}

function scrollDuration(frames: number, unit: number): number {
  return (frames * unit) / (2 * SCROLL_SPEED);
}

function Frame({
  src,
  alt,
  sizes,
  path,
  editable,
}: {
  src: string;
  alt: string;
  sizes: string;
  path: string;
  editable: boolean;
}) {
  return (
    <div className="gal-frame">
      {editable ? (
        <EditableImage path={path} editable={editable}>
          <SectionImage src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
        </EditableImage>
      ) : (
        <SectionImage src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
      )}
    </div>
  );
}

function collectionRows(
  items: GalleryImage[] | null | undefined,
  content: GalleryContent
): { rowA: string[]; rowB: string[] } {
  const fallbackA = content.rowA?.length > 0 ? content.rowA : galleryContent.rowA;
  const fallbackB = content.rowB?.length > 0 ? content.rowB : galleryContent.rowB;
  if (!items || items.length === 0) {
    return { rowA: fallbackA, rowB: fallbackB };
  }
  const rowA = items.filter((_, i) => i % 2 === 0).map((item) => item.src);
  const rowB = items.filter((_, i) => i % 2 === 1).map((item) => item.src);
  if (rowA.length === 0) return { rowA: rowB, rowB };
  if (rowB.length === 0) return { rowA, rowB: rowA };
  return { rowA, rowB };
}

export default function Gallery({
  content = galleryContent,
  editable = false,
  items,
}: {
  content?: GalleryContent;
  editable?: boolean;
  items?: GalleryImage[] | null;
}) {
  const usingCollection = Array.isArray(items);
  const hasCollectionItems = usingCollection && items.length > 0;
  const showSpotlight = hasCollectionItems && items.length <= 3;
  const { rowA, rowB } = collectionRows(items, content);
  const editableFrames = editable && !hasCollectionItems;

  const framesA = showSpotlight
    ? []
    : hasCollectionItems
      ? repeatRow(rowA, MIN_ROW_FRAMES)
      : [...rowA, ...rowA];
  const framesB = showSpotlight
    ? []
    : hasCollectionItems
      ? repeatRow(rowB, MIN_ROW_FRAMES)
      : [...rowB, ...rowB];
  const durA = scrollDuration(framesA.length, ROW_A_UNIT);
  const durB = scrollDuration(framesB.length, ROW_B_UNIT);

  const lead = items?.[0];

  return (
    <section className="section gallery" id="gallery">
      <div className="gallery-grain" />
      <div className="section-inner">
        <Reveal>
          <p className="section-label">
            <EditableText path="label" editable={editable}>
              {content.label}
            </EditableText>
          </p>
          <h2>
            <EditableText path="title" editable={editable}>
              {content.title}
            </EditableText>
          </h2>
          <p className="gal-sub">
            <EditableText path="sub" editable={editable}>
              {content.sub}
            </EditableText>
          </p>
          <p className="gal-reel-tag">
            <EditableText path="reelTag" editable={editable}>
              {content.reelTag}
            </EditableText>
          </p>
        </Reveal>
      </div>

      {usingCollection && !hasCollectionItems ? (
        <div className="gal-empty">
          <div className="gal-empty-frame">
            <div className="gal-empty-perf" aria-hidden="true" />
            <div className="gal-empty-reel" aria-hidden="true" />
            <p className="gal-empty-title">New moments coming soon</p>
            <p className="gal-empty-sub">
              We&apos;re curating fresh memories — check back soon.
            </p>
          </div>
        </div>
      ) : showSpotlight && lead ? (
        <div className="gal-spotlight">
          <div className="gal-spot">
            <div className="gal-spot-frame">
              <SectionImage
                src={lead.src}
                alt={lead.alt ?? ""}
                fill
                sizes="(max-width: 700px) 100vw, 1400px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          {items.length > 1 ? (
            <div className="gal-strip">
              {items.slice(1).map((img, i) => (
                <div key={`${img.src}-${i}`} className="gal-strip-frame">
                  <SectionImage
                    src={img.src}
                    alt={img.alt ?? ""}
                    fill
                    sizes="(max-width: 700px) 45vw, 320px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="gal-marquee">
          <div className="gal-edge left" />
          <div className="gal-edge right" />

          <div className="gal-row row-a" style={{ animationDuration: `${durA}s` }}>
            {framesA.map((src, i) => (
              <Frame
                key={`${src}-${i}`}
                src={src}
                alt={items?.[i % items.length]?.alt ?? ""}
                sizes={ROW_A_SIZES}
                path={`rowA.${i % rowA.length}`}
                editable={editableFrames}
              />
            ))}
          </div>
          <div className="gal-row row-b" style={{ animationDuration: `${durB}s` }}>
            {framesB.map((src, i) => (
              <Frame
                key={`${src}-${i}`}
                src={src}
                alt={items?.[i % items.length]?.alt ?? ""}
                sizes={ROW_B_SIZES}
                path={`rowB.${i % rowB.length}`}
                editable={editableFrames}
              />
            ))}
          </div>
        </div>
      )}

      <div className="section-inner">
        <a className="gal-more" href={content.moreHref}>
          <EditableText path="moreLabel" editable={editable}>
            {content.moreLabel}
          </EditableText>{" →"}
        </a>
      </div>
    </section>
  );
}
