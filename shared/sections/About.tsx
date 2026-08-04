import Image from "next/image";
import Reveal from "./Reveal";
import { imageUrl } from "../lib/image";
import { EditableText } from "../editor/EditableText";
import { EditableImage } from "../editor/EditableImage";
import { aboutContent, type AboutContent } from "./about/content";

export default function About({
  content = aboutContent,
  editable = false,
}: {
  content?: AboutContent;
  editable?: boolean;
}) {
  return (
    <section className="section about" id="about">
      <div className="section-inner">
        <div className="about-grid">
          <Reveal className="about-visual">
            <EditableImage path="image" editable={editable}>
              <Image
                src={imageUrl(content.image)}
                alt={content.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 600px"
                style={{ objectFit: "cover" }}
              />
            </EditableImage>
            <div className="about-badge">
              <EditableText path="badgeTitle" editable={editable}>
                {content.badgeTitle}
              </EditableText>
              <span>
                <EditableText path="badgeSubtitle" editable={editable}>
                  {content.badgeSubtitle}
                </EditableText>
              </span>
            </div>
          </Reveal>
          <Reveal className="about-content">
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
            <p>
              <EditableText path="description" editable={editable}>
                {content.description}
              </EditableText>
            </p>
            <ul className="check-list">
              {content.checklist.map((item, i) => (
                <li key={item}>
                  <EditableText path={`checklist.${i}`} editable={editable}>
                    {item}
                  </EditableText>
                </li>
              ))}
            </ul>
            <p>
              <EditableText path="tailIntro" editable={editable}>
                {content.tailIntro}
              </EditableText>{" "}
              {content.partners.map((partner, i) => (
                <span key={partner}>
                  {i > 0 && " and "}
                  <strong>
                    <EditableText path={`partners.${i}`} editable={editable}>
                      {partner}
                    </EditableText>
                  </strong>
                </span>
              ))}
              <EditableText path="tailSuffix" editable={editable}>
                {content.tailSuffix}
              </EditableText>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
