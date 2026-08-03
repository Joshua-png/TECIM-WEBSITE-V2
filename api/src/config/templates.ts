export interface SectionTemplateDefinition {
  slug: string;
  name: string;
  description: string;
  componentName: string;
  schema: Record<string, unknown>;
}

const imageField = {
  oneOf: [
    { type: "string" },
    {
      type: "object",
      required: ["public_id", "secure_url"],
      properties: {
        public_id: { type: "string" },
        secure_url: { type: "string" },
        width: { type: "integer" },
        height: { type: "integer" },
      },
    },
  ],
};

export const sectionTemplates: SectionTemplateDefinition[] = [
  {
    slug: "hero",
    name: "Hero",
    description: "Full-height cinematic intro with selectable identity and process steps.",
    componentName: "Hero",
    schema: {
      type: "object",
      required: ["label", "title", "subtitle", "identities"],
      properties: {
        label: { type: "string" },
        title: { type: "string" },
        titleBreak: { type: "string" },
        subtitle: { type: "string" },
        identities: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["slug", "label", "backgroundImage", "steps"],
            properties: {
              slug: { enum: ["light", "trumpets", "swords"] },
              label: { type: "string" },
              bgFilter: { type: "string" },
              backgroundImage: imageField,
              steps: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  required: ["num", "title", "body", "verse", "image"],
                  properties: {
                    num: { type: "string" },
                    title: { type: "string" },
                    body: { type: "string" },
                    verse: { type: "string" },
                    image: imageField,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    slug: "about_image_left",
    name: "About (image left)",
    description: "Intro section with checklist, partners and a floating glass badge.",
    componentName: "AboutImageLeft",
    schema: {
      type: "object",
      required: ["label", "title", "description"],
      properties: {
        label: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        checklist: { type: "array", items: { type: "string" } },
        tailIntro: { type: "string" },
        partners: { type: "array", items: { type: "string" } },
        tailSuffix: { type: "string" },
        image: imageField,
        imageAlt: { type: "string" },
        badgeTitle: { type: "string" },
        badgeSubtitle: { type: "string" },
      },
    },
  },
  {
    slug: "about_image_right",
    name: "About (image right)",
    description: "Intro section with image on the right side.",
    componentName: "AboutImageRight",
    schema: {
      type: "object",
      required: ["label", "title", "description"],
      properties: {
        label: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        checklist: { type: "array", items: { type: "string" } },
        tailIntro: { type: "string" },
        partners: { type: "array", items: { type: "string" } },
        tailSuffix: { type: "string" },
        image: imageField,
        imageAlt: { type: "string" },
        badgeTitle: { type: "string" },
        badgeSubtitle: { type: "string" },
      },
    },
  },
  {
    slug: "vision",
    name: "Vision & Mission",
    description: "Glass carousel showing vision and mission slides.",
    componentName: "Vision",
    schema: {
      type: "object",
      required: ["label", "title", "slides"],
      properties: {
        label: { type: "string" },
        title: { type: "string" },
        slides: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["heading"],
            properties: {
              heading: { type: "string" },
              items: { type: "array", items: { type: "string" } },
              text: { type: "string" },
            },
          },
        },
      },
    },
  },
  {
    slug: "values",
    name: "Values",
    description: "Core values cards with auto-numbered markers.",
    componentName: "Values",
    schema: {
      type: "object",
      required: ["label", "title", "cards"],
      properties: {
        label: { type: "string" },
        title: { type: "string" },
        cards: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["title", "text"],
            properties: {
              title: { type: "string" },
              text: { type: "string" },
            },
          },
        },
      },
    },
  },
  {
    slug: "services",
    name: "Services",
    description: "Weekly gathering schedule rendered as full-width anchor rows.",
    componentName: "Services",
    schema: {
      type: "object",
      required: ["label", "title", "rows"],
      properties: {
        label: { type: "string" },
        title: { type: "string" },
        sub: { type: "string" },
        ctaLabel: { type: "string" },
        ctaHref: { type: "string" },
        rows: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["day", "time", "tag", "title", "description"],
            properties: {
              day: { type: "string" },
              time: { type: "string" },
              tag: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
            },
          },
        },
      },
    },
  },
  {
    slug: "events",
    name: "Events",
    description: "Upcoming conferences and gatherings as image-left cards.",
    componentName: "Events",
    schema: {
      type: "object",
      required: ["label", "title", "events"],
      properties: {
        label: { type: "string" },
        title: { type: "string" },
        events: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["date", "title", "location", "image", "imageAlt"],
            properties: {
              date: { type: "string" },
              title: { type: "string" },
              location: { type: "string" },
              image: imageField,
              imageAlt: { type: "string" },
            },
          },
        },
      },
    },
  },
  {
    slug: "timeline",
    name: "Timeline",
    description: "Vertical timeline of dated milestones.",
    componentName: "Timeline",
    schema: {
      type: "object",
      required: ["title", "events"],
      properties: {
        title: { type: "string" },
        subtitle: { type: "string" },
        events: {
          type: "array",
          items: {
            type: "object",
            required: ["date", "title", "description"],
            properties: {
              date: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
            },
          },
        },
      },
    },
  },
  {
    slug: "contact",
    name: "Contact",
    description: "Map card with location tabs, hours, and contact details.",
    componentName: "Contact",
    schema: {
      type: "object",
      required: ["label", "title", "sub", "locations", "email"],
      properties: {
        label: { type: "string" },
        title: { type: "string" },
        sub: { type: "string" },
        locations: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["name", "query"],
            properties: {
              name: { type: "string" },
              query: { type: "string" },
            },
          },
        },
        addressLines: { type: "array", items: { type: "string" } },
        addressNote: { type: "string" },
        directionsLabel: { type: "string" },
        directionsHref: { type: "string" },
        hours: {
          type: "array",
          items: {
            type: "object",
            required: ["day", "time"],
            properties: {
              day: { type: "string" },
              time: { type: "string" },
            },
          },
        },
        email: { type: "string" },
        phones: { type: "array", items: { type: "string" } },
      },
    },
  },
  {
    slug: "gallery",
    name: "Gallery",
    description: "Dual-row auto-scrolling marquee of images with auto-index badges.",
    componentName: "Gallery",
    schema: {
      type: "object",
      required: ["label", "title", "rowA", "rowB"],
      properties: {
        label: { type: "string" },
        title: { type: "string" },
        sub: { type: "string" },
        reelTag: { type: "string" },
        moreLabel: { type: "string" },
        moreHref: { type: "string" },
        rowA: { type: "array", items: { type: "string" } },
        rowB: { type: "array", items: { type: "string" } },
      },
    },
  },
];
