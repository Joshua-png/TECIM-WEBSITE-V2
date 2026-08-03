import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

const sections = {
  hero: Hero,
  about: About,
} as const;

export type SectionSlug = keyof typeof sections;

export default sections;
