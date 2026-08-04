"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { getPath, setPath } from "@tecim/shared";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");
const EDITOR_ATTR_SELECTOR = '[data-editable-type="text"][data-editable-path]';
const IMAGE_ATTR_SELECTOR = '[data-editable-type="image"][data-editable-path]';

interface OverlaySection {
  id: string;
  template: string;
  layout: string;
  content: Record<string, unknown>;
}

interface EditingState {
  sectionId: string;
  path: string;
  el: HTMLElement;
  value: string;
}

interface Media {
  id: string;
  publicId: string;
  secureUrl: string;
  width: number | null;
  height: number | null;
  resourceType: string;
  altText: string | null;
}

function imageValueFromMedia(media: Media): Record<string, unknown> {
  const value: Record<string, unknown> = {
    public_id: media.publicId,
    secure_url: media.secureUrl,
  };
  if (media.width != null) value.width = media.width;
  if (media.height != null) value.height = media.height;
  return value;
}

function editorStyle(): string {
  return `
.tecim-ec-toolbar {
  position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
  z-index: 210; display: flex; align-items: center; gap: 10px;
  background: rgba(15, 17, 21, 0.92); color: #f5f1ea;
  border: 1px solid rgba(245, 158, 11, 0.45); border-radius: 999px;
  padding: 8px 14px; font-size: 12px; letter-spacing: 0.04em;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35); backdrop-filter: blur(8px);
  white-space: nowrap;
}
.tecim-ec-toolbar button {
  background: none; border: none; padding: 0; cursor: pointer; color: inherit;
  font: inherit; letter-spacing: inherit;
}
.tecim-ec-toolbar button:hover { color: #fff; }
.tecim-ec-toggle {
  display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: #f59e0b;
}
.tecim-ec-sep { width: 1px; height: 14px; background: rgba(245, 241, 234, 0.25); }
.tecim-ec-editor {
  position: fixed; z-index: 220; display: flex; flex-direction: column; gap: 6px;
  background: #fff; border: 1px solid rgba(245, 158, 11, 0.65); border-radius: 10px;
  padding: 8px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18); box-sizing: border-box;
  min-width: 260px;
}
.tecim-ec-editor input,
.tecim-ec-editor textarea {
  font: inherit; color: #1a1a1a; background: #fff; border: 1px solid #d8d2c8;
  border-radius: 6px; padding: 4px 6px; outline: none; width: 100%; box-sizing: border-box;
}
.tecim-ec-editor input:focus,
.tecim-ec-editor textarea:focus { border-color: #f59e0b; }
.tecim-ec-editor textarea {
  resize: none; line-height: 1.5; overflow-y: auto;
  min-height: 2.5em; max-height: 40vh; white-space: pre-wrap; word-break: break-word;
}
.tecim-ec-editor-actions {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
.tecim-ec-editor-hint { font-size: 10px; color: #8a8378; letter-spacing: 0.03em; }
.tecim-ec-editor-btns { display: flex; gap: 4px; }
.tecim-ec-editor-btns button {
  font: inherit; font-size: 11px; font-weight: 600; border: none; border-radius: 6px;
  padding: 4px 8px; cursor: pointer;
}
.tecim-ec-save { background: #f59e0b; color: #1a1a1a; }
.tecim-ec-save:disabled { opacity: 0.5; cursor: default; }
.tecim-ec-cancel { background: transparent; color: #6b6560; }
.tecim-ec-toast {
  position: fixed; left: 50%; top: 76px; transform: translateX(-50%);
  z-index: 230; border-radius: 999px; padding: 8px 16px; font-size: 12px; font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25); max-width: 80vw;
}
.tecim-ec-toast-success { background: #16a34a; color: #fff; }
.tecim-ec-toast-error { background: #dc2626; color: #fff; }
body.tecim-ec ${EDITOR_ATTR_SELECTOR},
body.tecim-ec ${IMAGE_ATTR_SELECTOR} {
  outline: 1px dashed rgba(245, 158, 11, 0.3);
  outline-offset: 2px;
}
body.tecim-ec ${EDITOR_ATTR_SELECTOR} { cursor: text; }
body.tecim-ec ${EDITOR_ATTR_SELECTOR}:hover {
  outline: 1.5px dashed rgba(245, 158, 11, 0.8); outline-offset: 3px;
}
body.tecim-ec ${IMAGE_ATTR_SELECTOR} { cursor: pointer; }
body.tecim-ec ${IMAGE_ATTR_SELECTOR}:hover {
  outline: 1.5px dashed rgba(245, 158, 11, 0.8); outline-offset: 3px;
}
body.tecim-ec .tecim-ec-active {
  outline: 1.5px solid #f59e0b !important; background: rgba(245, 158, 11, 0.08);
}
.tecim-ec-picker-backdrop {
  position: fixed; inset: 0; z-index: 240; background: rgba(10, 12, 15, 0.6);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.tecim-ec-picker {
  background: #fff; border-radius: 16px; width: 100%; max-width: 680px;
  max-height: 80vh; display: flex; flex-direction: column;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3); overflow: hidden;
  font-family: inherit; color: #1a1a1a;
}
.tecim-ec-picker-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-bottom: 1px solid #ece7df;
}
.tecim-ec-picker-title { font-size: 14px; font-weight: 700; }
.tecim-ec-picker-sub { font-size: 11px; color: #8a8378; margin-top: 2px; }
.tecim-ec-picker-close {
  background: none; border: none; cursor: pointer; font-size: 18px;
  color: #8a8378; line-height: 1; padding: 4px;
}
.tecim-ec-picker-close:hover { color: #1a1a1a; }
.tecim-ec-picker-body { padding: 16px; overflow-y: auto; flex: 1; }
.tecim-ec-picker-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px;
}
.tecim-ec-picker-item {
  border: 1px solid #e4ded4; border-radius: 10px; overflow: hidden; cursor: pointer;
  padding: 0; background: #faf8f5; text-align: left; transition: border-color 0.15s;
}
.tecim-ec-picker-item:hover { border-color: #f59e0b; }
.tecim-ec-picker-item:disabled { opacity: 0.6; cursor: default; }
.tecim-ec-picker-item img {
  display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover;
}
.tecim-ec-picker-item-label {
  font-size: 10px; color: #6b6560; padding: 5px 7px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.tecim-ec-picker-empty {
  text-align: center; color: #8a8378; font-size: 12px; padding: 32px 0;
}
.tecim-ec-picker-error {
  background: #fee2e2; color: #b91c1c; font-size: 12px; padding: 10px 12px;
  border-radius: 8px; margin-bottom: 12px;
}
.tecim-ec-picker-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 18px; border-top: 1px solid #ece7df;
}
.tecim-ec-pager { display: flex; gap: 8px; align-items: center; }
.tecim-ec-pager button {
  background: #f5f1ea; border: 1px solid #d8d2c8; border-radius: 6px;
  font-size: 11px; padding: 4px 10px; cursor: pointer;
}
.tecim-ec-pager button:disabled { opacity: 0.4; cursor: default; }
.tecim-ec-picker-save-note { font-size: 11px; color: #8a8378; }
`;
}

export function EditableOverlay({
  token,
  sections,
}: {
  token: string;
  sections: OverlaySection[];
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  const [contents, setContents] = useState<Record<string, Record<string, unknown>>>(
    () => Object.fromEntries(sections.map((section) => [section.id, section.content]))
  );
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(
    null
  );
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const [picker, setPicker] = useState<{ sectionId: string; path: string } | null>(
    null
  );
  const [pickerPage, setPickerPage] = useState(1);
  const [pickerItems, setPickerItems] = useState<Media[]>([]);
  const [pickerTotal, setPickerTotal] = useState(0);
  const [pickerTotalPages, setPickerTotalPages] = useState(1);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [pickerSaving, setPickerSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openAtRef = useRef(0);
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  useEffect(() => {
    setContents(
      Object.fromEntries(sections.map((section) => [section.id, section.content]))
    );
  }, [sections]);

  const isMultiline = editing
    ? editing.value.includes("\n") || editing.value.length > 32
    : false;

  const showToast = useCallback((kind: "success" | "error", message: string) => {
    setToast({ kind, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const closeEditor = useCallback(() => {
    setEditing(null);
    setRect(null);
    setDraft("");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("tecim-ec", enabled);
    if (!enabled) closeEditor();
    return () => {
      document.body.classList.remove("tecim-ec");
    };
  }, [enabled, closeEditor]);

  useEffect(() => {
    if (!editing) return;
    editing.el.classList.add("tecim-ec-active");
    return () => editing.el.classList.remove("tecim-ec-active");
  }, [editing]);

  useEffect(() => {
    if (!editing) return;
    const onScroll = (event: Event) => {
      if (Date.now() - openAtRef.current < 250) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest(".tecim-ec-editor")) {
        return;
      }
      closeEditor();
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [editing, closeEditor]);

  useEffect(() => {
    if (!editing) return;
    const el = isMultiline ? textareaRef.current : inputRef.current;
    el?.focus({ preventScroll: true });
    el?.select?.();
  }, [editing, isMultiline]);

  useLayoutEffect(() => {
    if (!editing || !rect || !editorRef.current) return;
    const box = editorRef.current;
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
    const height = box.offsetHeight;
    const width = Math.max(rect.width, 260);
    let top = rect.top - 4;
    if (top + height > window.innerHeight - 8) {
      top = Math.max(8, rect.top - height - 8);
    }
    const left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - width - 8));
    box.style.top = `${top}px`;
    box.style.left = `${left}px`;
    box.style.width = `${width}px`;
  }, [editing, rect, isMultiline, draft]);

  useEffect(() => {
    if (!enabled) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const editableEl = target?.closest?.("[data-editable-path]") as
        | HTMLElement
        | null;
      const inEditor = target?.closest?.(".tecim-ec-editor");
      const inPicker = target?.closest?.(".tecim-ec-picker");

      if (inEditor || inPicker) return;

      if (editableEl) {
        event.preventDefault();
        event.stopPropagation();
        const sectionEl = editableEl.closest("[data-section-id]") as
          | HTMLElement
          | null;
        const sectionId = sectionEl?.dataset.sectionId;
        const path = editableEl.dataset.editablePath;
        if (!sectionId || !path) return;
        if (editableEl.dataset.editableType === "image") {
          closeEditor();
          setPickerPage(1);
          setPicker({ sectionId, path });
          return;
        }
        const value = getPath<string>(contents[sectionId], path);
        if (typeof value !== "string") return;
        setPicker(null);
        openAtRef.current = Date.now();
        const r = editableEl.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width });
        setEditing({ sectionId, path, el: editableEl, value });
        setDraft(value);
        return;
      }

      closeEditor();
      setPicker(null);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled, contents, closeEditor]);

  useEffect(() => {
    if (!picker) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPicker(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [picker]);

  const handleSave = async () => {
    if (!editing) return;
    const { sectionId, path } = editing;
    const next = setPath(contents[sectionId] ?? {}, path, draft);
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/sections/${sectionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: next }),
      });
      if (!res.ok) {
        let message = `Save failed (${res.status})`;
        try {
          const body = (await res.json()) as { error?: { message?: string } };
          message = body.error?.message ?? message;
        } catch {
          // Non-JSON error body; keep the generic message.
        }
        throw new Error(message);
      }
      setContents((prev) => ({ ...prev, [sectionId]: next }));
      document
        .querySelectorAll(
          `[data-section-id="${sectionId}"][data-editable-path="${path}"]`
        )
        .forEach((node) => {
          node.textContent = draft;
        });
      showToast("success", "Saved");
      closeEditor();
      router.refresh();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeEditor();
    }
    const shouldSave =
      event.key === "Enter" && (isMultiline ? event.metaKey || event.ctrlKey : true);
    if (shouldSave) {
      event.preventDefault();
      void handleSave();
    }
  };

  const loadMedia = useCallback(async () => {
    if (!picker) return;
    setPickerLoading(true);
    setPickerError(null);
    try {
      const res = await fetch(
        `${API_URL}/api/v1/admin/media?page=${pickerPage}&perPage=60`,
        {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        let message = `Failed to load media (${res.status})`;
        try {
          const body = (await res.json()) as { error?: { message?: string } };
          message = body.error?.message ?? message;
        } catch {
          // Non-JSON error body; keep the generic message.
        }
        throw new Error(message);
      }
      const body = (await res.json()) as {
        data?: Media[];
        meta?: { page?: number; perPage?: number; total?: number };
      };
      const items = body.data ?? [];
      const meta = body.meta ?? {};
      setPickerItems(items.filter((media) => media.resourceType === "image"));
      setPickerTotal(meta.total ?? 0);
      setPickerTotalPages(Math.max(1, Math.ceil((meta.total ?? 0) / Math.max(1, meta.perPage ?? 60))));
    } catch (err) {
      setPickerError(err instanceof Error ? err.message : "Failed to load media");
      setPickerItems([]);
    } finally {
      setPickerLoading(false);
    }
  }, [picker, pickerPage, token]);

  useEffect(() => {
    if (!picker) return;
    void loadMedia();
  }, [picker, pickerPage, loadMedia]);

  const handlePick = async (media: Media) => {
    if (!picker) return;
    const { sectionId, path } = picker;
    const next = setPath(contents[sectionId] ?? {}, path, imageValueFromMedia(media));
    setPickerSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/sections/${sectionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: next }),
      });
      if (!res.ok) {
        let message = `Save failed (${res.status})`;
        try {
          const body = (await res.json()) as { error?: { message?: string } };
          message = body.error?.message ?? message;
        } catch {
          // Non-JSON error body; keep the generic message.
        }
        throw new Error(message);
      }
      setContents((prev) => ({ ...prev, [sectionId]: next }));
      document
        .querySelectorAll(
          `[data-section-id="${sectionId}"][data-editable-path="${path}"]`
        )
        .forEach((node) => {
          const img = node.querySelector("img");
          if (img) {
            img.removeAttribute("srcset");
            img.removeAttribute("sizes");
            img.src = media.secureUrl;
          }
        });
      showToast("success", "Image updated");
      setPicker(null);
      router.refresh();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Save failed");
    } finally {
      setPickerSaving(false);
    }
  };

  return (
    <>
      <style>{editorStyle()}</style>

      {toast ? (
        <div
          className={`tecim-ec-toast tecim-ec-toast-${toast.kind}`}
          role="status"
        >
          {toast.message}
        </div>
      ) : null}

      {editing && rect ? (
        <div
          ref={editorRef}
          className="tecim-ec-editor"
          style={{ top: -9999, left: -9999 }}
        >
          {isMultiline ? (
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}
          <div className="tecim-ec-editor-actions">
            <span className="tecim-ec-editor-hint">
              {isMultiline ? "Cmd/Ctrl+Enter to save" : "Enter to save"} · Esc to cancel
            </span>
            <span className="tecim-ec-editor-btns">
              <button
                className="tecim-ec-cancel"
                onMouseDown={(e) => e.preventDefault()}
                onClick={closeEditor}
              >
                Cancel
              </button>
              <button
                className="tecim-ec-save"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => void handleSave()}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </span>
          </div>
        </div>
      ) : null}

      {picker ? (
        <div className="tecim-ec-picker-backdrop">
          <div className="tecim-ec-picker">
            <div className="tecim-ec-picker-head">
              <div>
                <p className="tecim-ec-picker-title">Replace image</p>
                <p className="tecim-ec-picker-sub">
                  {pickerTotal} assets in the library
                </p>
              </div>
              <button
                className="tecim-ec-picker-close"
                onClick={() => setPicker(null)}
                aria-label="Close image picker"
              >
                ✕
              </button>
            </div>
            <div className="tecim-ec-picker-body">
              {pickerError ? (
                <div className="tecim-ec-picker-error">{pickerError}</div>
              ) : null}
              {pickerLoading ? (
                <p className="tecim-ec-picker-empty">Loading media…</p>
              ) : pickerItems.length === 0 ? (
                <p className="tecim-ec-picker-empty">
                  {pickerTotal === 0
                    ? "The library is empty — upload images from the admin Media page first."
                    : "No images found in this view."}
                </p>
              ) : (
                <div className="tecim-ec-picker-grid">
                  {pickerItems.map((media) => (
                    <button
                      key={media.id}
                      className="tecim-ec-picker-item"
                      disabled={pickerSaving}
                      onClick={() => void handlePick(media)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={media.secureUrl} alt={media.altText ?? media.publicId} />
                      <span className="tecim-ec-picker-item-label">
                        {media.altText ?? media.publicId}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="tecim-ec-picker-foot">
              <span className="tecim-ec-picker-save-note">
                {pickerSaving ? "Saving…" : "Select an asset to replace the image."}
              </span>
              <span className="tecim-ec-pager">
                <button
                  disabled={pickerPage <= 1 || pickerLoading}
                  onClick={() => setPickerPage((page) => page - 1)}
                >
                  Prev
                </button>
                <span>
                  {pickerPage} / {pickerTotalPages}
                </span>
                <button
                  disabled={pickerPage >= pickerTotalPages || pickerLoading}
                  onClick={() => setPickerPage((page) => page + 1)}
                >
                  Next
                </button>
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="tecim-ec-toolbar">
        <button
          className="tecim-ec-toggle"
          onClick={() => setEnabled((value) => !value)}
          aria-pressed={enabled}
        >
          {enabled ? "◉ Edit mode: ON" : "○ Edit mode: OFF"}
        </button>
        <span className="tecim-ec-sep" />
        {enabled ? <span>Dashed = editable · click to edit</span> : null}
        <button onClick={() => router.refresh()}>Refresh</button>
      </div>
    </>
  );
}
