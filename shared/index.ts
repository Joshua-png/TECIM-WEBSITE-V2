export { default as Hero } from "./sections/Hero";
export { default as About } from "./sections/About";
export { default as Contact } from "./sections/Contact";
export { default as Events } from "./sections/Events";
export { default as Gallery } from "./sections/Gallery";
export { default as Services } from "./sections/Services";
export { default as Values } from "./sections/Values";
export { default as Vision } from "./sections/Vision";
export { default as Reveal } from "./sections/Reveal";

export { imageUrl, type ImageValue } from "./lib/image";

export { EditableText } from "./editor/EditableText";
export { EditableImage } from "./editor/EditableImage";
export { getPath, setPath, type EditablePath } from "./editor/path";

export { heroContent, type HeroContent, type HeroStep, type IdentitySlug } from "./sections/hero/content";
export { aboutContent, type AboutContent } from "./sections/about/content";
export { contactContent, type ContactContent, type Location } from "./sections/contact/content";
export { eventsContent, type EventsContent } from "./sections/events/content";
export { galleryContent, type GalleryContent } from "./sections/gallery/content";
export { servicesContent, type ServicesContent } from "./sections/services/content";
export { valuesContent, type ValuesContent } from "./sections/values/content";
export { visionContent, type VisionContent } from "./sections/vision/content";
