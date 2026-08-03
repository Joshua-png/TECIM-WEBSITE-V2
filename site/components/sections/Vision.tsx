"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { visionContent } from "./vision/content";

const SLIDE_MS = 5000;

export default function Vision() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % visionContent.slides.length);
    }, SLIDE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section vision-band" id="vision">
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{visionContent.label}</p>
          <h2>{visionContent.title}</h2>
        </Reveal>
        <Reveal className="vm-carousel">
          <div className="vm-viewport">
            <div
              className="vm-track"
              style={{ transform: `translateX(-${index * 50}%)` }}
            >
              {visionContent.slides.map((slide, i) => (
                <div key={slide.heading} className={`vm-slide ${i === 0 ? "v" : "m"}`}>
                  <h3>{slide.heading}</h3>
                  {slide.items ? (
                    <ul>
                      {slide.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{slide.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="vm-dots">
            {visionContent.slides.map((slide, i) => (
              <button
                key={slide.heading}
                className={`vm-dot${i === index ? " active" : ""}`}
                aria-label={`Show ${slide.heading}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
