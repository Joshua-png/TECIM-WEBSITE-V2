import Reveal from "./Reveal";
import SectionImage from "./SectionImage";
import { imageUrl } from "../lib/image";
import { EditableText } from "../editor/EditableText";
import { EditableImage } from "../editor/EditableImage";
import { eventsContent, type EventsContent, type EventCard } from "./events/content";

export default function Events({
  content = eventsContent,
  editable = false,
  events,
}: {
  content?: EventsContent;
  editable?: boolean;
  events?: EventCard[];
}) {
  const cards = events ?? content.events;

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
          {cards.length === 0 ? (
            <div className="evt-empty">
              <p className="evt-empty-title">No upcoming events</p>
              <p className="evt-empty-sub">Check back soon for new gatherings.</p>
            </div>
          ) : (
            cards.map((event, i) => (
              <Reveal key={`${event.title}-${i}`} className="evt-card">
                <div className="evt-img">
                  {events ? (
                    <SectionImage
                      src={imageUrl(event.image)}
                      alt={event.imageAlt}
                      fill
                      sizes="(max-width: 550px) 100vw, 180px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <EditableImage path={`events.${i}.image`} editable={editable}>
                      <SectionImage
                        src={imageUrl(event.image)}
                        alt={event.imageAlt}
                        fill
                        sizes="(max-width: 550px) 100vw, 180px"
                        style={{ objectFit: "cover" }}
                      />
                    </EditableImage>
                  )}
                </div>
                <div className="evt-body">
                  <p className="evt-date">
                    {events ? (
                      event.date
                    ) : (
                      <EditableText path={`events.${i}.date`} editable={editable}>
                        {event.date}
                      </EditableText>
                    )}
                  </p>
                  <h3>
                    {events ? (
                      event.title
                    ) : (
                      <EditableText path={`events.${i}.title`} editable={editable}>
                        {event.title}
                      </EditableText>
                    )}
                  </h3>
                  <p className="evt-loc">
                    {events ? (
                      event.location
                    ) : (
                      <EditableText path={`events.${i}.location`} editable={editable}>
                        {event.location}
                      </EditableText>
                    )}
                  </p>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
