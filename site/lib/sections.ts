import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Values from "@/components/sections/Values";
import Vision from "@/components/sections/Vision";

const sections = {
  hero: Hero,
  about: About,
  values: Values,
  vision: Vision,
} as const;

export type SectionSlug = keyof typeof sections;

export default sections;
