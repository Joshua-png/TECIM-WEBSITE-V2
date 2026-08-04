"use client";

import {
  Activity as ActivityIcon,
  BookOpen,
  CalendarDays,
  GalleryHorizontal,
  Images,
  LayoutTemplate,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { useData, useDataPaginated } from "@/lib/use-data";
import type { ActivityEntry, Media } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/spinner";
import { relativeTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const ACTION_TONE: Record<string, "neutral" | "turquoise" | "gold" | "rose"> = {
  login: "turquoise",
  publish: "gold",
  rollback: "gold",
  create: "turquoise",
  update: "neutral",
  delete: "rose",
};

export default function OverviewPage() {
  const pages = useData<{ pages: unknown[] }>("/admin/pages");
  const media = useDataPaginated<Media[]>("/admin/media?perPage=1");
  const activity = useDataPaginated<ActivityEntry[]>("/admin/activity?perPage=6");
  const events = useData<{ events: unknown[] }>("/admin/events");
  const gallery = useData<{ gallery: unknown[] }>("/admin/gallery");
  const sermons = useData<{ sermons: unknown[] }>("/admin/sermons");
  const announcements = useData<{ announcements: unknown[] }>("/admin/announcements");

  if (pages.loading || events.loading) return <PageLoader />;

  const published = pages.data?.pages.filter((p) => (p as { status: string }).status === "published").length ?? 0;
  const drafts = (pages.data?.pages.length ?? 0) - published;

  const stats = [
    {
      label: "Pages",
      value: pages.data?.pages.length ?? 0,
      sub: `${published} published · ${drafts} draft`,
      icon: LayoutTemplate,
      href: "/pages",
      tone: "text-turquoise",
    },
    {
      label: "Media assets",
      value: media.meta.total,
      sub: "Cloudinary library",
      icon: Images,
      href: "/media",
      tone: "text-gold",
    },
    {
      label: "Events",
      value: events.data?.events.length ?? 0,
      sub: "Upcoming gatherings",
      icon: CalendarDays,
      href: "/events",
      tone: "text-turquoise",
    },
    {
      label: "Gallery items",
      value: gallery.data?.gallery.length ?? 0,
      sub: "Moments on display",
      icon: GalleryHorizontal,
      href: "/gallery",
      tone: "text-rose",
    },
    {
      label: "Sermons",
      value: sermons.data?.sermons.length ?? 0,
      sub: "Audio library",
      icon: BookOpen,
      href: "/sermons",
      tone: "text-gold",
    },
    {
      label: "Announcements",
      value: announcements.data?.announcements.length ?? 0,
      sub: "Active notices",
      icon: Megaphone,
      href: "/announcements",
      tone: "text-turquoise",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Good day, Director"
        description="The studio is live. Review the state of the site and pick up where you left off."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat, index) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rise group rounded-2xl border border-line bg-panel p-4 transition-all hover:border-line-strong hover:bg-panel-2"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <stat.icon className={`size-5 ${stat.tone}`} />
            <p className="mt-4 font-serif text-3xl font-medium text-ink">{stat.value}</p>
            <p className="mt-0.5 text-[0.7rem] font-medium uppercase tracking-wider text-muted">
              {stat.label}
            </p>
            <p className="mt-1 truncate text-[0.66rem] text-faint">{stat.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent activity" description="The last few actions across the CMS">
          {activity.loading ? (
            <PageLoader />
          ) : activity.items.length > 0 ? (
            <ul className="divide-y divide-line">
              {activity.items.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3.5 px-5 py-3">
                  <Badge tone={ACTION_TONE[entry.action] ?? "neutral"} className="w-24 justify-center">
                    {entry.action}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">
                      {entry.entityType ? (
                        <>
                          <span className="capitalize">{entry.entityType}</span>
                          <span className="mx-1.5 text-faint">·</span>
                        </>
                      ) : null}
                      <span className="text-muted">{formatActivityDetail(entry)}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-[0.68rem] text-faint">
                    {relativeTime(entry.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-muted">No activity yet.</p>
          )}
          <div className="border-t border-line px-5 py-3">
            <Link
              href="/activity"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-turquoise hover:text-turquoise-deep"
            >
              <ActivityIcon className="size-3.5" />
              View full log
            </Link>
          </div>
        </Card>

        <Card title="Quick actions" description="Common entry points into the studio">
          <div className="grid gap-2.5 p-5">
            {[
              { label: "Edit the home page", href: "/pages", desc: "Open the page builder" },
              { label: "Upload media", href: "/media", desc: "Add images & videos to the library" },
              { label: "Schedule an event", href: "/events", desc: "Add a conference or gathering" },
              { label: "Update global SEO", href: "/seo", desc: "Titles, descriptions, social cards" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center justify-between rounded-xl border border-line bg-canvas-soft px-4 py-3.5 transition-colors hover:border-turquoise/40"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{item.label}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
                <span className="text-turquoise transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function formatActivityDetail(entry: ActivityEntry): string {
  const detail = entry.details;
  if (detail && typeof detail === "object" && "title" in detail && typeof detail.title === "string") {
    return detail.title;
  }
  if (detail && typeof detail === "object" && "key" in detail && typeof detail.key === "string") {
    return `setting: ${detail.key}`;
  }
  return "";
}
