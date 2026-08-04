"use client";

import { CollectionManager, type CollectionField } from "@/components/collections/collection-manager";
import { formatDateTime } from "@/lib/format";
import type { Announcement } from "@/lib/types";

const fields: CollectionField[] = [
  { key: "title", label: "Title", type: "text", required: true, placeholder: "e.g. Easter Service" },
  { key: "body", label: "Body", type: "textarea", full: true, rows: 3 },
  { key: "linkUrl", label: "Link URL", type: "url" },
  { key: "linkLabel", label: "Link label", type: "text", placeholder: "e.g. Learn more" },
  { key: "activeFrom", label: "Active from", type: "datetime" },
  { key: "activeUntil", label: "Active until", type: "datetime" },
];

export default function AnnouncementsPage() {
  return (
    <CollectionManager
      title="Announcements"
      eyebrow="Content"
      description="Short notices shown on the site. Announcements are live between the active window, if set."
      singular="Announcement"
      listPath="/admin/announcements"
      dataKey="announcements"
      fields={fields}
      defaultValues={{ title: "", body: "", linkUrl: "", linkLabel: "", activeFrom: "", activeUntil: "" }}
      renderRow={(item) => {
        const announcement = item as unknown as Announcement;
        const activeWindow =
          announcement.activeFrom || announcement.activeUntil
            ? [
                announcement.activeFrom ? formatDateTime(announcement.activeFrom) : "",
                "→",
                announcement.activeUntil ? formatDateTime(announcement.activeUntil) : "never",
              ].join(" ")
            : "";
        return {
          title: announcement.title,
          subtitle: activeWindow || announcement.body?.slice(0, 80) || "No active window set",
        };
      }}
    />
  );
}
