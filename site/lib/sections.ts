import Hero from "@/components/sections/Hero";

const sections = {
  hero: Hero,
} as const;

export type SectionSlug = keyof typeof sections;

export default sections;
