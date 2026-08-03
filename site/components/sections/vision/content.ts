export type VmSlide = {
  heading: string;
  items?: string[];
  text?: string;
};

export type VisionContent = {
  label: string;
  title: string;
  slides: VmSlide[];
};

export const visionContent: VisionContent = {
  label: "Vision & Mission",
  title: "Why we exist",
  slides: [
    {
      heading: "Vision",
      items: [
        "We are Trumpets — declaring the Word, way and will of the Lord",
        "We are Swords — raising up an army of the Lord",
        "We are Light — called to manifest the life of God’s Kingdom",
      ],
    },
    {
      heading: "Mission",
      text: "We exist to define, equip, strengthen and release churches, ministries, ministers and corporate entities in building a generation of Kingdom-minded people of integrity and the Word.",
    },
  ],
};
