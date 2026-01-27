import "dotenv/config";
import { users, products } from "./schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { createDb } from ".";

export const db = createDb(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Seeding database...");

  // --- PASSWORD ---
  const passwordHash = await bcrypt.hash("password123", 10);

  // --- SELLER ---
  const [seller] = await db
    .insert(users)
    .values({
      email: "seller@demo.com",
      passwordHash,
      role: "SELLER",
    })
    .onConflictDoNothing()
    .returning();

  // --- BUYER ---
  await db
    .insert(users)
    .values({
      email: "user@demo.com",
      passwordHash,
      role: "USER",
    })
    .onConflictDoNothing();

  if (!seller) {
    console.log("ℹ️ Seller already exists, fetching...");
  }

  const sellerUser =
    seller ??
    (
      await db.select().from(users).where(eq(users.email, "seller@demo.com"))
    )[0];

  // --- PRODUCTS ---
  const demoProducts = [
    {
      name: "Mechanical Keyboard",
      description: "RGB mechanical keyboard",
      price: 750000,
      stock: 10,
    },
    {
      name: "Gaming Mouse",
      description: "High DPI gaming mouse",
      price: 350000,
      stock: 15,
    },
    {
      name: "27-inch Monitor",
      description: "144Hz IPS display",
      price: 3200000,
      stock: 5,
    },
    {
      name: "Headset",
      description: "Noise cancelling headset",
      price: 550000,
      stock: 8,
    },
    {
      name: "Laptop Stand",
      description: "Aluminum adjustable stand",
      price: 250000,
      stock: 20,
    },
  ];

  for (const product of demoProducts) {
    await db
      .insert(products)
      .values({
        sellerId: (sellerUser && sellerUser.id) || "",
        ...product,
      })
      .onConflictDoNothing();
  }

  console.log("✅ Seeding complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed", err);
  process.exit(1);
});
