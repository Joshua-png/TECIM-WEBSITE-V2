"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { EditableText } from "../editor/EditableText";
import { contactContent, type ContactContent } from "./contact/content";

export default function Contact({
  content = contactContent,
  editable = false,
}: {
  content?: ContactContent;
  editable?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = content.locations[activeIndex];

  return (
    <section className="section contact" id="contact">
      <div className="contact-grain" />
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
          <p className="contact-sub">
            <EditableText path="sub" editable={editable}>
              {content.sub}
            </EditableText>
          </p>
        </Reveal>

        <div className="stay-grid">
          <Reveal className="map-card">
            <div className="map-frame-wrap">
              <iframe
                title="TECIM location map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  active.query
                )}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-vignette" />
              <div className="map-corner tl" />
              <div className="map-corner tr" />
              <div className="map-corner bl" />
              <div className="map-corner br" />
              <div className="map-pin">
                <div className="map-pin-dot" />
                <div className="map-pin-stem" />
              </div>
              <span className="map-tag">
                <EditableText path={`locations.${activeIndex}.name`} editable={editable}>
                  {active.name}
                </EditableText>
              </span>
            </div>
            <div className="map-tabs">
              {content.locations.map((location, i) => (
                <button
                  key={location.name}
                  className={`map-tab${i === activeIndex ? " active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                >
                  <EditableText path={`locations.${i}.name`} editable={editable}>
                    {location.name}
                  </EditableText>
                </button>
              ))}
            </div>
          </Reveal>

          <div className="info-stack">
            <Reveal className="c-block">
              <h4>Address</h4>
              <ul>
                {content.addressLines.map((line, i) => (
                  <li key={line}>
                    <EditableText path={`addressLines.${i}`} editable={editable}>
                      {line}
                    </EditableText>
                  </li>
                ))}
                <li className="address-note">
                  <EditableText path="addressNote" editable={editable}>
                    {content.addressNote}
                  </EditableText>
                </li>
              </ul>
              <a
                className="directions-btn"
                href={content.directionsHref}
                target="_blank"
                rel="noopener"
              >
                <EditableText path="directionsLabel" editable={editable}>
                  {content.directionsLabel}
                </EditableText>{" →"}
              </a>
            </Reveal>
            <Reveal className="c-block">
              <h4>Hours</h4>
              <ul className="hours">
                {content.hours.map((hour, i) => (
                  <li key={hour.day}>
                    <span>
                      <EditableText path={`hours.${i}.day`} editable={editable}>
                        {hour.day}
                      </EditableText>
                    </span>
                    <span>
                      <EditableText path={`hours.${i}.time`} editable={editable}>
                        {hour.time}
                      </EditableText>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="c-block">
              <h4>Contact</h4>
              <ul>
                <li>
                  <a href={`mailto:${content.email}`}>
                    <EditableText path="email" editable={editable}>
                      {content.email}
                    </EditableText>
                  </a>
                </li>
                {content.phones.map((phone, i) => (
                  <li key={phone}>
                    <a href={`tel:${phone.replace(/\s/g, "")}`}>
                      <EditableText path={`phones.${i}`} editable={editable}>
                        {phone}
                      </EditableText>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
