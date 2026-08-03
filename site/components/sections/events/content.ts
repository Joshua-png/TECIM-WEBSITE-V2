export type EventCard = {
  date: string;
  title: string;
  location: string;
  image: string;
  imageAlt: string;
};

export type EventsContent = {
  label: string;
  title: string;
  events: EventCard[];
};

export const eventsContent: EventsContent = {
  label: "Conferences & Events",
  title: "Upcoming gatherings",
  events: [
    {
      date: "July 03 – 06, 2024",
      title: "Hadassah Fellowship International Conference",
      location: "Ghanaman Soccer Center",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=85",
      imageAlt: "Crowd at a worship conference",
    },
    {
      date: "August 12 – 16, 2024",
      title: "Wise Master Builders International Conference",
      location: "Oasis International Training Center",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&q=85",
      imageAlt: "Conference audience listening",
    },
  ],
};
