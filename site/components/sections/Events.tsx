import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { imageUrl } from "@/lib/image";
import { eventsContent, type EventsContent } from "./events/content";

export default function Events({ content = eventsContent }: { content?: EventsContent }) {
  return (
    <section className="section events" id="events">
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{content.label}</p>
          <h2>{content.title}</h2>
        </Reveal>
        <div className="evt-grid">
          {content.events.map((event) => (
            <Reveal key={event.title} className="evt-card">
              <div className="evt-img">
                <Image
                  src={imageUrl(event.image)}
                  alt={event.imageAlt}
                  fill
                  sizes="(max-width: 550px) 100vw, 180px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="evt-body">
                <p className="evt-date">{event.date}</p>
                <h3>{event.title}</h3>
                <p className="evt-loc">{event.location}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
