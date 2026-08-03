import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { aboutContent } from "./about/content";

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="section-inner">
        <div className="about-grid">
          <Reveal className="about-visual">
            <Image
              src={aboutContent.image}
              alt={aboutContent.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 600px"
              style={{ objectFit: "cover" }}
            />
            <div className="about-badge">
              {aboutContent.badgeTitle}
              <span>{aboutContent.badgeSubtitle}</span>
            </div>
          </Reveal>
          <Reveal className="about-content">
            <p className="section-label">{aboutContent.label}</p>
            <h2>{aboutContent.title}</h2>
            <p>{aboutContent.description}</p>
            <ul className="check-list">
              {aboutContent.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              {aboutContent.tailIntro}{" "}
              {aboutContent.partners.map((partner, i) => (
                <span key={partner}>
                  {i > 0 && " and "}
                  <strong>{partner}</strong>
                </span>
              ))}
              {aboutContent.tailSuffix}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
