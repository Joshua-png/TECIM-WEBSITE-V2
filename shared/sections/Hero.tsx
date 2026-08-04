"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { imageUrl } from "../lib/image";
import { EditableText } from "../editor/EditableText";
import { EditableImage } from "../editor/EditableImage";
import {
  heroContent,
  type HeroContent,
  type HeroStep,
  type IdentitySlug,
} from "./hero/content";
import InsightDrawer from "./hero/InsightDrawer";

const ORDER: IdentitySlug[] = ["light", "trumpets", "swords"];
const ROTATE_MS = 9000;

export default function Hero({
  content = heroContent,
  editable = false,
}: {
  content?: HeroContent;
  editable?: boolean;
}) {
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

  const drawerIdentityIndex = content.identities.findIndex(
    (identity) => identity.slug === drawerIdentity
  );
  const drawerStepIndex =
    drawerIdentityIndex >= 0 && drawerStep
      ? content.identities[drawerIdentityIndex].steps.findIndex(
          (step) => step.num === drawerStep.num
        )
      : -1;
  const drawerPath =
    drawerIdentityIndex >= 0 && drawerStepIndex >= 0
      ? `identities.${drawerIdentityIndex}.steps.${drawerStepIndex}`
      : undefined;

  return (
    <section className="hero">
      {content.identities.map((identity, i) => (
        <div
          key={identity.slug}
          className={`hero-bg ${identity.bgFilter}${active === identity.slug ? " active" : ""}`}
        >
          <EditableImage path={`identities.${i}.backgroundImage`} editable={editable}>
            <Image
              src={imageUrl(identity.backgroundImage)}
              alt=""
              fill
              priority={identity.slug === "light"}
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </EditableImage>
        </div>
      ))}
      <div className="hero-overlay" />
      <div className="hero-grade" />
      <div className="hero-vignette" />
      <div className="hero-grain" />

      <div className="hero-inner">
        <p className="hero-label">
          <EditableText path="label" editable={editable}>
            {content.label}
          </EditableText>
        </p>
        <h1 className="display">
          <EditableText path="title" editable={editable}>
            {content.title}
          </EditableText>
          <br />
          <EditableText path="titleBreak" editable={editable}>
            {content.titleBreak}
          </EditableText>
        </h1>
        <p className="hero-sub">
          <EditableText path="subtitle" editable={editable}>
            {content.subtitle}
          </EditableText>
        </p>

        <div className="id-pills">
          {content.identities.map((identity, i) => (
            <button
              key={identity.slug}
              className={`id-pill${active === identity.slug ? " active" : ""}`}
              data-id={identity.slug}
              onClick={() => selectIdentity(identity.slug)}
            >
              <EditableText path={`identities.${i}.label`} editable={editable}>
                {identity.label}
              </EditableText>
            </button>
          ))}
        </div>

        <div className="filmstrip-wrap">
          {content.identities.map((identity, i) => (
            <div key={identity.slug}>
              <div
                className={`filmstrip${active === identity.slug ? " active" : ""}`}
                data-strip={identity.slug}
              >
                {identity.steps.map((step, j) => (
                  <button
                    key={step.num}
                    className="film-card"
                    onClick={() => openInsight(identity.slug, step)}
                  >
                    <EditableImage
                      path={`identities.${i}.steps.${j}.image`}
                      editable={editable}
                    >
                      <Image src={imageUrl(step.image)} alt={step.title} fill sizes="150px" />
                    </EditableImage>
                    <span className="film-card-cap">
                      <span className="num">
                        <EditableText path={`identities.${i}.steps.${j}.num`} editable={editable}>
                          {step.num}
                        </EditableText>
                      </span>
                      <h4>
                        <EditableText path={`identities.${i}.steps.${j}.title`} editable={editable}>
                          {step.title}
                        </EditableText>
                      </h4>
                      <span className="insight">
                        <EditableText path={`identities.${i}.steps.${j}.body`} editable={editable}>
                          {step.body}
                        </EditableText>
                        <em>
                          <EditableText path={`identities.${i}.steps.${j}.verse`} editable={editable}>
                            {step.verse}
                          </EditableText>
                        </em>
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
                  {"Finished — "}
                  <strong>
                    <EditableText path={`identities.${i}.label`} editable={editable}>
                      {identity.label}
                    </EditableText>
                  </strong>
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
        pathPrefix={drawerPath}
        editable={editable}
        onClose={closeDrawer}
      />
    </section>
  );
}
