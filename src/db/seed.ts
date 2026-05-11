import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const brands = [
  { slug: "camel", name: "Camel", defaultPriceMinor: 1000, sortOrder: 1 },
  { slug: "lucky-strike", name: "Lucky Strike", defaultPriceMinor: 1200, sortOrder: 2 },
  { slug: "gold-leaf", name: "Gold Leaf", defaultPriceMinor: 1500, sortOrder: 3 },
  { slug: "marlboro", name: "Marlboro", defaultPriceMinor: 2000, sortOrder: 4 },
  { slug: "bs", name: "B&S", defaultPriceMinor: 2000, sortOrder: 5 },
];

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding cigarette brands…");

  for (const brand of brands) {
    await db
      .insert(schema.cigaretteBrands)
      .values({ ...brand, currency: "BDT" })
      .onConflictDoUpdate({
        target: schema.cigaretteBrands.slug,
        set: {
          name: brand.name,
          defaultPriceMinor: brand.defaultPriceMinor,
          sortOrder: brand.sortOrder,
        },
      });
    console.log(`  ✓ ${brand.name} (৳${brand.defaultPriceMinor / 100})`);
  }

  console.log("✅ Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
