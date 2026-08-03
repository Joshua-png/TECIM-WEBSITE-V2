export type IdentitySlug = "light" | "trumpets" | "swords";

export type HeroStep = {
  num: string;
  title: string;
  body: string;
  verse: string;
  image: string;
};

export type HeroIdentity = {
  slug: IdentitySlug;
  label: string;
  backgroundImage: string;
  bgFilter: string;
  steps: HeroStep[];
};

export type HeroContent = {
  label: string;
  title: string;
  titleBreak: string;
  subtitle: string;
  identities: HeroIdentity[];
};

export const heroContent: HeroContent = {
  label: "The Eagle Centre for International Ministries",
  title: "We are being",
  titleBreak: "forged for purpose.",
  subtitle:
    "Watch the process. God takes the unfinished and prepares it — as Light, as Trumpets, as Swords.",
  identities: [
    {
      slug: "light",
      label: "We are Light",
      backgroundImage:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1800&q=85&sat=-85",
      bgFilter: "hero-bg--light",
      steps: [
        {
          num: "01",
          title: "Darkness",
          body: "Where every story begins — without Him we walk in darkness.",
          verse: "The people walking in darkness have seen a great light. — Isaiah 9:2",
          image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80",
        },
        {
          num: "02",
          title: "The Spark",
          body: "The Word and the Spirit ignite. God speaks light into us.",
          verse: "Let there be light. — Genesis 1:3",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
        },
        {
          num: "03",
          title: "The Flame",
          body: "A tender flame must be protected. He will not snuff out a smoldering wick.",
          verse: "A smoldering wick he will not snuff out. — Isaiah 42:3",
          image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
        },
        {
          num: "04",
          title: "The Lamp",
          body: "Light is placed in a vessel — our lives become carriers of His presence.",
          verse: "Your word is a lamp to my feet. — Psalm 119:105",
          image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&q=80",
        },
        {
          num: "05",
          title: "Growing Light",
          body: "Oil is supplied. What was private becomes public; the flame strengthens.",
          verse: "Arise, shine, for your light has come. — Isaiah 60:1",
          image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80",
        },
        {
          num: "06",
          title: "Many Lights",
          body: "One lamp lights another. A city on a hill. The Kingdom multiplies.",
          verse: "Let your light shine before others. — Matthew 5:16",
          image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=500&q=80",
        },
      ],
    },
    {
      slug: "trumpets",
      label: "We are Trumpets",
      backgroundImage:
        "https://tecim-website.netlify.app/assets/trumpet2-DrZ1v3qS.jpg",
      bgFilter: "hero-bg--trumpets",
      steps: [
        {
          num: "01",
          title: "Selecting the Horn",
          body: "God chooses vessels according to His purpose — not by outward appearance.",
          verse: "The Lord looks at the heart. — 1 Samuel 16:7",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&q=80",
        },
        {
          num: "02",
          title: "Cleaning",
          body: "Holiness begins with cleansing. Residue is removed so we are ready.",
          verse: "Wash me, and I will be whiter than snow. — Psalm 51:7",
          image: "https://images.unsplash.com/photo-1581093458791-9d42e3c7e498?w=500&q=80",
        },
        {
          num: "03",
          title: "Cutting & Hollowing",
          body: "Space is made for breath — for the breath of God to fill us.",
          verse: "He has made everything beautiful in its time. — Ecclesiastes 3:11",
          image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80",
        },
        {
          num: "04",
          title: "Shaping the Sound",
          body: "Our lives are shaped so His voice carries clear and far.",
          verse: "My sheep listen to my voice. — John 10:27",
          image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80",
        },
        {
          num: "05",
          title: "Polishing",
          body: "Beauty and function meet. The instrument is ready to be lifted.",
          verse: "Let your light shine before others. — Matthew 5:16",
          image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&q=80",
        },
        {
          num: "06",
          title: "The Call",
          body: "Breath enters. A clear sound goes out. We declare the word of the Lord.",
          verse: "Declare his glory among the nations. — Psalm 96:3",
          image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
        },
      ],
    },
    {
      slug: "swords",
      label: "We are Swords",
      backgroundImage:
        "https://tecim-website.netlify.app/assets/sword-CnCLy4nw.jpg",
      bgFilter: "hero-bg--swords",
      steps: [
        {
          num: "01",
          title: "Selecting Steel",
          body: "High-carbon steel is chosen for purpose. God selects raw material with intent.",
          verse: "You refined us like silver. — Psalm 66:10",
          image: "https://tecim-website.netlify.app/assets/sword-CnCLy4nw.jpg",
        },
        {
          num: "02",
          title: "Forging",
          body: "Heated and hammered into shape. Pressure and heat form what will cut.",
          verse: "As iron sharpens iron, so one person sharpens another. — Proverbs 27:17",
          image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80",
        },
        {
          num: "03",
          title: "Heat Treating",
          body: "Hardened, then tempered — strength without brittleness. The Lord tests the heart.",
          verse: "The Lord tests the heart. — Proverbs 17:3",
          image: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=500&q=80",
        },
        {
          num: "04",
          title: "Grinding",
          body: "The edge is refined. What was rough is made precise and beautiful.",
          verse: "He will sit as a refiner and purifier of silver. — Malachi 3:3",
          image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&q=80",
        },
        {
          num: "05",
          title: "Adding the Hilt",
          body: "Balance and secure grip. We are fitted for the hand of the Master.",
          verse: "The sword of the Spirit, which is the word of God. — Ephesians 6:17",
          image: "https://images.unsplash.com/photo-1612197527762-8cfb755a4d9d?w=500&q=80",
        },
        {
          num: "06",
          title: "Inspection",
          body: "Balance, strength, and sharpness are proven. Ready for purpose.",
          verse: "Examine yourselves… test yourselves. — 2 Corinthians 13:5",
          image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&q=80",
        },
      ],
    },
  ],
};
