import Reveal from "@/components/ui/Reveal";
import { valuesContent, type ValuesContent } from "./values/content";

export default function Values({ content = valuesContent }: { content?: ValuesContent }) {
  return (
    <section className="section" id="values">
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{content.label}</p>
          <h2>{content.title}</h2>
        </Reveal>
        <div className="values-grid">
          {content.cards.map((card, i) => (
            <Reveal key={card.title} className="value-card">
              <div className="value-num">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
