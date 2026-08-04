"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { contactContent, type ContactContent } from "./contact/content";

export default function Contact({ content = contactContent }: { content?: ContactContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = content.locations[activeIndex];

  return (
    <section className="section contact" id="contact">
      <div className="contact-grain" />
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{content.label}</p>
          <h2>{content.title}</h2>
          <p className="contact-sub">{content.sub}</p>
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
              <span className="map-tag">{active.name}</span>
            </div>
            <div className="map-tabs">
              {content.locations.map((location, i) => (
                <button
                  key={location.name}
                  className={`map-tab${i === activeIndex ? " active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="info-stack">
            <Reveal className="c-block">
              <h4>Address</h4>
              <ul>
                {content.addressLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
                <li className="address-note">{content.addressNote}</li>
              </ul>
              <a
                className="directions-btn"
                href={content.directionsHref}
                target="_blank"
                rel="noopener"
              >
                {content.directionsLabel} →
              </a>
            </Reveal>
            <Reveal className="c-block">
              <h4>Hours</h4>
              <ul className="hours">
                {content.hours.map((hour) => (
                  <li key={hour.day}>
                    <span>{hour.day}</span>
                    <span>{hour.time}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="c-block">
              <h4>Contact</h4>
              <ul>
                <li>
                  <a href={`mailto:${content.email}`}>
                    {content.email}
                  </a>
                </li>
                {content.phones.map((phone) => (
                  <li key={phone}>
                    <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
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
