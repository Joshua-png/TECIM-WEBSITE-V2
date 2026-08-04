import {
  createElement,
  type ComponentType,
  type ReactElement,
} from "react";
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
  about_image_left: About,
  about_image_right: About,
  values: Values,
  vision: Vision,
  services: Services,
  events: Events,
  gallery: Gallery,
  contact: Contact,
} as const;

export type SectionSlug = keyof typeof sections;

type SectionContent = Record<string, unknown>;

type SectionComponent = ComponentType<{ content?: SectionContent }>;

export function renderSection(
  template: string,
  content: SectionContent,
  key: string
): ReactElement | null {
  const Component = sections[template as SectionSlug] as unknown as SectionComponent;
  if (!Component) return null;
  return createElement(Component, { key, content });
}

export default sections;
