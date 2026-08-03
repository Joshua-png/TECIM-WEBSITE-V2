export type ServiceRow = {
  day: string;
  time: string;
  tag: string;
  title: string;
  description: string;
};

export type ServicesContent = {
  label: string;
  title: string;
  sub: string;
  ctaLabel: string;
  ctaHref: string;
  rows: ServiceRow[];
};

export const servicesContent: ServicesContent = {
  label: "Services",
  title: "What's Happening",
  sub: "Join us throughout the week as we gather to be taught, to pray and to worship — as Light, Trumpets and Swords.",
  ctaLabel: "Plan a Visit",
  ctaHref: "#contact",
  rows: [
    {
      day: "Thursday",
      time: "6:00 – 8:00pm",
      tag: "Teaching",
      title: "Teaching Service",
      description:
        "Clear teaching and training that strengthens the foundation of faith and ministry.",
    },
    {
      day: "Friday",
      time: "7:00 – 9:00pm",
      tag: "Prayer",
      title: "Prayer Meeting",
      description:
        "Intercession, alignment and encounter with the presence of God.",
    },
    {
      day: "Sunday",
      time: "7:00 – 11:30am",
      tag: "Worship",
      title: "Worship Service",
      description:
        "Gather to worship, receive the Word and be sent as light, trumpets and swords.",
    },
  ],
};
