"use client";

import { CollectionManager, type CollectionField } from "@/components/collections/collection-manager";
import { formatDateTime } from "@/lib/format";
import type { EventItem } from "@/lib/types";

const fields: CollectionField[] = [
  { key: "title", label: "Title", type: "text", required: true, placeholder: "e.g. Annual Conference 2026" },
  { key: "slug", label: "Slug", type: "text", hint: "optional — auto-generated if left empty" },
  { key: "description", label: "Description", type: "textarea", full: true, rows: 3 },
  { key: "startAt", label: "Starts", type: "datetime", required: true },
  { key: "endAt", label: "Ends", type: "datetime" },
  { key: "location", label: "Location", type: "text", placeholder: "e.g. Ghanaman Soccer Center" },
  { key: "imageMediaId", label: "Cover image", type: "media", hint: "from the media library" },
];

export default function EventsPage() {
  return (
    <CollectionManager
      title="Events"
      eyebrow="Content"
      description="Conferences, gatherings and scheduled ministry events. Published events appear on the site."
      singular="Event"
      listPath="/admin/events"
      dataKey="events"
      fields={fields}
      defaultValues={{ title: "", description: "", startAt: "", endAt: "", location: "", imageMediaId: "" }}
      renderRow={(item) => {
        const event = item as unknown as EventItem;
        return {
          title: event.title,
          subtitle: [
            event.startAt ? formatDateTime(event.startAt) : "",
            event.endAt ? `→ ${formatDateTime(event.endAt)}` : "",
            event.location ?? "",
          ]
            .filter(Boolean)
            .join(" · "),
        };
      }}
    />
  );
}
