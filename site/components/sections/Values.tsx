import Reveal from "@/components/ui/Reveal";
import { valuesContent } from "./values/content";

export default function Values() {
  return (
    <section className="section" id="values">
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{valuesContent.label}</p>
          <h2>{valuesContent.title}</h2>
        </Reveal>
        <div className="values-grid">
          {valuesContent.cards.map((card, i) => (
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
