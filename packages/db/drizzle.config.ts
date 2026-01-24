import type { Config } from "drizzle-kit";
import "dotenv/config";

console.log(process.env.DATABASE_URL);

export default {
  schema: "./schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
} satisfies Config;
