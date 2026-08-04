import Reveal from "@/components/ui/Reveal";
import { servicesContent, type ServicesContent } from "./services/content";

export default function Services({ content = servicesContent }: { content?: ServicesContent }) {
  return (
    <section className="section" id="services">
      <div className="section-inner">
        <div className="wh-head">
          <div>
            <Reveal>
              <p className="section-label">{content.label}</p>
              <h2>{content.title}</h2>
              <p className="wh-sub">{content.sub}</p>
            </Reveal>
          </div>
          <Reveal>
            <a className="wh-cta" href={content.ctaHref}>
              {content.ctaLabel} →
            </a>
          </Reveal>
        </div>
        <div className="wh-list">
          {content.rows.map((row) => (
            <Reveal key={row.day}>
              <a className="wh-row" href={content.ctaHref}>
                <div className="wh-date">
                  <span className="wh-day">{row.day}</span>
                  <span className="wh-time">{row.time}</span>
                </div>
                <span className="wh-tag">{row.tag}</span>
                <div className="wh-copy">
                  <h3>{row.title}</h3>
                  <p>{row.description}</p>
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
