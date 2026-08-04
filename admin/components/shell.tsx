"use client";

import {
  Activity,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Feather,
  GalleryHorizontal,
  Images,
  LayoutTemplate,
  LogOut,
  Megaphone,
  Menu,
  Newspaper,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isAuthenticated, logout } from "@/lib/api";
import { cn } from "@/lib/cn";
import { SITE_URL } from "@/lib/api";

type NavEntry = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
};

const groups: { group: string; items: NavEntry[] }[] = [
  {
    group: "Workspace",
    items: [
      { href: "/", label: "Overview", icon: Sparkles },
      { href: "/pages", label: "Pages", icon: LayoutTemplate },
      { href: "/media", label: "Media", icon: Images },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/events", label: "Events", icon: CalendarDays },
      { href: "/gallery", label: "Gallery", icon: GalleryHorizontal },
      { href: "/sermons", label: "Sermons", icon: BookOpen },
      { href: "/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    group: "Structure",
    items: [
      { href: "/navigation", label: "Navigation", icon: Menu },
      { href: "/seo", label: "SEO", icon: Search },
      { href: "/settings", label: "Settings", icon: SlidersHorizontal },
    ],
  },
];

const titles: Record<string, string> = {
  "/": "Overview",
  "/pages": "Pages",
  "/media": "Media library",
  "/events": "Events",
  "/gallery": "Gallery",
  "/sermons": "Sermons",
  "/announcements": "Announcements",
  "/navigation": "Navigation",
  "/seo": "SEO",
  "/settings": "Settings",
  "/activity": "Activity log",
};

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const email = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("tecim.email") ?? "Admin";
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const title = titles[pathname] ?? "Pages";

  const nav = (
    <nav className="flex flex-col gap-6 overflow-y-auto px-4 pb-8">
      <div className="flex items-center gap-3 px-2 pt-6">
        <span className="flex size-9 items-center justify-center rounded-xl border border-line-strong bg-white/[0.05]">
          <Feather className="size-4.5 text-gold" />
        </span>
        <div>
          <p className="font-serif text-lg font-semibold leading-none text-ink">
            TECIM<span className="text-gold">.</span>
          </p>
          <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.18em] text-faint">Admin Studio</p>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.group}>
          <p className="mb-2 px-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-faint">
            {group.group}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-[0.82rem] font-medium transition-colors",
                      active
                        ? "bg-turquoise/12 text-turquoise"
                        : "text-muted hover:bg-white/[0.05] hover:text-ink"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4",
                        active ? "text-turquoise" : "text-faint group-hover:text-muted"
                      )}
                    />
                    {item.label}
                    {active ? (
                      <span className="ml-auto size-1.5 rounded-full bg-turquoise" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div>
        <p className="mb-2 px-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-faint">
          System
        </p>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/activity"
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-[0.82rem] font-medium transition-colors",
                pathname.startsWith("/activity")
                  ? "bg-turquoise/12 text-turquoise"
                  : "text-muted hover:bg-white/[0.05] hover:text-ink"
              )}
            >
              <Activity
                className={cn(
                  "size-4",
                  pathname.startsWith("/activity") ? "text-turquoise" : "text-faint"
                )}
              />
              Activity log
            </Link>
          </li>
          <li>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[0.82rem] font-medium text-muted transition-colors hover:bg-white/[0.05] hover:text-ink"
            >
              <Newspaper className="size-4 text-faint group-hover:text-muted" />
              View site
              <span className="ml-auto rounded border border-line px-1.5 py-0.5 text-[0.58rem] uppercase tracking-wider text-faint">
                new tab
              </span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 border-r border-line bg-panel transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {nav}
      </aside>

      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-line bg-canvas/85 px-5 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="font-serif text-2xl font-medium text-ink">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-line px-3 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-muted sm:inline-flex">
              <span className="live-dot size-1.5 rounded-full bg-turquoise" />
              API {process.env.NEXT_PUBLIC_API_URL ?? "connected"}
            </span>

            <div className="relative">
              <button
                onClick={() => setUserOpen((open) => !open)}
                className="flex items-center gap-2.5 rounded-lg border border-line bg-panel px-2.5 py-1.5 transition-colors hover:border-line-strong"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-turquoise/15 text-xs font-semibold text-turquoise">
                  {email.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-36 truncate text-xs font-medium text-muted sm:block">
                  {email}
                </span>
                <ChevronDown className="size-3.5 text-faint" />
              </button>
              {userOpen ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
                  <div className="rise absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-line-strong bg-panel-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <p className="border-b border-line px-4 py-3 text-xs text-faint">
                      Signed in as
                      <span className="mt-0.5 block truncate text-sm font-medium text-ink">{email}</span>
                    </p>
                    <button
                      onClick={() => void logout()}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose transition-colors hover:bg-rose/10"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8">{children}</main>

        <footer className="flex items-center justify-between border-t border-line px-8 py-4 text-[0.68rem] text-faint">
          <span>TECIM Admin Studio</span>
          <span>Content is data · Design is code</span>
        </footer>
      </div>
    </div>
  );
}
