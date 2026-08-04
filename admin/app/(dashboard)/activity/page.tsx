"use client";

import { History } from "lucide-react";
import { useState } from "react";
import { useDataPaginated } from "@/lib/use-data";
import type { ActivityEntry } from "@/lib/types";
import { formatDateTime, relativeTime } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/spinner";

const ACTION_TONES: Record<string, "neutral" | "turquoise" | "gold" | "rose" | "burgundy"> = {
  create: "turquoise",
  update: "gold",
  publish: "burgundy",
  rollback: "rose",
  delete: "rose",
  login: "neutral",
  logout: "neutral",
  upload: "turquoise",
};

const ACTION_LABELS: Record<string, string> = {
  create: "Created",
  update: "Updated",
  publish: "Published",
  rollback: "Rolled back",
  delete: "Deleted",
  login: "Signed in",
  logout: "Signed out",
  upload: "Uploaded",
};

export default function ActivityPage() {
  const [page, setPage] = useState(1);
  const { items, meta, loading } = useDataPaginated<ActivityEntry[]>(
    `/admin/activity?page=${page}&perPage=20`,
    [page]
  );

  if (loading) return <PageLoader />;

  const entries = items;

  return (
    <div>
      <PageHeader
        eyebrow="System"
        title="Activity"
        description="Every change made to the site, in order."
      />

      {entries.length === 0 ? (
        <EmptyState icon={History} title="No activity yet" description="Changes will appear here." />
      ) : (
        <Card className="px-0">
          <div className="divide-y divide-line">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 px-6 py-3.5">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={ACTION_TONES[entry.action] ?? "neutral"}>
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </Badge>
                    <span className="text-sm font-medium text-ink">{entry.entityType ?? "system"}</span>
                    {entry.details ? (
                      <span className="text-xs text-faint">
                        {Object.entries(entry.details)
                          .map(([key, value]) => `${key}: ${String(value)}`)
                          .join(" · ")}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted" title={entry.createdAt ? formatDateTime(entry.createdAt) : ""}>
                    {entry.createdAt ? relativeTime(entry.createdAt) : ""}
                  </p>
                  {entry.ip ? <p className="text-[0.65rem] text-faint">{entry.ip}</p> : null}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-line">
            <Pagination page={page} totalPages={meta.totalPages} onPage={setPage} />
          </div>
        </Card>
      )}
    </div>
  );
}
