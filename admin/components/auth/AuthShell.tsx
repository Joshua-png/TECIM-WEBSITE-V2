"use client";

import { Feather } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen bg-canvas">
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>
      <div className="relative hidden flex-1 overflow-hidden lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-canvas/40" />
        <div className="absolute inset-0 opacity-40 mix-blend-color bg-gradient-to-br from-turquoise-deep via-canvas to-gold-deep" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-line-strong bg-overlay-strong backdrop-blur">
              <Feather className="size-5 text-gold" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-wide text-ink">
              TECIM<span className="text-gold">.</span>
            </span>
          </div>
          <div>
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-gold">
              The Eagle Centre for International Ministries
            </p>
            <h1 className="font-serif text-5xl font-medium leading-[1.05] text-ink">
              Forged for
              <br />
              purpose<span className="text-turquoise">.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Watch the process. Content is data, design is code — this portal lets you shape
              the words, images and story of the site without ever touching the design.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:max-w-xl lg:px-16">
        {children}
      </div>
    </main>
  );
}
