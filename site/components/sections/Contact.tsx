"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { contactContent } from "./contact/content";

export default function Contact() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = contactContent.locations[activeIndex];

  return (
    <section className="section contact" id="contact">
      <div className="contact-grain" />
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{contactContent.label}</p>
          <h2>{contactContent.title}</h2>
          <p className="contact-sub">{contactContent.sub}</p>
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
              {contactContent.locations.map((location, i) => (
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
                {contactContent.addressLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
                <li className="address-note">{contactContent.addressNote}</li>
              </ul>
              <a
                className="directions-btn"
                href={contactContent.directionsHref}
                target="_blank"
                rel="noopener"
              >
                {contactContent.directionsLabel} →
              </a>
            </Reveal>
            <Reveal className="c-block">
              <h4>Hours</h4>
              <ul className="hours">
                {contactContent.hours.map((hour) => (
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
                  <a href={`mailto:${contactContent.email}`}>
                    {contactContent.email}
                  </a>
                </li>
                {contactContent.phones.map((phone) => (
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
