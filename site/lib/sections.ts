import {
  createElement,
  type ComponentType,
  type ReactElement,
} from "react";
import {
  Hero,
  About,
  Values,
  Vision,
  Services,
  Events,
  Gallery,
  Contact,
} from "@tecim/shared";

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

type SectionComponent = ComponentType<{
  content?: SectionContent;
  editable?: boolean;
}>;

export function renderSection(
  template: string,
  content: SectionContent,
  key: string,
  editable = false,
  extra?: Record<string, unknown>
): ReactElement | null {
  const Component = sections[template as SectionSlug] as unknown as SectionComponent;
  if (!Component) return null;
  return createElement(Component, { key, content, editable, ...extra });
}

export default sections;
