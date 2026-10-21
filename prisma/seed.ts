import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const listings = [
  ["Northstar Studio", "northstar-studio", "SaaS", "AI Automation"],
  ["Goodkind Coffee", "goodkind-coffee", "Food", "Artisan Cafe"],
  ["Pixel & Pine", "pixel-and-pine", "Retail", "Minimalist Gear"],
  ["Orbit Analytics", "orbit-analytics", "Tech", "Data Intelligence"],
  ["Brightside Co.", "brightside-co", "Services", "Creative Studio"],
  ["Cloudberry", "cloudberry", "Food", "Botanical Blends"],
  ["Forma Works", "forma-works", "Tech", "Thoughtful Design"],
  ["Sunday Supply", "sunday-supply", "Retail", "Everyday Essentials"],
  ["Kindred House", "kindred-house", "Services", "Home Styling"],
  ["Little Loom", "little-loom", "Retail", "Artisan Textiles"],
  ["Morrow Health", "morrow-health", "Health", "Daily Wellness"],
  ["Openfield", "openfield", "SaaS", "Team Workflow"],
  ["Golden Hour", "golden-hour", "Food", "Small Batch Bakes"],
  ["Forma Foundry", "forma-foundry", "Tech", "Product Design"],
  ["Field Notes", "field-notes", "Retail", "Paper Goods"],
  ["Good Measure", "good-measure", "Services", "Growth Strategy"],
  ["Sunday State", "sunday-state", "Wellness", "Mindful Living"],
  ["Copperline", "copperline", "Retail", "Modern Ceramics"],
  ["Signal & Story", "signal-and-story", "SaaS", "Brand Intelligence"],
  ["Wildwood Table", "wildwood-table", "Food", "Seasonal Kitchen"],
] as const;

const adSlots = [
  {
    id: "seed-ad-northstar",
    title: "Northstar Studio",
    category: "SaaS · AI Automation",
    tier: "FEATURED",
    pricePerWeek: 80,
    views: 3420,
    clicks: 128,
  },
  {
    id: "seed-ad-goodkind",
    title: "Goodkind Coffee",
    category: "Food · Artisan Cafe",
    tier: "FEATURED",
    pricePerWeek: 40,
    views: 2810,
    clicks: 94,
  },
  {
    id: "seed-ad-pixel-pine",
    title: "Pixel & Pine",
    category: "Retail · Minimalist Gear",
    tier: "MEDIUM",
    pricePerWeek: 25,
    views: 2490,
    clicks: 76,
  },
  {
    id: "seed-ad-orbit",
    title: "Orbit Analytics",
    category: "Tech · Data Intelligence",
    tier: "MEDIUM",
    pricePerWeek: 20,
    views: 2180,
    clicks: 63,
  },
  {
    id: "seed-ad-sunday",
    title: "Sunday Supply",
    category: "Retail · Everyday Essentials",
    tier: "STANDARD",
    pricePerWeek: 12,
    views: 1920,
    clicks: 57,
  },
  {
    id: "seed-ad-brightside",
    title: "Brightside Co.",
    category: "Services · Creative Studio",
    tier: "STANDARD",
    pricePerWeek: 10,
    views: 1640,
    clicks: 48,
  },
  {
    id: "seed-ad-cloudberry",
    title: "Cloudberry",
    category: "Food · Botanical Blends",
    tier: "STANDARD",
    pricePerWeek: 8,
    views: 1470,
    clicks: 41,
  },
  {
    id: "seed-ad-forma",
    title: "Forma Works",
    category: "Tech · Thoughtful Design",
    tier: "STANDARD",
    pricePerWeek: 8,
    views: 1210,
    clicks: 32,
  },
] as const;

async function main() {
  for (const [name, slug, category, tag] of listings) {
    await prisma.businessListing.upsert({
      where: { slug },
      create: {
        name,
        slug,
        category,
        tag,
        websiteUrl: `https://${slug}.example`,
        description: `${tag} from the Home Talk community.`,
      },
      update: { name, category, tag },
    });
  }

  for (const slot of adSlots) {
    const { id, ...data } = slot;
    await prisma.adSlot.upsert({
      where: { id },
      create: { id, ...data },
      update: {
        title: data.title,
        category: data.category,
        tier: data.tier,
        pricePerWeek: data.pricePerWeek,
      },
    });
  }

  console.info(
    `Seeded ${listings.length} business listings and ${adSlots.length} billboard slots.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Prisma seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
