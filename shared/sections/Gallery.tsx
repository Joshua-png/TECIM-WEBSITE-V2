import Reveal from "./Reveal";
import SectionImage from "./SectionImage";
import { EditableText } from "../editor/EditableText";
import { EditableImage } from "../editor/EditableImage";
import { galleryContent, type GalleryContent } from "./gallery/content";

const ROW_A_SIZES = "(max-width: 480px) 150px, (max-width: 700px) 210px, 300px";
const ROW_B_SIZES = "(max-width: 480px) 115px, (max-width: 700px) 160px, 240px";

function Frame({
  src,
  index,
  sizes,
  path,
  editable,
}: {
  src: string;
  index: number;
  sizes: string;
  path: string;
  editable: boolean;
}) {
  return (
    <div className="gal-frame">
      <span className="gal-index">
        {String(index).padStart(2, "0")}
      </span>
      <EditableImage path={path} editable={editable}>
        <SectionImage src={src} alt="" fill sizes={sizes} style={{ objectFit: "cover" }} />
      </EditableImage>
    </div>
  );
}

export default function Gallery({
  content = galleryContent,
  editable = false,
}: {
  content?: GalleryContent;
  editable?: boolean;
}) {
  const { rowA, rowB } = content;

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

      <div className="gal-marquee">
        <div className="gal-edge left" />
        <div className="gal-edge right" />

        <div className="gal-row row-a">
          {[...rowA, ...rowA].map((src, i) => (
            <Frame
              key={`${src}-${i}`}
              src={src}
              index={(i % rowA.length) + 1}
              sizes={ROW_A_SIZES}
              path={`rowA.${i % rowA.length}`}
              editable={editable}
            />
          ))}
        </div>
        <div className="gal-row row-b">
          {[...rowB, ...rowB].map((src, i) => (
            <Frame
              key={`${src}-${i}`}
              src={src}
              index={(i % rowB.length) + rowA.length + 1}
              sizes={ROW_B_SIZES}
              path={`rowB.${i % rowB.length}`}
              editable={editable}
            />
          ))}
        </div>
      </div>

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
