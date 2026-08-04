"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { visionContent, type VisionContent } from "./vision/content";

const SLIDE_MS = 5000;

export default function Vision({ content = visionContent }: { content?: VisionContent }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % content.slides.length);
    }, SLIDE_MS);
    return () => clearInterval(interval);
  }, [content]);

  return (
    <section className="section vision-band" id="vision">
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{content.label}</p>
          <h2>{content.title}</h2>
        </Reveal>
        <Reveal className="vm-carousel">
          <div className="vm-viewport">
            <div
              className="vm-track"
              style={{ transform: `translateX(-${index * 50}%)` }}
            >
              {content.slides.map((slide, i) => (
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
            {content.slides.map((slide, i) => (
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
