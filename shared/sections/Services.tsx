import Reveal from "./Reveal";
import { EditableText } from "../editor/EditableText";
import { servicesContent, type ServicesContent } from "./services/content";

export default function Services({
  content = servicesContent,
  editable = false,
}: {
  content?: ServicesContent;
  editable?: boolean;
}) {
  return (
    <section className="section" id="services">
      <div className="section-inner">
        <div className="wh-head">
          <div>
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
              <p className="wh-sub">
                <EditableText path="sub" editable={editable}>
                  {content.sub}
                </EditableText>
              </p>
            </Reveal>
          </div>
          <Reveal>
            <a className="wh-cta" href={content.ctaHref}>
              <EditableText path="ctaLabel" editable={editable}>
                {content.ctaLabel}
              </EditableText>{" →"}
            </a>
          </Reveal>
        </div>
        <div className="wh-list">
          {content.rows.map((row, i) => (
            <Reveal key={row.day}>
              <a className="wh-row" href={content.ctaHref}>
                <div className="wh-date">
                  <span className="wh-day">
                    <EditableText path={`rows.${i}.day`} editable={editable}>
                      {row.day}
                    </EditableText>
                  </span>
                  <span className="wh-time">
                    <EditableText path={`rows.${i}.time`} editable={editable}>
                      {row.time}
                    </EditableText>
                  </span>
                </div>
                <span className="wh-tag">
                  <EditableText path={`rows.${i}.tag`} editable={editable}>
                    {row.tag}
                  </EditableText>
                </span>
                <div className="wh-copy">
                  <h3>
                    <EditableText path={`rows.${i}.title`} editable={editable}>
                      {row.title}
                    </EditableText>
                  </h3>
                  <p>
                    <EditableText path={`rows.${i}.description`} editable={editable}>
                      {row.description}
                    </EditableText>
                  </p>
                </div>
                <span className="wh-arrow">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
