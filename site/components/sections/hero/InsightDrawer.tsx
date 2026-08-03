import { useEffect } from "react";
import type { HeroStep, IdentitySlug } from "./content";

export default function InsightDrawer({
  open,
  step,
  identity,
  onClose,
}: {
  open: boolean;
  step: HeroStep | null;
  identity: IdentitySlug;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`card-drawer-backdrop${open ? " open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`card-drawer${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="siTitle"
        aria-hidden={!open}
      >
        <span className="card-drawer-handle" />
        <button className="card-drawer-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="card-drawer-body">
          <p className="si-step">
            Step {step?.num} · {identity}
          </p>
          <h3 className="si-title" id="siTitle">
            {step?.title}
          </h3>
          <p className="si-body">{step?.body}</p>
          <p className="si-verse">{step?.verse}</p>
        </div>
      </div>
    </>
  );
}
