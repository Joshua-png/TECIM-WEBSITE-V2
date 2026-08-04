import type { ImageValue } from "../../lib/image";

export type AboutContent = {
  label: string;
  title: string;
  description: string;
  checklist: string[];
  tailIntro: string;
  partners: string[];
  tailSuffix: string;
  image: ImageValue;
  imageAlt: string;
  badgeTitle: string;
  badgeSubtitle: string;
};

export const aboutContent: AboutContent = {
  label: "Who We Are",
  title: "Welcome to The Eagle Centre",
  description:
    "A non-profit organization that seeks to build and raise up a generation of kingdom-minded people. We exist to equip, define, strengthen and release ministries and ministers.",
  checklist: [
    "Clear teaching and training for churches, ministries, leaders & corporate entities",
    "Resource materials that promote healthy growth",
    "Strategic networking with likeminded kingdom entities",
    "Seminars and conferences that advance the agenda",
  ],
  tailIntro: "Home to",
  partners: [
    "Wise Master Builders’ International",
    "Hadassah Company Fellowship International",
  ],
  tailSuffix: ".",
  image:
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=900&q=85",
  imageAlt: "Community worship",
  badgeTitle: "Raising a generation",
  badgeSubtitle: "Kingdom-minded · Integrity · The Word",
};
