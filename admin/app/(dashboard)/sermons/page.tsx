"use client";

import { CollectionManager, type CollectionField } from "@/components/collections/collection-manager";
import { formatDate } from "@/lib/format";
import type { Sermon } from "@/lib/types";

const fields: CollectionField[] = [
  { key: "title", label: "Title", type: "text", required: true, placeholder: "e.g. The Faith of Abraham" },
  { key: "speaker", label: "Speaker", type: "text", placeholder: "e.g. Pastor Emmanuel" },
  { key: "description", label: "Description", type: "textarea", full: true, rows: 3 },
  { key: "mediaUrl", label: "Audio / video URL", type: "url", full: true, placeholder: "https://…" },
  { key: "imageMediaId", label: "Artwork", type: "media" },
  { key: "datePreached", label: "Preached on", type: "date" },
];

export default function SermonsPage() {
  return (
    <CollectionManager
      title="Sermons"
      eyebrow="Content"
      description="Teaching and messages. Published sermons appear on the site."
      singular="Sermon"
      listPath="/admin/sermons"
      dataKey="sermons"
      fields={fields}
      defaultValues={{ title: "", speaker: "", description: "", mediaUrl: "", imageMediaId: "", datePreached: "" }}
      renderRow={(item) => {
        const sermon = item as unknown as Sermon;
        return {
          title: sermon.title,
          subtitle: [sermon.speaker ?? "", sermon.datePreached ? formatDate(sermon.datePreached) : ""]
            .filter(Boolean)
            .join(" · "),
        };
      }}
    />
  );
}
