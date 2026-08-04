import type { PublicEvent } from "./api";
import type { EventCard } from "@tecim/shared";

function formatRange(startAt: string, endAt: string | null): string {
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;
  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = start.getFullYear();
  if (!end) return `${startLabel}, ${year}`;
  const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (end.getFullYear() !== year) {
    return `${startLabel}, ${year} – ${endLabel}, ${end.getFullYear()}`;
  }
  return `${startLabel} – ${endLabel}, ${year}`;
}

export function publishedEventsToCards(events: PublicEvent[]): EventCard[] {
  return events.map((event) => ({
    date: formatRange(event.startAt, event.endAt),
    title: event.title,
    location: event.location ?? "",
    image: event.image ? { secure_url: event.image.secure_url } : "",
    imageAlt: event.title,
  }));
}
