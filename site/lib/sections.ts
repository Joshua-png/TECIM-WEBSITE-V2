import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Values from "@/components/sections/Values";
import Vision from "@/components/sections/Vision";
import Services from "@/components/sections/Services";
import Events from "@/components/sections/Events";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";

const sections = {
  hero: Hero,
  about: About,
  values: Values,
  vision: Vision,
  services: Services,
  events: Events,
  gallery: Gallery,
  contact: Contact,
} as const;

export type SectionSlug = keyof typeof sections;

export default sections;
