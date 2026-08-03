"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  heroContent,
  type HeroStep,
  type IdentitySlug,
} from "./hero/content";
import InsightDrawer from "./hero/InsightDrawer";

const ORDER: IdentitySlug[] = ["light", "trumpets", "swords"];
const ROTATE_MS = 9000;

export default function Hero() {
  const [active, setActive] = useState<IdentitySlug>("light");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState<HeroStep | null>(null);
  const [drawerIdentity, setDrawerIdentity] = useState<IdentitySlug>("light");
  const userInteracted = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;
    const interval = setInterval(() => {
      if (userInteracted.current) return;
      const i = ORDER.indexOf(active);
      setActive(ORDER[(i + 1) % ORDER.length]);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const selectIdentity = (slug: IdentitySlug) => {
    userInteracted.current = true;
    closeDrawer();
    setActive(slug);
  };

  const openInsight = (slug: IdentitySlug, step: HeroStep) => {
    userInteracted.current = true;
    setDrawerIdentity(slug);
    setDrawerStep(step);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerStep(null);
  };

  return (
    <section className="hero">
      {heroContent.identities.map((identity) => (
        <div
          key={identity.slug}
          className={`hero-bg ${identity.bgFilter}${active === identity.slug ? " active" : ""}`}
        >
          <Image
            src={identity.backgroundImage}
            alt=""
            fill
            priority={identity.slug === "light"}
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
      <div className="hero-overlay" />
      <div className="hero-grade" />
      <div className="hero-vignette" />
      <div className="hero-grain" />

      <div className="hero-inner">
        <p className="hero-label">{heroContent.label}</p>
        <h1 className="display">
          {heroContent.title}
          <br />
          {heroContent.titleBreak}
        </h1>
        <p className="hero-sub">{heroContent.subtitle}</p>

        <div className="id-pills">
          {heroContent.identities.map((identity) => (
            <button
              key={identity.slug}
              className={`id-pill${active === identity.slug ? " active" : ""}`}
              data-id={identity.slug}
              onClick={() => selectIdentity(identity.slug)}
            >
              {identity.label}
            </button>
          ))}
        </div>

        <div className="filmstrip-wrap">
          {heroContent.identities.map((identity) => (
            <div key={identity.slug}>
              <div
                className={`filmstrip${active === identity.slug ? " active" : ""}`}
                data-strip={identity.slug}
              >
                {identity.steps.map((step) => (
                  <button
                    key={step.num}
                    className="film-card"
                    onClick={() => openInsight(identity.slug, step)}
                  >
                    <Image src={step.image} alt={step.title} fill sizes="150px" />
                    <span className="film-card-cap">
                      <span className="num">{step.num}</span>
                      <h4>{step.title}</h4>
                      <span className="insight">
                        {step.body}
                        <em>{step.verse}</em>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div
                className={`finish-line${active === identity.slug ? " active" : ""}`}
                data-for={identity.slug}
              >
                <span>
                  Finished — <strong>{identity.label}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InsightDrawer
        open={drawerOpen}
        step={drawerStep}
        identity={drawerIdentity}
        onClose={closeDrawer}
      />
    </section>
  );
}
