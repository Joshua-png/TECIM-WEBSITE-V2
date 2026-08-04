import { useEffect } from "react";
import { EditableText } from "../../editor/EditableText";
import type { HeroStep, IdentitySlug } from "./content";

export default function InsightDrawer({
  open,
  step,
  identity,
  pathPrefix,
  editable,
  onClose,
}: {
  open: boolean;
  step: HeroStep | null;
  identity: IdentitySlug;
  pathPrefix?: string;
  editable?: boolean;
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
            <EditableText
              path={pathPrefix ? `${pathPrefix}.title` : ""}
              editable={editable && Boolean(pathPrefix)}
            >
              {step?.title}
            </EditableText>
          </h3>
          <p className="si-body">
            <EditableText
              path={pathPrefix ? `${pathPrefix}.body` : ""}
              editable={editable && Boolean(pathPrefix)}
            >
              {step?.body}
            </EditableText>
          </p>
          <p className="si-verse">
            <EditableText
              path={pathPrefix ? `${pathPrefix}.verse` : ""}
              editable={editable && Boolean(pathPrefix)}
            >
              {step?.verse}
            </EditableText>
          </p>
        </div>
      </div>
    </>
  );
}
