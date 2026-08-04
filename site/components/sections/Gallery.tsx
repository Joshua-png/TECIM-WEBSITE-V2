import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { galleryContent, type GalleryContent } from "./gallery/content";

const ROW_A_SIZES = "(max-width: 480px) 150px, (max-width: 700px) 210px, 300px";
const ROW_B_SIZES = "(max-width: 480px) 115px, (max-width: 700px) 160px, 240px";

function Frame({
  src,
  index,
  sizes,
}: {
  src: string;
  index: number;
  sizes: string;
}) {
  return (
    <div className="gal-frame">
      <span className="gal-index">
        {String(index).padStart(2, "0")}
      </span>
      <Image src={src} alt="" fill sizes={sizes} style={{ objectFit: "cover" }} />
    </div>
  );
}

export default function Gallery({ content = galleryContent }: { content?: GalleryContent }) {
  const { rowA, rowB } = content;

  return (
    <section className="section gallery" id="gallery">
      <div className="gallery-grain" />
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{content.label}</p>
          <h2>{content.title}</h2>
          <p className="gal-sub">{content.sub}</p>
          <p className="gal-reel-tag">{content.reelTag}</p>
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
            />
          ))}
        </div>
      </div>

      <div className="section-inner">
        <a className="gal-more" href={content.moreHref}>
          {content.moreLabel} →
        </a>
      </div>
    </section>
  );
}
