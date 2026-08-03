export type Location = {
  name: string;
  query: string;
};

export type Hour = {
  day: string;
  time: string;
};

export type ContactContent = {
  label: string;
  title: string;
  sub: string;
  locations: Location[];
  addressLines: string[];
  addressNote: string;
  directionsLabel: string;
  directionsHref: string;
  hours: Hour[];
  email: string;
  phones: string[];
};

export const contactContent: ContactContent = {
  label: "Stay in Touch",
  title: "Find us & connect",
  sub: "Three congregations, one family. Find the location nearest you and come as you are.",
  locations: [
    { name: "Shiashie", query: "Shiashie, Accra, Ghana" },
    { name: "Madina", query: "Madina, Accra, Ghana" },
    { name: "Prampram", query: "Prampram, Ghana" },
  ],
  addressLines: ["123 Main St, San Francisco, CA 94105"],
  addressNote: "(Update with actual Ghana address)",
  directionsLabel: "Get Directions",
  directionsHref: "https://www.google.com/maps?q=Shiashie,+Accra,+Ghana",
  hours: [
    { day: "Monday", time: "Closed" },
    { day: "Tue – Fri", time: "8:20am – 4:30pm" },
    { day: "Saturday", time: "Closed" },
    { day: "Sunday", time: "7:00am – 11:30am" },
  ],
  email: "theeaglecenter1@gmail.com",
  phones: ["+233 271 503 760", "+233 265 508 760"],
};
