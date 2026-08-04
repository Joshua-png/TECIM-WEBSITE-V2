import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { imageUrl } from "@/lib/image";
import { aboutContent, type AboutContent } from "./about/content";

export default function About({ content = aboutContent }: { content?: AboutContent }) {
  return (
    <section className="section about" id="about">
      <div className="section-inner">
        <div className="about-grid">
          <Reveal className="about-visual">
            <Image
              src={imageUrl(content.image)}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 600px"
              style={{ objectFit: "cover" }}
            />
            <div className="about-badge">
              {content.badgeTitle}
              <span>{content.badgeSubtitle}</span>
            </div>
          </Reveal>
          <Reveal className="about-content">
            <p className="section-label">{content.label}</p>
            <h2>{content.title}</h2>
            <p>{content.description}</p>
            <ul className="check-list">
              {content.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              {content.tailIntro}{" "}
              {content.partners.map((partner, i) => (
                <span key={partner}>
                  {i > 0 && " and "}
                  <strong>{partner}</strong>
                </span>
              ))}
              {content.tailSuffix}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
