import Reveal from "@/components/ui/Reveal";
import { servicesContent } from "./services/content";

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="section-inner">
        <div className="wh-head">
          <div>
            <Reveal>
              <p className="section-label">{servicesContent.label}</p>
              <h2>{servicesContent.title}</h2>
              <p className="wh-sub">{servicesContent.sub}</p>
            </Reveal>
          </div>
          <Reveal>
            <a className="wh-cta" href={servicesContent.ctaHref}>
              {servicesContent.ctaLabel} →
            </a>
          </Reveal>
        </div>
        <div className="wh-list">
          {servicesContent.rows.map((row) => (
            <Reveal key={row.day}>
              <a className="wh-row" href={servicesContent.ctaHref}>
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
