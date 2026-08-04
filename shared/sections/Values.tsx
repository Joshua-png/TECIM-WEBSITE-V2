import Reveal from "./Reveal";
import { EditableText } from "../editor/EditableText";
import { valuesContent, type ValuesContent } from "./values/content";

export default function Values({
  content = valuesContent,
  editable = false,
}: {
  content?: ValuesContent;
  editable?: boolean;
}) {
  return (
    <section className="section" id="values">
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
        </Reveal>
        <div className="values-grid">
          {content.cards.map((card, i) => (
            <Reveal key={card.title} className="value-card">
              <div className="value-num">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3>
                <EditableText path={`cards.${i}.title`} editable={editable}>
                  {card.title}
                </EditableText>
              </h3>
              <p>
                <EditableText path={`cards.${i}.text`} editable={editable}>
                  {card.text}
                </EditableText>
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
