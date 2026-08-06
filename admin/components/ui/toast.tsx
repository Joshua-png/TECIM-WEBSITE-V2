"use client";

import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; kind: ToastKind; title: string; message?: string };

const ToastContext = createContext<{ push: (kind: ToastKind, title: string, message?: string) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Toaster");
  return ctx;
}

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const push = useCallback((kind: ToastKind, title: string, message?: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, kind, title, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rise pointer-events-auto flex items-start gap-3 rounded-xl border bg-panel-2 px-4 py-3 shadow-pop",
              toast.kind === "success" && "border-turquoise/30",
              toast.kind === "error" && "border-rose/30",
              toast.kind === "info" && "border-line-strong"
            )}
          >
            {toast.kind === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-turquoise" />
            ) : toast.kind === "error" ? (
              <AlertTriangle className="mt-0.5 size-4.5 shrink-0 text-rose" />
            ) : (
              <Info className="mt-0.5 size-4.5 shrink-0 text-gold" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{toast.title}</p>
              {toast.message ? (
                <p className="mt-0.5 break-words text-xs text-muted">{toast.message}</p>
              ) : null}
            </div>
            <button
              onClick={() => remove(toast.id)}
              className="rounded p-0.5 text-faint transition-colors hover:text-ink"
              aria-label="Dismiss"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
