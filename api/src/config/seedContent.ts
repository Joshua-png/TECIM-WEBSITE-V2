export interface SeedSection {
  template: string;
  layout: string;
  label: string;
  content: Record<string, unknown>;
}

export const defaultSettings: Array<{ key: string; value: Record<string, unknown>; group: string }> = [
  {
    key: "site",
    value: {
      name: "The Eagle Centre for International Ministries",
      shortName: "TECIM",
      tagline: "Light. Trumpets. Swords.",
      logo: null,
      announcement: null,
    },
    group: "site",
  },
  {
    key: "contact",
    value: {
      email: "theeaglecenter1@gmail.com",
      phones: ["+233 271 503 760", "+233 265 508 760"],
      address: "123 Main St, San Francisco, CA 94105",
      serviceTimes: [
        { day: "Thursday", time: "6:00 – 8:00pm", label: "Teaching Service" },
        { day: "Friday", time: "7:00 – 9:00pm", label: "Prayer Meeting" },
        { day: "Sunday", time: "7:00 – 11:30am", label: "Worship Service" },
      ],
    },
    group: "contact",
  },
  {
    key: "social",
    value: {
      facebook: null,
      instagram: null,
      youtube: null,
      x: null,
    },
    group: "social",
  },
];

export const defaultNavigation: Array<{
  label: string;
  url: string | null;
  pageSlug: string | null;
  target: string;
}> = [
  { label: "Home", url: null, pageSlug: "home", target: "_self" },
  { label: "About", url: "#about", pageSlug: null, target: "_self" },
  { label: "Values", url: "#values", pageSlug: null, target: "_self" },
  { label: "Services", url: "#services", pageSlug: null, target: "_self" },
  { label: "Events", url: "#events", pageSlug: null, target: "_self" },
  { label: "Gallery", url: "#gallery", pageSlug: null, target: "_self" },
  { label: "Contact", url: "#contact", pageSlug: null, target: "_self" },
];

export const defaultGlobalSeo = {
  metaTitle: "The Eagle Centre for International Ministries",
  metaDescription:
    "A non-profit organization raising a generation of kingdom-minded people of integrity and the Word — as Light, Trumpets and Swords.",
  canonicalUrl: null,
};


export const homePageSeed: { slug: string; title: string; sections: SeedSection[] } = {
  slug: "home",
  title: "Home",
  sections: [
    {
      template: "hero",
      layout: "full_height",
      label: "Hero",
      content: {
        label: "The Eagle Centre for International Ministries",
        title: "We are being",
        titleBreak: "forged for purpose.",
        subtitle:
          "Watch the process. God takes the unfinished and prepares it — as Light, as Trumpets, as Swords.",
        identities: [
          {
            slug: "light",
            label: "We are Light",
            bgFilter: "hero-bg--light",
            backgroundImage:
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1800&q=85&sat=-85",
            steps: [
              {
                num: "01",
                title: "Darkness",
                body: "Where every story begins — without Him we walk in darkness.",
                verse: "The people walking in darkness have seen a great light. — Isaiah 9:2",
                image:
                  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80",
              },
              {
                num: "02",
                title: "The Spark",
                body: "The Word and the Spirit ignite. God speaks light into us.",
                verse: "Let there be light. — Genesis 1:3",
                image:
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
              },
              {
                num: "03",
                title: "The Flame",
                body: "A tender flame must be protected. He will not snuff out a smoldering wick.",
                verse: "A smoldering wick he will not snuff out. — Isaiah 42:3",
                image:
                  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
              },
              {
                num: "04",
                title: "The Lamp",
                body: "Light is placed in a vessel — our lives become carriers of His presence.",
                verse: "Your word is a lamp to my feet. — Psalm 119:105",
                image:
                  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&q=80",
              },
              {
                num: "05",
                title: "Growing Light",
                body: "Oil is supplied. What was private becomes public; the flame strengthens.",
                verse: "Arise, shine, for your light has come. — Isaiah 60:1",
                image:
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80",
              },
              {
                num: "06",
                title: "Many Lights",
                body: "One lamp lights another. A city on a hill. The Kingdom multiplies.",
                verse: "Let your light shine before others. — Matthew 5:16",
                image:
                  "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=500&q=80",
              },
            ],
          },
          {
            slug: "trumpets",
            label: "We are Trumpets",
            bgFilter: "hero-bg--trumpets",
            backgroundImage:
              "https://tecim-website.netlify.app/assets/trumpet2-DrZ1v3qS.jpg",
            steps: [
              {
                num: "01",
                title: "Selecting the Horn",
                body: "God chooses vessels according to His purpose — not by outward appearance.",
                verse: "The Lord looks at the heart. — 1 Samuel 16:7",
                image:
                  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&q=80",
              },
              {
                num: "02",
                title: "Cleaning",
                body: "Holiness begins with cleansing. Residue is removed so we are ready.",
                verse: "Wash me, and I will be whiter than snow. — Psalm 51:7",
                image:
                  "https://images.unsplash.com/photo-1581093458791-9d42e3c7e498?w=500&q=80",
              },
              {
                num: "03",
                title: "Cutting & Hollowing",
                body: "Space is made for breath — for the breath of God to fill us.",
                verse: "He has made everything beautiful in its time. — Ecclesiastes 3:11",
                image:
                  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80",
              },
              {
                num: "04",
                title: "Shaping the Sound",
                body: "Our lives are shaped so His voice carries clear and far.",
                verse: "My sheep listen to my voice. — John 10:27",
                image:
                  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80",
              },
              {
                num: "05",
                title: "Polishing",
                body: "Beauty and function meet. The instrument is ready to be lifted.",
                verse: "Let your light shine before others. — Matthew 5:16",
                image:
                  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&q=80",
              },
              {
                num: "06",
                title: "The Call",
                body: "Breath enters. A clear sound goes out. We declare the word of the Lord.",
                verse: "Declare his glory among the nations. — Psalm 96:3",
                image:
                  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
              },
            ],
          },
          {
            slug: "swords",
            label: "We are Swords",
            bgFilter: "hero-bg--swords",
            backgroundImage:
              "https://tecim-website.netlify.app/assets/sword-CnCLy4nw.jpg",
            steps: [
              {
                num: "01",
                title: "Selecting Steel",
                body: "High-carbon steel is chosen for purpose. God selects raw material with intent.",
                verse: "You refined us like silver. — Psalm 66:10",
                image:
                  "https://tecim-website.netlify.app/assets/sword-CnCLy4nw.jpg",
              },
              {
                num: "02",
                title: "Forging",
                body: "Heated and hammered into shape. Pressure and heat form what will cut.",
                verse: "As iron sharpens iron, so one person sharpens another. — Proverbs 27:17",
                image:
                  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80",
              },
              {
                num: "03",
                title: "Heat Treating",
                body: "Hardened, then tempered — strength without brittleness. The Lord tests the heart.",
                verse: "The Lord tests the heart. — Proverbs 17:3",
                image:
                  "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=500&q=80",
              },
              {
                num: "04",
                title: "Grinding",
                body: "The edge is refined. What was rough is made precise and beautiful.",
                verse: "He will sit as a refiner and purifier of silver. — Malachi 3:3",
                image:
                  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&q=80",
              },
              {
                num: "05",
                title: "Adding the Hilt",
                body: "Balance and secure grip. We are fitted for the hand of the Master.",
                verse: "The sword of the Spirit, which is the word of God. — Ephesians 6:17",
                image:
                  "https://images.unsplash.com/photo-1612197527762-8cfb755a4d9d?w=500&q=80",
              },
              {
                num: "06",
                title: "Inspection",
                body: "Balance, strength, and sharpness are proven. Ready for purpose.",
                verse: "Examine yourselves… test yourselves. — 2 Corinthians 13:5",
                image:
                  "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&q=80",
              },
            ],
          },
        ],
      },
    },
    {
      template: "about_image_left",
      layout: "image_left",
      label: "About",
      content: {
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
      },
    },
    {
      template: "values",
      layout: "default",
      label: "Core Values",
      content: {
        label: "Core Values",
        title: "What shapes how we live and lead",
        cards: [
          {
            title: "Relationships & Accountability",
            text: "True kingdom relationships. Accountability, covering, oversight, fatherhood and sonship mentoring — maximizing potential all round.",
          },
          {
            title: "Servant-Leadership & Integrity",
            text: "Integrity never sacrificed on altars of fame, funds, fear or favour. Leadership rooted in humility and godly character.",
          },
          {
            title: "A Culture of Excellence",
            text: "Diligence, Honour, Service, Humility, Passion, Joy. Kingdom-minded. Strong in the Word. Functioning at full potential.",
          },
        ],
      },
    },
    {
      template: "vision",
      layout: "default",
      label: "Vision & Mission",
      content: {
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
      },
    },
    {
      template: "services",
      layout: "default",
      label: "Services",
      content: {
        label: "Services",
        title: "What's Happening",
        sub: "Join us throughout the week as we gather to be taught, to pray and to worship — as Light, Trumpets and Swords.",
        ctaLabel: "Plan a Visit",
        ctaHref: "#contact",
        rows: [
          {
            day: "Thursday",
            time: "6:00 – 8:00pm",
            tag: "Teaching",
            title: "Teaching Service",
            description:
              "Clear teaching and training that strengthens the foundation of faith and ministry.",
          },
          {
            day: "Friday",
            time: "7:00 – 9:00pm",
            tag: "Prayer",
            title: "Prayer Meeting",
            description:
              "Intercession, alignment and encounter with the presence of God.",
          },
          {
            day: "Sunday",
            time: "7:00 – 11:30am",
            tag: "Worship",
            title: "Worship Service",
            description:
              "Gather to worship, receive the Word and be sent as light, trumpets and swords.",
          },
        ],
      },
    },
    {
      template: "events",
      layout: "grid",
      label: "Events",
      content: {
        label: "Conferences & Events",
        title: "Upcoming gatherings",
        events: [
          {
            date: "July 03 – 06, 2024",
            title: "Hadassah Fellowship International Conference",
            location: "Ghanaman Soccer Center",
            image:
              "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=85",
            imageAlt: "Crowd at a worship conference",
          },
          {
            date: "August 12 – 16, 2024",
            title: "Wise Master Builders International Conference",
            location: "Oasis International Training Center",
            image:
              "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&q=85",
            imageAlt: "Conference audience listening",
          },
        ],
      },
    },
    {
      template: "gallery",
      layout: "default",
      label: "Gallery",
      content: {
        label: "Gallery",
        title: "Moments from the journey",
        sub: "Glimpses from the altar, the classroom and the field — where light is kindled, trumpets are sounded, and swords are sharpened.",
        reelTag: "TECIM Archive — Reel 01",
        moreLabel: "View more",
        moreHref: "#",
        rowA: [
          "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=700&q=80",
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700&q=80",
          "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=700&q=80",
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&q=80",
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&q=80",
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80",
          "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=700&q=80",
        ],
        rowB: [
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80",
          "https://images.unsplash.com/photo-1523803326055-13445f07c5b5?w=600&q=80",
          "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80",
          "https://images.unsplash.com/photo-1508616873209-8f2695fc19e3?w=600&q=80",
          "https://images.unsplash.com/photo-1571659669963-49c5c9d69dd9?w=600&q=80",
        ],
      },
    },
    {
      template: "contact",
      layout: "default",
      label: "Contact",
      content: {
        label: "Stay in Touch",
        title: "Find us & connect",
        sub: "Three congregations, one family. Find the location nearest you and come as you are.",
        locations: [
          { name: "Shiashie", query: "Shiashie, Accra, Ghana" },
          { name: "Madina", query: "Madina, Accra, Ghana" },
          { name: "Prampram", query: "Prampram, Ghana" },
        ],
        addressLines: ["123 Main St, San Francisco, CA 94105"],
        addressNote: "(Update with actual Ghana address)",
        directionsLabel: "Get Directions",
        directionsHref: "https://www.google.com/maps?q=Shiashie,+Accra,+Ghana",
        hours: [
          { day: "Monday", time: "Closed" },
          { day: "Tue – Fri", time: "8:20am – 4:30pm" },
          { day: "Saturday", time: "Closed" },
          { day: "Sunday", time: "7:00am – 11:30am" },
        ],
        email: "theeaglecenter1@gmail.com",
        phones: ["+233 271 503 760", "+233 265 508 760"],
      },
    },
  ],
};
