import Reveal from "./Reveal";
import SectionImage from "./SectionImage";
import { imageUrl } from "../lib/image";
import { EditableText } from "../editor/EditableText";
import { EditableImage } from "../editor/EditableImage";
import { eventsContent, type EventsContent } from "./events/content";

export default function Events({
  content = eventsContent,
  editable = false,
}: {
  content?: EventsContent;
  editable?: boolean;
}) {
  return (
    <section className="section events" id="events">
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
        <div className="evt-grid">
          {content.events.map((event, i) => (
            <Reveal key={event.title} className="evt-card">
              <div className="evt-img">
                <EditableImage path={`events.${i}.image`} editable={editable}>
                  <SectionImage
                    src={imageUrl(event.image)}
                    alt={event.imageAlt}
                    fill
                    sizes="(max-width: 550px) 100vw, 180px"
                    style={{ objectFit: "cover" }}
                  />
                </EditableImage>
              </div>
              <div className="evt-body">
                <p className="evt-date">
                  <EditableText path={`events.${i}.date`} editable={editable}>
                    {event.date}
                  </EditableText>
                </p>
                <h3>
                  <EditableText path={`events.${i}.title`} editable={editable}>
                    {event.title}
                  </EditableText>
                </h3>
                <p className="evt-loc">
                  <EditableText path={`events.${i}.location`} editable={editable}>
                    {event.location}
                  </EditableText>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
